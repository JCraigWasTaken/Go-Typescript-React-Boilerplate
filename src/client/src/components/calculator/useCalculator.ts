import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import helper from './calculatorHelper';

export interface IUseCalculatorProps {
  onClick: (valA: number, valB: number) => Promise<number>;
}

function useCalculator(props: IUseCalculatorProps) {
  const { t } = useTranslation();
  // Props
  const { onClick } = props;

  // State and reducers
  const [valA, setValA] = useState('0');
  const [valB, setValB] = useState('0');
  const [result, setResult] = useState('0');

  // Callbacks
  const handleOnChangeValA = useCallback(
    (val: React.ChangeEvent<HTMLInputElement>) => {
      setValA(val.target.value);
    },
    []
  );

  const handleOnChangeValB = useCallback(
    (val: React.ChangeEvent<HTMLInputElement>) => {
      setValB(val.target.value);
    },
    []
  );

  const handleOnClick = useCallback(async () => {
    setResult(await helper.handleClick(Number(valA), Number(valB), onClick));
  }, [onClick, valA, valB]);

  // UseEffects

  // Return
  return {
    t,
    valA,
    valB,
    result,
    onChangeValA: handleOnChangeValA,
    onChangeValB: handleOnChangeValB,
    onClick: handleOnClick,
  };
}

const Hook = {
  useCalculator,
};

export default Hook;
