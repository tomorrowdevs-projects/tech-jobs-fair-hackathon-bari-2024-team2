console.log('pippo');
const WebSocket = require("ws");
console.log('WebSocket');
console.log(WebSocket);
const wss = new WebSocket.Server({ port:80 });
wss.on("connection", socket => {
    socket.onmessage = event => {
        console.log(`message received: ${event.data}`);
        //if the client sends an event with the word "ping" the server will send back the response "pong"    
        if (event.data === "ping") {
            socket.send(JSON.stringify("pong"));
        }
    };
});
console.log('--------');
wss.on("connection", socket => {
    socket.onmessage = event => {
        console.log(`message received: ${event.data}`);
        //if the client sends an event with the word "ping" the server will send back the response "pong"    
        if (event.data === "ping") {
            socket.send(JSON.stringify("pong"));
        }
    };
});