import React, { useEffect, useState, useRef } from "react";
import ButtonComponent from "../../shared/design/button/ButtonComponent";
import "../../shared/design/button/button.scss";
import "../../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
//import WebSocket from "ws";

const Home: React.FC = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isAudioMuted, setIsAudioMuted] = React.useState(false);
  const [webSocket, setWebSocket] = React.useState<WebSocket | null>(null);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [addressIp, setAddressIp] = React.useState<string | null>(null);

  const toggleAudio = () => {
    setIsAudioMuted((prevState) => !prevState);
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const fetcIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org");
      const data = await response.text();
      setAddressIp(data);
      // console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const newGame = (e: any) => {
    // console.log("Sono Azione Uno");
    if (userName === null) alert("e' necessario inserire un nome");
    else {
      const objToServer = {
        msg: `join`,
        userName,
        addressIp,
      }
      // console.log('objToServer');
      // console.log(objToServer);
      
      // Verifica se la connessione WebSocket è aperta e webSocket non è null
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        // Invia un messaggio al server
        webSocket.send(JSON.stringify(objToServer));
      } else {
        console.error("Connessione WebSocket non disponibile o non aperta.");
      }
    }
  };
  const codeGame = () => {
    console.log("Sono Azione Due");
  };

  useEffect(() => {
    fetcIP();

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("Connessione WebSocket aperta nella pagina Home");
      setWebSocket(ws);
    };

    ws.onmessage = (event) => {
      const questionsForUser = JSON.parse(event.data)

      console.log(
        "Messaggio ricevuto dal server WebSocket nella pagina Home:",
        questionsForUser
      );
    };

    ws.onclose = () => {
      console.log("Connessione WebSocket chiusa nella pagina Home");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/backgroundmusic.mp3" loop preload="auto" />

      <div className="audio-toggle" onClick={toggleAudio}>
        {isAudioMuted ? (
          <FontAwesomeIcon icon={faVolumeHigh} />
        ) : (
          <FontAwesomeIcon icon={faVolumeXmark} />
        )}
      </div>

      <div>
        <img className="logo" src="./logoquiz.jpeg" alt="" />
      </div>
      <div>
        <h1
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Benvenuto!
        </h1>

        <h2
          className="h2home"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Inizia una nuova partita o inserisci un codice per entrare in una stanza
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
       <input
          type="text"
          id="name"
          className="input-text"
          placeholder="Inserisci Nome"
          onChange={(e: any) => {
            setUserName(e.target.value);
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonComponent
          text="Inizia Nuova Partita"
          clickButton={newGame}
          classNames="custom-btn custom-btn-primary button-19"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          id="code"
          className="input-text"
          placeholder="Codice partita"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ButtonComponent
          text="Usa Codice"
          clickButton={codeGame}
          classNames="btn btn-primary"
        />
      </div>
    </>
  );
};

export default Home;
