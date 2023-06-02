// ErrorComponent.test.tsx

import { render, screen } from '@testing-library/react';
import ErrorComponent from './ErrorComponent';
import React from 'react';

test('renders ErrorComponent', () => {
  render(<ErrorComponent />);

  const errorElement = screen.getByText(/Error/i);
  expect(errorElement).toBeInTheDocument();
});
