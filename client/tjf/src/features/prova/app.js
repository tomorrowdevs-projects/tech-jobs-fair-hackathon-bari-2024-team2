import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './App.css';

const socket = new WebSocket('ws://localhost:8080');

function AppTJ() {
  const [connected, setConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [master, setMaster] = useState(false);
  const [startEnabled, setStartEnabled] = useState(false);
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [rankings, setRankings] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // socket.onopen = () => {
    //   setConnected(true);
    //   toast.success('Connected to the server');
    // };

    socket.onopen = () => {
      console.log("Connessione WebSocket aperta nella pagina Home");
      // setWebSocket(ws);
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'connected':
          setUserId(data.userId);
          break;
        case 'error':
          toast.error(data.message);
          break;
        case 'master':
          setMaster(true);
          break;
        case 'start-enabled':
          setStartEnabled(true);
          break;
        case 'userList':
          setUsers(data.users);
          break;
        case 'question':
          setQuestion(data.question);
          setChoices(data.choices);
          setSelectedAnswer('');
          break;
        case 'score':
          if (data.userId === userId) {
            setScore(data.score);
            toast.info(`Your score for this question: ${data.score}`);
          }
          break;
        case 'ranking':
          setRankings(data.rankings);
          break;
        default:
          break;
      }
    };

    socket.onclose = () => {
      console.log("Connessione WebSocket chiusa nella pagina Home");
    };

    return () => {
      socket.close();
    };
  }, [userId]);
///
  const handleSetUsername = () => {
    if (username.trim() === '') {
      toast.error('Username cannot be empty');
      return;
    }
    socket.send(JSON.stringify({ type: 'setUsername', username }));
  };

  const handleStartGame = () => {
    if (master) {
      socket.send(JSON.stringify({ type: 'start', userId }));
    }
  };

  const handleAnswerSubmit = (choice) => {
    setSelectedAnswer(choice);
    socket.send(JSON.stringify({ type: 'answer', userId, answer: choice, questionIndex: 'questionIndex' }));
  };

  return (
    <div className="App">
      <ToastContainer />
      {!connected && <p>Connecting to server...</p>}
      {connected && !username && (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleSetUsername}>Join Game</button>
        </div>
      )}
      {username && (
        <div>
          <h1>Welcome, {username}</h1>
          <div>
            <h2>Users in the lobby:</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
            {master && (
              <div>
                <button onClick={handleStartGame} disabled={!startEnabled}>
                  Start Game
                </button>
                <p>Waiting for more players to join...</p>
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
                <button onClick={() => handleAnswerSubmit(choice)} disabled={!!selectedAnswer}>
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
            {rankings.map((rank, index) => (
              <li key={rank.userId}>
                {index + 1}. {rank.username}: {rank.score}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>//////////
  );
}////

export default AppTJ;
