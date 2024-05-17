const WebSocket = require('ws');
const fetch = require('node-fetch');

var questionsForUser = [];
var questionsFromFetch = [];

const wss = new WebSocket.Server({ port: 8080 }); // Il server WebSocket ascolterà sulla porta 8080
//const wss = new WebSocket("ws://localhost:8081");
const players = [];
let master = null;

wss.on('connection', (ws) => {
  console.log('Nuova connessione WebSocket');

  ws.on('message', async (message) => {
    console.log(`Ricevuto messaggio: ${message}`);

    try {
      const data = JSON.parse(message);
      //console.log('data da user');
      //console.log(data);
      if (data.typeRequest === 'join') {
        // Quando un nuovo giocatore si unisce, aggiungi i suoi dettagli
        const { userName, addressIp } = data;
        const userId = Date.now();
        players.push({ userName, userId, ws, addressIp, socet:0 });
        //console.log('players');
        //console.log(players);
        if (!master) {
          master = userId;
          ws.send(JSON.stringify({ type: 'master', message: `Benvenuto, ${userName}!` }));
        }
        else ws.send(JSON.stringify({ type: 'connected', message: `Benvenuto, ${userName}!` }));
        //console.log(`Giocatore ${userName} con IP ${indirizzoIp} si è collegato.`);
      } else if (data.typeRequest === 'start') {
        const { category, difficulty, type } = data;

        const categoryParam = category !== 'any' ? `&category=${category}` : '';
        const difficultyParam = difficulty !== 'any' ? `&difficulty=${difficulty}` : '';
        const typeParam = type !== 'any' ? `&type=${type}` : '';

        const url = `https://opentdb.com/api.php?amount=10${categoryParam}${difficultyParam}${typeParam}`;

        const response = await fetch(url);
        const triviaData = await response.json();
        //console.log('triviaData');
        //console.log(triviaData);

        if (triviaData.response_code === 0) {
          questionsFromFetch = triviaData.results;
          console.log('questionsFromFetch');
          console.log(typeof questionsFromFetch);
          console.log(questionsFromFetch[0]);
          questionsForUser = triviaData.results.map((question) => ({
            type: question.type,
            question: question.question,
            answers: shuffle([...question.incorrect_answers, question.correct_answer]),
          }));

          questionsForUser = Object.keys(questionsForUser).map((key) => [key, questionsForUser[key]]);
          //console.log('questionsForUser');
          //console.log(typeof questionsForUser);
          //console.log(questionsForUser[0]);
          //console.log(questionsForUser.length);
          const question = questionsForUser[0];

          // Invia le domande al giocatore che ha richiesto il nuovo gioco
          ws.send(JSON.stringify({ type: 'questions', number: 0, question }));
        } else if (data.typeRequest === 'next'){
          const { number, answer, score, addressIp } = data;
          if(answer === questionsForUser[number]) console.log('ok');
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Errore nel recupero delle domande dal server Open Trivia DB' }));
        }
      }
    } catch (error) {
      console.error('Errore durante il processing del messaggio:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Errore durante il processing del messaggio' }));
    }
  });

  ws.on('close', () => {
    // Rimuovi il giocatore disconnesso dall'oggetto players
    for (const userName in players) {
      if (players[userName].ws === ws) {
        console.log(`Giocatore ${userName} disconnesso.`);
        delete players[userName];
        break;
      }
    }
  });
});

// async function fetchData() {
//   let url = 'https://opentdb.com/api.php?amount=10';

//   // if (category) {
//   //     url += &category=${category};
//   // }
//   // if (difficulty) {
//   //     url += &difficulty=${difficulty};
//   // }
//   // if (type) {
//   //     url += &type=${type};
//   // }

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     return data;  // Save the JSON data into a variable
//   } catch (error) {
//     console.error('Error:', error);
//     return null;  // Handle the error by returning null or an appropriate value
//   }
// }

// fetchData().then(data => {
//   const questions = [];
//   if (data) {
//     for (let index = 0; index < data.results.length; index++) {
//       const tempArray = [...data.results[index].incorrect_answers];
//       tempArray.push(data.results[index].correct_answer);
//       const tempObj = {
//         answer: shuffle(tempArray),
//         type: data.results[index].type,
//         difficulty: data.results[index].difficulty,
//         category: data.results[index].category,
//         question: data.results[index].question,
//       };
//       questions.push(tempObj);
//     }
//     questionsForUser = [...questions];
//   }
// });

// Function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


console.log('Server WebSocket in ascolto sulla porta 8080');
