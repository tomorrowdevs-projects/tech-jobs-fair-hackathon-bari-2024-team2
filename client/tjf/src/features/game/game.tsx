import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React, { useState } from "react";
import Question from "./question";

const Game: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [timeOut, setTimeOut] = useState<boolean> (false);
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
      <Question onAnswerSubmit={handleAnswerSubmit} />
      <h1>Sono la page Game ed ho un bottone</h1>
      {/* <ButtonComponent text="Azione Game" clickButton={azioneUno} /> */}
    </>
  );
};

export default Game;
