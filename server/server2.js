const WebSocket = require('ws'); // Assuming you are using Node.js with the 'ws' library

// Store connected users, lobby state, and user scores
let users = [];
let master = null;
let gameStarted = false;
let scores = {};

// Function to shuffle an array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to send the updated rankings to all users
function sendRankings() {
    const rankings = Object.entries(scores).map(([userId, score]) => ({ userId, username: getUserById(userId).username, score }));
    rankings.sort((a, b) => b.score - a.score); // Sort by score descending

    const message = {
        type: 'ranking',
        rankings: rankings
    };

    users.forEach(user => user.websocket.send(JSON.stringify(message)));
}

// Function to get user by ID
function getUserById(userId) {
    return users.find(user => user.id === userId);
}

// Function to send the updated user list to all users
function sendUserList() {
    const userList = users.map(user => ({ id: user.id, username: user.username }));

    const message = {
        type: 'userList',
        users: userList
    };

    users.forEach(user => user.websocket.send(JSON.stringify(message)));
}

// Function to handle sending questions and collecting responses
async function sendQuestions(questions) {
    for (const question of questions) {
        let choices;
        if (question.type === 'boolean') {
            choices = ['True', 'False'];
        } else {
            choices = shuffle([...question.incorrect_answers, question.correct_answer]);
        }

        // Send the question and choices to the users
        const message = {
            type: 'question',
            question: question.question,
            choices: choices,
            questionIndex: questions.indexOf(question) // Include index for tracking
        };
        users.forEach(user => user.websocket.send(JSON.stringify(message)));

        const userResponses = {};
        const startTime = Date.now();

        // Function to handle user response
        const handleUserResponse = (userId, userAnswer) => {
            const timeUsed = (Date.now() - startTime) / 1000;
            let score = 0;
            if (userAnswer === question.correct_answer) {
                score = 1000 * (timeUsed / 30);
            }
            userResponses[userId] = score;
            // Update the user's score
            scores[userId] = (scores[userId] || 0) + score;
            // Send the score back to the user
            users.find(user => user.id === userId).websocket.send(JSON.stringify({ type: 'score', userId, score, questionIndex: message.questionIndex }));
        };

        // Set up a 30-second timeout to move to the next question
        await new Promise(resolve => {
            const timeout = setTimeout(() => {
                resolve();
            }, 30000); // 30 seconds

            // Listen for user responses
            users.forEach(user => {
                user.websocket.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.type === 'answer' && data.questionIndex === message.questionIndex) {
                        handleUserResponse(data.userId, data.answer);
                        // If all users have responded, clear the timeout and resolve
                        if (Object.keys(userResponses).length === users.length) {
                            clearTimeout(timeout);
                            resolve();
                        }
                    }
                };
            });
        });

        // Send the updated rankings after each question
        sendRankings();

        // Wait 5 seconds before moving to the next question
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds delay
    }

    // Reset scores after the game ends
    scores = {};
}

// Example WebSocket connection and handling
const websocketServer = new WebSocket.Server({ port: 8080 });

websocketServer.on('connection', (websocket) => {
    let userId = Date.now();
    let username;

    websocket.on('message', async (message) => {
        const data = JSON.parse(message);

        // Handle username assignment
        if (data.type === 'setUsername') {
            if (users.some(user => user.username === data.username)) {
                websocket.send(JSON.stringify({ type: 'error', message: 'Username already taken' }));
            } else {
                username = data.username;
                users.push({ id: userId, username, websocket });
                scores[userId] = 0;  // Initialize the user's score

                if (!master) {
                    master = userId;
                    websocket.send(JSON.stringify({ type: 'master' }));
                }

                websocket.send(JSON.stringify({ type: 'connected', userId, username }));
                sendUserList();

                if (users.length > 1 && master) {
                    const masterSocket = users.find(user => user.id === master).websocket;
                    masterSocket.send(JSON.stringify({ type: 'start-enabled' }));
                }
            }
        }

        // Handle starting the game
        if (data.type === 'start' && data.userId === master && users.length > 1 && !gameStarted) {
            gameStarted = true;
            const questionsData = await fetchData(data);
            if (questionsData) {
                await sendQuestions(questionsData.results);
            }
            gameStarted = false;
            sendUserList(); // Update the user list after the game ends
        }
    });

    websocket.on('close', () => {
        users = users.filter(user => user.id !== userId);
        delete scores[userId];  // Remove the user's score
        sendUserList();

        if (userId === master) {
            if (users.length > 0) {
                master = users[0].id;
                users[0].websocket.send(JSON.stringify({ type: 'master' }));
            } else {
                master = null;
            }
        }
    });
});

async function fetchData(data) {
    const categoryParam = data.category !== 'any' ? `&category=${data.category}` : '';
    const difficultyParam = data.difficulty !== 'any' ? `&difficulty=${data.difficulty}` : '';
    const typeParam = data.qtype !== 'any' ? `&type=${data.qtype}` : '';
    const url = `https://opentdb.com/api.php?amount=10${categoryParam}${difficultyParam}${typeParam}`;
    const response = await fetch(url);
    return response.json();
}
