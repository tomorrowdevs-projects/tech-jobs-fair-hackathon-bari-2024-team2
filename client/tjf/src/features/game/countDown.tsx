import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const ContDown: React.FC<{ timeRunOut: () => void }>  = (props) => {


  const renderTime = ({ remainingTime }: any) => {
    if (remainingTime === 0) {
        // props.timeRunOut();
      return <div className="timer">Too lale...</div>;
    }

    return (
      <div className="timer">
        <div className="text">Remaining</div>
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  return (
    <>
      <div className="timer-wrapper">
        <CountdownCircleTimer
          isPlaying
          duration={10}
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
