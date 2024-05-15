import React, { useState } from "react";
import QuestionModel from "./model/questionModel";
import ButtonComponent from "../../shared/design/button/ButtonComponent";

const Question: React.FC = () => {
  const azioneUno = () => {
    console.log("Sono Azione Question");
  };
  const quenstionForUser: QuestionModel = {
    type: "multiple",
    question: "When someone is inexperienced they are said to be what color?",
    answer: ["Green", "Red", "Blue", "Yellow"],
  };

  const [answerQuestion, setAnswerQuestion] = useState(null);

  const onValueChange = (event: any) => {
    setAnswerQuestion(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log(answerQuestion);
  };

  return (
    <>
      <div>
        <div>
          <h3>Domanda</h3>
        </div>
        <div>
          <h4>{quenstionForUser.question}</h4>
        </div>
      </div>
      <div>
        <div>
          <h3>Risposte</h3>
        </div>
        <div>
          <form onSubmit={handleSubmit} action="" method="post">
            <ul>
              {quenstionForUser.answer.map((question, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      value={question}
                      onChange={onValueChange}
                      name="question"
                    ></input>
                    {question}
                  </label>
                </li>
              ))}
            </ul>
            <ButtonComponent type="submit" text="Azione Question" />
          </form>
        </div>
      </div>
    </>
  );
};

export default Question;
