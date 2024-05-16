const WebSocket = require('ws');
var questionsForUser = [];

const wss = new WebSocket.Server({ port: 8080 }); // Il server WebSocket ascolterà sulla porta 8080
//const wss = new WebSocket("ws://localhost:8081");

wss.on('connection', (ws) => {
  console.log('Nuova connessione WebSocket');

  ws.on('message', (message) => {
    console.log(`Ricevuto messaggio: ${message}`);

    // Echol il messaggio indietro al client
    ws.send(JSON.stringify(questionsForUser));
  });

  ws.on('close', () => {
    console.log('Connessione WebSocket chiusa');
  });
});

async function fetchData() {
  let url = 'https://opentdb.com/api.php?amount=10';

  // if (category) {
  //     url += &category=${category};
  // }
  // if (difficulty) {
  //     url += &difficulty=${difficulty};
  // }
  // if (type) {
  //     url += &type=${type};
  // }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;  // Save the JSON data into a variable
  } catch (error) {
    console.error('Error:', error);
    return null;  // Handle the error by returning null or an appropriate value
  }
}

fetchData().then(data => {
  const questions = [];
  if (data) {
    for (let index = 0; index < data.results.length; index++) {
      const tempArray = [...data.results[index].incorrect_answers];
      tempArray.push(data.results[index].correct_answer);
      const tempObj = {
        answer: shuffle(tempArray),
        type: data.results[index].type,
        difficulty: data.results[index].difficulty,
        category: data.results[index].category,
        question: data.results[index].question,
      };
      questions.push(tempObj);
    }
    questionsForUser = [...questions];
  }
});

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

console.log('Server WebSocket in ascolto sulla porta 8080');
