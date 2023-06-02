// CalculatorContainer.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorContainer from './CalculatorContainer';
import React from 'react';

test('renders CalculatorContainer and checks state changes', () => {
  const onClickMock = jest.fn();

  render(<CalculatorContainer onClick={onClickMock} result={0} />);

  const valueAInput = screen.getByTestId('valueA-input');
  const valueBInput = screen.getByTestId('valueB-input');
  const calculateButton = screen.getByTestId('calculate-button');

  fireEvent.change(valueAInput, { target: { value: '3' } });
  expect(valueAInput).toHaveValue(3);

  fireEvent.change(valueBInput, { target: { value: '2' } });
  expect(valueBInput).toHaveValue(2);

  fireEvent.click(calculateButton);
  expect(onClickMock).toHaveBeenCalledTimes(1);
});
