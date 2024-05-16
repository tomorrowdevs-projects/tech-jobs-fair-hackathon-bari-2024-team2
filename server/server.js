const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Il server WebSocket ascolterà sulla porta 8080
//const wss = new WebSocket("ws://localhost:8081");

wss.on('connection', (ws) => {
  console.log('Nuova connessione WebSocket');

  ws.on('message', (message) => {
    console.log(`Ricevuto messaggio: ${message}`);
    obj = {
      msg: message,
      t: false
    }
    const ar = [0, '1'];
    respons = test1(obj);
    // console.log('message = ');
    // console.log(typeof message);
    // console.log(message.toString());
    // Echol il messaggio indietro al client
    ws.send(JSON.stringify(obj));
  });

  ws.on('close', () => {
    console.log('Connessione WebSocket chiusa');
  });
});

const test1 = (testObj) => {
  // console.log('testObj');
  // console.log(testObj);
  testObj.t = true;
  fetch("https://opentdb.com/api.php?amount=10")
    .then((answer) => {
      if (answer.ok) return answer.json();
    }).then((result) => {
      // console.log('result');
      console.log(result.results);
    }).catch((error) => {
      console.log(error);
    })
  return testObj;
}

console.log('Server WebSocket in ascolto sulla porta 8080');
