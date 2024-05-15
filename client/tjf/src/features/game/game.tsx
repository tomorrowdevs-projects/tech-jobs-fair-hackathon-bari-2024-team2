import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React, { useState } from "react";
import Question from "./question";
import "../../App.css";

import CountDown from "./countDown";

const Game: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [hasTimeRunOut, setHasTimeRunOut] = useState<boolean>(false);

  const setTime = ()=> {
    setHasTimeRunOut(!hasTimeRunOut);
    console.log("hasTimeRunOut");
    console.log(hasTimeRunOut);
    
  }

  const azioneUno = () => {
    console.log("Sono Azione Game");
  };

  const handleAnswerSubmit = (answer: string | null) => {
    setUserAnswer(answer);
    // Qui puoi inviare la risposta al server o eseguire altre azioni necessarie
    console.log("Risposta inviata al server:", answer);
  };

  return (
    <>
      <CountDown timeRunOut={setTime} ></CountDown>

      <Question onAnswerSubmit={handleAnswerSubmit} />

      <h1>Sono la page Game ed ho un bottone</h1>
      {/* <ButtonComponent text="Azione Game" clickButton={azioneUno} /> */}
    </>
  );
};

export default Game;
