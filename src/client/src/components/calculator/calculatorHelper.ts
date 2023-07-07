import { IUseCalculatorProps } from './useCalculator';

const handleClick = async (
  valA: number,
  valB: number,
  onClick: IUseCalculatorProps['onClick']
) => {
  const result = await onClick(valA, valB);
  return result.toString();
};

const helper = {
  handleClick,
};

export default helper;
