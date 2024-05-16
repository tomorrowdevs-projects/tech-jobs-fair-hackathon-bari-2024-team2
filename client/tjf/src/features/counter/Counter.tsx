import React, { useEffect, useState } from "react";

interface CounterProps {
  timeRunOut: (value: boolean) => void;
}

const Counter: React.FC<CounterProps> = ({ timeRunOut }) => {
  const [timer, setTimer] = useState<number>(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          timeRunOut(true); // Chiamata alla funzione timeRunOut quando il tempo scade
          return prevTimer;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRunOut]);

  return <div>{timer}</div>;
};

export default Counter;
