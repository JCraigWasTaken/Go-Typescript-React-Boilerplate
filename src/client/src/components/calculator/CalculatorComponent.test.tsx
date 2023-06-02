// CalculatorComponent.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorComponent from './CalculatorComponent';
import React from 'react';

test('renders CalculatorComponent and checks functionality', () => {
  const setValAMock = jest.fn();
  const setValBMock = jest.fn();
  const onClickMock = jest.fn();

  render(
    <CalculatorComponent
      valA={1}
      valB={2}
      setValA={setValAMock}
      setValB={setValBMock}
      onClick={onClickMock}
      result={3}
    />
  );

  const valueAInput = screen.getByTestId('valueA-input');
  const valueBInput = screen.getByTestId('valueB-input');
  const calculateButton = screen.getByTestId('calculate-button');
  const valueTypography = screen.getByTestId('result-value');

  expect(valueAInput).toHaveValue(1);
  expect(valueBInput).toHaveValue(2);
  expect(valueTypography).toHaveTextContent('3');

  fireEvent.change(valueAInput, { target: { value: '5' } });
  expect(setValAMock).toHaveBeenCalledTimes(1);

  fireEvent.change(valueBInput, { target: { value: '5' } });
  expect(setValBMock).toHaveBeenCalledTimes(1);

  fireEvent.click(calculateButton);
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
