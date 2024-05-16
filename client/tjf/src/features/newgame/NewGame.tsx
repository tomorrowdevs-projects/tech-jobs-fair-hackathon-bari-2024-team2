import ButtonComponent from "../../shared/design/button/ButtonComponent";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import "../../index.css";

const NewGame: React.FC = () => {
  const azioneUno = () => {
    console.log("Sono Azione NewGame");
  };

  const name = "nome";

  const matchRequest = (data: any) => {
    setData(JSON.stringify(data));
    console.log("Form submitted:");
    console.log(data);
  };
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");

  return (
    <>
   
   <div>
        <img className="logo" src="./logoquiz.jpeg" alt="" style={{
            marginTop: "3px",
            marginBottom: "3px",
          }} />
      </div>
      <h1  style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2px",
            marginBottom: "2px",
          }}>Benvenuto {name}</h1>
      <h3    className="h2home"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
        Ti ricordiamo che puoi fare delle scelte o lasciare le impostazioni come
        le vedi
      </h3>
      

      <form className="form-container"
        onSubmit={handleSubmit((data: any) => {
          matchRequest(data);
        })}
        action=""
        method="post"
      >
         <div className="form-group">
        <label htmlFor="category">Seleziona la categoria</label>
        <select {...register("category")} name="category" className="form-control freeman-regular">
          <option value="any">Any Category</option>
          <option value="9">General Knowledge</option>
          <option value="10">Entertainment: Books</option>
          <option value="11">Entertainment: Film</option>
          <option value="12">Entertainment: Music</option>
          <option value="13">Entertainment: Musicals &amp; Theatres</option>
          <option value="14">Entertainment: Television</option>
          <option value="15">Entertainment: Video Games</option>
          <option value="16">Entertainment: Board Games</option>
          <option value="17">Science &amp; Nature</option>
          <option value="18">Science: Computers</option>
          <option value="19">Science: Mathematics</option>
          <option value="20">Mythology</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
          <option value="23">History</option>
          <option value="24">Politics</option>
          <option value="25">Art</option>
          <option value="26">Celebrities</option>
          <option value="27">Animals</option>
          <option value="28">Vehicles</option>
          <option value="29">Entertainment: Comics</option>
          <option value="30">Science: Gadgets</option>
          <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
          <option value="32">
            Entertainment: Cartoon &amp; Animations
          </option>{" "}
        </select>
        </div>
        <div className="form-group">
        <label htmlFor="difficulty">Select Difficulty: </label>
        <select {...register("difficulty")} name="difficulty" className="form-control freeman-regular">
          <option value="any">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        </div>

        <div className="form-group">
        <label htmlFor="type">Select Type: </label>
        <select {...register("type")} name="type" className="form-control freeman-regular">
          <option value="any">Any Type</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>
        </div>
        <ButtonComponent text="Avvia Quiz" type="submit" className="submit-button"/>
      </form>
    </>
  );
};

export default NewGame;
