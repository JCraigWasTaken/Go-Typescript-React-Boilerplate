import React from 'react';

import CalculatorComponent from './CalculatorComponent';

interface ICalculatorContainerProps {
  onClick: (a: number, b: number) => void;
  result: number;
}

function CalculatorContainer(props: ICalculatorContainerProps) {
  const [valA, setValA] = React.useState('0');
  const [valB, setValB] = React.useState('0');

  return (
    <CalculatorComponent
      valA={parseFloat(valA)}
      valB={parseFloat(valB)}
      setValA={(val: React.ChangeEvent<HTMLInputElement>) =>
        setValA(val.target.value)
      }
      setValB={(val: React.ChangeEvent<HTMLInputElement>) =>
        setValB(val.target.value)
      }
      onClick={() => props.onClick(parseFloat(valA), parseFloat(valB))}
      result={props.result}
    />
  );
}

export default CalculatorContainer;
