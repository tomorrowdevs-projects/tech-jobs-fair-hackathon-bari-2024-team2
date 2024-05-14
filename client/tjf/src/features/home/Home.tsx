import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React from "react";

const Home: React.FC = () => {
  const newGame = () => {
    console.log("Sono Azione Uno");
  };
  const codeGame = () => {
    console.log("Sono Azione Uno");
  };
  return (
    <>
      <h1>Benvenuto nel nostro gioco</h1>
      <h2>Puoi iniziare una nuova partita, o scegliere di giocare con il codice degli amici</h2>
      <h3>inserisci il tuo nome</h3>
      <input type="text" id="name" />
      <ButtonComponent text="Inizia Nuova Partita" clickButton={newGame} />
      <ButtonComponent text="Usa Codice" clickButton={codeGame} />
      <input type="text" id="code" />
    </>
  );
};

export default Home;
