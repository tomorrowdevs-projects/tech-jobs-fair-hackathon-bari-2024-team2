import { Counter } from "./features/counter/Counter";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import React from "react";
import Home from "./features/home/Home";
import Game from "./features/game/game";

const App = () => {
  // useContext(){}
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/game" element={<Game />}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
