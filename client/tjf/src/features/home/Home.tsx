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
      <div>
        <h1>Benvenuto nel nostro gioco</h1>
      </div>
      <div>
        <h2>
          Puoi iniziare una nuova partita, o scegliere di giocare con il codice
          degli amici
        </h2>
      </div>
      <div>
        <h3>inserisci il tuo nome</h3>
      </div>
      <div>
        <input type="text" id="name" />
      </div>
      <div>
        <ButtonComponent text="Inizia Nuova Partita" clickButton={newGame} />
      </div>
      <div>
        <ButtonComponent text="Usa Codice" clickButton={codeGame} />
      </div>
      <div>
        <input type="text" id="code" />
      </div>
    </>
  );
};

export default Home;
