import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React from "react";

const NewGame: React.FC = () => {
  const azioneUno = () => {
    console.log("Sono Azione NewGame");
  };
  return (
    <>
      <h1>Sono la page NewGame ed ho un bottone</h1>
      <ButtonComponent text="Azione NewGame" clickButton={azioneUno} />
    </>
  );
};

export default NewGame;
