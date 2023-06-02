// ErrorContainer.test.tsx

import { render, screen } from '@testing-library/react';
import ErrorContainer from './ErrorContainer';
import React from 'react';

test('renders ErrorContainer', () => {
  render(<ErrorContainer />);

  const errorElement = screen.getByText(/Error/i);
  expect(errorElement).toBeInTheDocument();
});
