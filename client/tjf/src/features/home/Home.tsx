import React, { useEffect, useState, useRef } from "react";
import ButtonComponent from "../../shared/design/button/ButtonComponent";
import "../../shared/design/button/button.scss";
import "../../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import ContDown from "../game/countDown";
//import WebSocket from "ws";

const Home: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  // const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [master, setMaster] = useState(false);
  const [startEnabled, setStartEnabled] = useState(false);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [rankings, setRankings] = useState([]);
  const [score, setScore] = useState(0);
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

  const fetchIP = async () => {
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
        typeRequest: `join`,
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

  useEffect(
    () => {
      const ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("Connessione WebSocket aperta nella pagina Home");
        setWebSocket(ws);
        setConnected(true);
      };

      ws.onmessage = (event) => {
        console.log("onmessage--------------");

        const data = JSON.parse(event.data);
        console.log(data);

        switch (data.type) {
          case "connected":
            setUserId(data.userId);
            break;
          case "error":
            toast.error(data.message);
            break;
          case "master":
            setMaster(true);
            break;
          case "start-enabled":
            setStartEnabled(true);
            break;
          case "userList":
            console.log("userList");
            setUsers(data.users);
            console.log(users);

            break;
          case "question":
            setQuestion(data.question);
            setChoices(data.choices);
            setSelectedAnswer("");
            break;
          case "score":
            if (data.userId === userId) {
              setScore(data.score);
              toast.info(`Your score for this question: ${data.score}`);
            }
            break;
          case "ranking":
            setRankings(data.rankings);
            break;
          default:
            break;
        }
      };

      ws.onclose = () => {
        console.log("Connessione WebSocket chiusa nella pagina Home");
      };

      return () => {
        ws.close();
        console.log("CHIUSO");
      };
    },
    [
      // userId
    ]
  ); //end useEffect

  const handleSetUsername = () => {
    if (username && username.trim() === "") {
      toast.error("Username cannot be empty");
      return;
    }
    webSocket &&
      webSocket.send(JSON.stringify({ type: "setUsername", username }));
  };

  const handleStartGame = () => {
    if (master) {
      ws2.send(
        JSON.stringify({
          type: "start",
          userId,
          category: "any",
          difficulty: "any",
          qtype: "any",
        })
      );
    }
  };

  const handleAnswerSubmit = (choice: any) => {
    setSelectedAnswer(choice);
    ws2.send(
      JSON.stringify({
        type: "answer",
        userId,
        answer: choice,
        questionIndex: "questionIndex",
      })
    );
  };

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

  const handleKeyPress = (event:any) => {
    if(event.key === 'Enter'){
      handleSetUsername();
    }
  }

  return (
    <>
      <div className="App">
        <div>
          <img className="logo" src="./logoquiz.jpeg" alt="" />
        </div>

        <audio ref={audioRef} src="/backgroundmusic.mp3" loop preload="auto" />

        <div className="audio-toggle" onClick={toggleAudio}>
          {isAudioMuted ? (
            <FontAwesomeIcon icon={faVolumeHigh} />
          ) : (
            <FontAwesomeIcon icon={faVolumeXmark} />
          )}
        </div>

        <ToastContainer />
        {/* <ContDown></ContDown> */}

        {!connected && <p>Connecting to server...</p>}
        {connected && !userId && (
          // && !username
          <div>
            <input
              type="text"
              placeholder="Enter your username"
              onKeyUp={handleKeyPress}
              onChange={(e: any) => {
                setUsername(e.target.value);
              }}
            />
            <button onClick={handleSetUsername}>Join Game</button>
          </div>
        )}

        {username && (
          <div>
            <h1>Welcome, {username}</h1>
            <div>
              <h2>Users in the lobby:</h2>
              <h3>wait for the first player to start the game</h3>
              <ul>
                {users.map((user: userModel) => (
                  <li key={user.id}>{user.username}</li>
                ))}
              </ul>
              {master && 
              // !question && 
              (
                <div>
                  <button onClick={handleStartGame} disabled={!startEnabled}>
                    Start Game
                  </button>
                  {!startEnabled && <p>Waiting for more players to join...</p>}
                </div>
              )}
            </div>
          </div>
        )}
        {question && (
          <div>
            <h2>{question}</h2>
            <ul>
              {choices.map((choice) => (
                <li key={choice}>
                  <button
                    onClick={() => handleAnswerSubmit(choice)}
                    disabled={!!selectedAnswer}
                  >
                    {choice}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {rankings.length > 0 && (
          <div>
            <h2>Rankings</h2>
            <ul>
              {rankings.map((rank: rankModel, index) => (
                <li key={rank.userId}>
                  {index + 1}. {rank.username}: {rank.score}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* end div className="App" */}
    </>
  );
};

export default Home;
