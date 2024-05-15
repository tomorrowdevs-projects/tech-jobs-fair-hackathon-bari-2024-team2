const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }); // Il server WebSocket ascolterà sulla porta 8080
//const wss = new WebSocket("ws://localhost:8081");

wss.on('connection', (ws) => {
  console.log('Nuova connessione WebSocket');

  ws.on('message', (message) => {
    console.log(`Ricevuto messaggio: ${message}`);

    // Echol il messaggio indietro al client
    ws.send(`Hai inviato: ${message}`);
  });

  ws.on('close', () => {
    console.log('Connessione WebSocket chiusa');
  });
});

console.log('Server WebSocket in ascolto sulla porta 8080');
