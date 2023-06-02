// HomeComponent.test.tsx

import { render, screen } from '@testing-library/react';
import HomeComponent from './HomeComponent';
import React from 'react';

test('renders home component', () => {
  const mockClick = jest.fn();

  render(
    <HomeComponent
      apiStatus="OK"
      clientCalcResult={5}
      serverCalcResult={5}
      onClientCalcClick={mockClick}
      onServerCalcClick={mockClick}
    />
  );

  const homeElement = screen.getByText(/Pages:HomePage:Home/i);
  expect(homeElement).toBeInTheDocument();

  const apiStatusElement = screen.getByText(/Pages:HomePage:API Status: OK/i);
  expect(apiStatusElement).toBeInTheDocument();

  const calculatorClientElement = screen.getByText(
    /Pages:HomePage:Client Calculator/i
  );
  expect(calculatorClientElement).toBeInTheDocument();

  const calculatorServerElement = screen.getByText(
    /Pages:HomePage:Server Calculator/i
  );
  expect(calculatorServerElement).toBeInTheDocument();
});
