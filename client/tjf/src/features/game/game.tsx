import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React, { useEffect, useState, useRef } from "react";
import Question from "./question";
import "../../App.css";
import Counter from "../counter/Counter";

const Game: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [timeOut, setTimeOut] = useState<boolean>(false);
  const webSocket = useRef<WebSocket | null>(null);

  // Creazione della connessione WebSocket quando il componente viene montato
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // Sostituisci con l'URL del tuo server WebSocket

    // Gestione degli eventi WebSocket
    ws.onopen = () => {
      console.log("Connessione WebSocket aperta");
      webSocket.current = ws;
    };

    ws.onmessage = (event) => {
      console.log("Messaggio ricevuto dal server WebSocket:", event.data);
      // Gestisci i messaggi ricevuti dal server WebSocket secondo le tue esigenze
    };

    ws.onclose = () => {
      console.log("Connessione WebSocket chiusa");
    };

    // Cleanup
    return () => {
      if (webSocket.current) {
        webSocket.current.close();
      }
    };
  }, []); // Esegui una sola volta durante il montaggio del componente

  // Funzione per inviare una risposta al server tramite WebSocket
  const handleAnswerSubmit = (answer: string | null) => {
    setUserAnswer(answer);
    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(JSON.stringify({ answer: answer }));
    }
    console.log("Risposta inviata al server:", answer);
  };

  // Funzione per impostare il timeout
  const setTime = (value: boolean) => {
    setTimeOut(value);
    console.log("hasTimeRunOut:", value);
  };

  return (
    <>
      <Counter timeRunOut={setTime} />

      <Question onAnswerSubmit={handleAnswerSubmit} />
      <h1>Sono la pagina Game e ho un bottone</h1>
    </>
  );
};

export default Game;
