import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React from "react";

const Game: React.FC = () => {
  const azioneUno = () => {
    console.log("Sono Azione Game");
  };
  return (
    <>
      <h1>Sono la page Game ed ho un bottone</h1>
      <ButtonComponent text="Azione Game" clickButton={azioneUno} />
    </>
  );
};

export default Game;
