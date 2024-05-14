// Home.tsx

//import React from "react";
import ButtonComponent from "../../shared/design/button/ButtonComponent";
import "../../shared/design/button/button.scss";
import "../../index.css";
//import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeXmark, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import React, { useRef, useEffect } from 'react';









const Home: React.FC = () => {


  const audioRef = useRef<HTMLAudioElement>(null); 

  const [isAudioMuted, setIsAudioMuted] = React.useState(false);
  
  const toggleAudio = () => {
    
    setIsAudioMuted(prevState => !prevState); 
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play(); 
      } else {
        audioRef.current.pause(); 
      }
    }
  };


 
  const newGame = () => {
    console.log("Sono Azione Uno");
  };

  const codeGame = () => {
    console.log("Sono Azione Due"); 
  };

  return (
    <>
    

      
      <audio ref={audioRef} src="/backgroundmusic.mp3" loop preload="auto"  />

      
      <div className="audio-toggle" onClick={toggleAudio}>
      {isAudioMuted ? <FontAwesomeIcon icon={faVolumeHigh}  /> : <FontAwesomeIcon icon={faVolumeXmark}/>}   
      
      </div>


    
      <div>
        
          <img className="logo" src="./logoquiz.jpeg" alt="" />
       
      </div>
      <div>
        <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Benvenuto!</h1>

        <h2 className="h2home" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

        inizia una nuova partita o inserisci un codice per entrare in una stanza
        </h2>
      </div>
      {/* <div>
        <h3>inserisci il tuo nome</h3>
      </div> */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
     
        <input type="text" id="name" className="input-text" placeholder="Inserisci Nome"/>
        </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Passa le classi CSS come prop al componente ButtonComponent */}
        <ButtonComponent text="Inizia Nuova Partita" clickButton={newGame} classNames="custom-btn custom-btn-primary button-19" />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <input type="text" id="code" className="input-text" placeholder="Codice partita"/>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Passa le classi CSS come prop al componente ButtonComponent */}
        <ButtonComponent text="Usa Codice" clickButton={codeGame} classNames="btn btn-primary" />
      </div>
    </>
  );
};

export default Home;
