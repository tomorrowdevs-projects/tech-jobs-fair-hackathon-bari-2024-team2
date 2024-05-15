import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React from "react";
import "../../index.css";

const Game: React.FC = () => {
  const azioneUno = () => {
    console.log("Sono Azione Game");
  };
  return (
    <>
      <h1  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Sono la page Game ed ho un bottone</h1>
      <ButtonComponent text="Azione Game" clickButton={azioneUno} />
    </>
  );
};

export default Game;
