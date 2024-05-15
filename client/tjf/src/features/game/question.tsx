import React, { useState } from "react";
import QuestionModel from "./model/questionModel";
import ButtonComponent from "../../shared/design/button/ButtonComponent";
import "../../App.css";


const Question: React.FC<{ onAnswerSubmit: (answer: string) => void }> = (props) => {  
  const questionForUser: QuestionModel = {
    type: "multiple",
    question: "When someone is inexperienced they are said to be what color?",
    answer: ["Green", "Red", "Blue", "Yellow"],
  };

  const [answerQuestion, setAnswerQuestion] = useState<string | null>(null);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerQuestion(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answerQuestion !== null) {
      props.onAnswerSubmit(answerQuestion);
    }    
  };

  return (
    <>
    <h3 
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "30px",
          }}>Ecco la tua domanda!</h3>
      <div className="question-container">
        <div className="question-header">
        </div>
        <div className="question-content">
          <h4>{questionForUser.question}</h4>
        </div>
      </div>
      <div>
        <div className="answer-section">
          <h3>Scegli la tua risposta</h3>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="answer-form">
            <ul className="answer-list">
              {questionForUser.answer.map((question, index) => (
                <li key={index} className="answer-item">
                  <label>
                    <input
                      type="radio"
                      value={question}
                      checked={answerQuestion === question}
                      onChange={handleValueChange}
                      name="question"
                    />
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
