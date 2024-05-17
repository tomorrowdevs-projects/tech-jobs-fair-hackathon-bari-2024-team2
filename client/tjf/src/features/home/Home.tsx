import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

import ButtonComponent from "../../shared/design/button/ButtonComponent";
import "../../shared/design/button/button.scss";
import "../../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faVolumeXmark, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import ContDown from "../game/countDown";
//import WebSocket from "ws";

// const ws2 = new WebSocket("ws://localhost:8080");

interface userModel {
  id: string;
  username: string;
}
interface rankModel {
  userId: string;
  username: string;
  score: string;
}

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
  const [questionIndex, setQuestionIndex] = React.useState<number>(0);
  const [isGameStart, setIsGameStart] = React.useState(false);
  const [onCountDown, setOnCountDown] = useState(false);

  const [webSocket, setWebSocket] = React.useState<WebSocket | null>(null);

  const [username, setUsername] = React.useState<string | null>(null);
  // const [addressIp, setAddressIp] = React.useState<string | null>(null);

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

        switch (data.type) {
          case "connected":
            // console.log("connected");

            setUserId(data.userId);
            break;
          case "error":
            toast.error(data.message);
            break;
          case "master":
            // console.log("master");

            setMaster(true);
            break;
          case "start-enabled":
            // console.log("start-enabled");

            setStartEnabled(true);
            break;
          case "userList":
            console.log("userList");
            setUsers(data.users);
            console.log(users);

            break;
          case "question":
            console.log("question----------------------------");
            setOnCountDown(true);
            console.log(data);
            setIsGameStart(true);
            setQuestion(data.question);
            setQuestionIndex(data.questionIndex);
            setChoices(data.choices);
            setSelectedAnswer("");
            break;
          case "score":
            // console.log("score");

            if (data.userId == userId) {
              setScore(data.score);
              toast.info(`Your score for this question: ${data.score}`);
              console.log("data.score");
              console.log(data.score);
            }
            break;
          case "ranking":
            setOnCountDown(false);
            console.log("ranking");
            console.log(data);

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
      webSocket &&
        webSocket.send(
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
    webSocket &&
      webSocket.send(
        JSON.stringify({
          type: "answer",
          userId,
          answer: choice,
          questionIndex: questionIndex,
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

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      handleSetUsername();
    }
  };

  return (
    <>
      <div className="App">
        <div>
          <img className="logo" src="./logoquiz.jpeg" alt="" />
        </div>

        {/* <audio ref={audioRef} src="/backgroundmusic.mp3" loop preload="auto" />

        <div className="audio-toggle" onClick={toggleAudio}>
          {isAudioMuted ? (
            <FontAwesomeIcon icon={faVolumeHigh} />
          ) : (
            <FontAwesomeIcon icon={faVolumeXmark} />
          )}
        </div> */}

        <ToastContainer />
        {onCountDown && <ContDown></ContDown>}
        {!connected && <p>Connecting to server...</p>}
        {connected && !userId && (
          // && !username
          <div className="centered-container">
            <input
              type="text"
              placeholder="Enter your username"
              onKeyUp={handleKeyPress}
              onChange={(e: any) => {
                setUsername(e.target.value);
              }}
              className="styled-input"
            />

            <button onClick={handleSetUsername} className="button-19">
              Join Game
            </button>
          </div>
        )}

        {username && !isGameStart && (
          <div>
            <h1>Welcome, {username}</h1>

            <div>
              {master && rankings.length < 1 && (
                <div className="centered-container">
                  <button
                    className="button-19"
                    onClick={handleStartGame}
                    disabled={!startEnabled}
                  >
                    Start Game
                  </button>
                  {!startEnabled && <p>Waiting for more players to join...</p>}
                </div>
              )}

              <h3>wait for the first player to start the game</h3>
              <h2>Users in the lobby:</h2>
              <ul className="users-list">
                {users.map((user: userModel) => (
                  <li key={user.id}>{user.username}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* QUESTION SECTION */}

        {question && (
          <div>
            <h3
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "30px",
              }}
            >
              Question number{" "}
              {questionIndex && questionIndex === 0 ? 1 : questionIndex + 1}
            </h3>

            <div className="question-container">
              <div className="question-header"></div>

              <div className="question-content">
                <h4>{question}</h4>
              </div>
            </div>

            <div className="answer-section">
              <h3>Choose your answer</h3>
            </div>

            <ul className="answer-list">
              {choices.map((choice) => (
                <li
                  key={choice}
                  className="answer-item freeman-regular freeman-regular-answer"
                  onClick={() => handleAnswerSubmit(choice)}
                >
                  <button
                    className="text-button-custom"
                    // onClick={() => handleAnswerSubmit(choice)}
                    disabled={!!selectedAnswer}
                  >
                    {choice}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* RANKING SECTION */}

        {rankings.length > 0 && (
          <div className="rankings-container">
            <h2>Rankings</h2>
            <ul className="rankings-list">
              {rankings.map((rank: rankModel, index) => (
                <li key={rank.userId} className="rankings-item freeman-regular">
                  {index + 1}. {rank.username}: {rank.score}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* <div>
        <footer>
          <div className="footer-content">
            <p>tech-jobs-fair-hackathon-bari-2024-team2</p>
          </div>
        </footer>
      </div> */}

      {/* end div className="App" */}
    </>
  );
};

export default Home;
