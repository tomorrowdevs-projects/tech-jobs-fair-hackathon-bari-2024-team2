import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import ReactDOM from "react-dom";
import './countDown.css';

const ContDown: React.FC<{ 
  // timeRunOut: () => void 
}>  = (props) => {


  const renderTime = ({ remainingTime }: any) => {
    if (remainingTime === 0) {
        // props.timeRunOut();
      return <div className="timer">Too late...</div>;
    }

    return (
      <div className="timer">
        <div className="text countdowntext">Remaining</div>
        <div className="value">{remainingTime}</div>
        <div className="text countdowntext">seconds</div>
      </div>
    );
  };

  return (
    <>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={30}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
        //   onComplete={() => ({ shouldRepeat: true, delay: 3 })}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
    </>
  );
};

export default ContDown;
