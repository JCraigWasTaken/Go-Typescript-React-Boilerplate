import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { render, screen } from '@testing-library/react';

import HomePage, { IHomePageProps } from './HomePage';
import Hook from './useHomePage';

// Default mock the props for the component
export const defaultMockProps: IHomePageProps = {};
let mockProps = { ...defaultMockProps };

// Default mock the hook return values
const defaultMockHook = {
  t: (key: string) => key,
  apiStatus: 'OK',
  getEquationTable: vi.fn(),
  handleCalculatorClick_Client: vi.fn(),
  handleCalculatorClick_Server: vi.fn(),
};
let mockHook = { ...defaultMockHook };

// Default mock all local subcomponents
vi.mock('../../components/calculator/CalculatorComponent', () => ({
  __esModule: true,
  default: () => <div>CalculatorComponent</div>, // A mock replacement of the CalculatorComponent
}));

describe('HomePage', () => {
  let hookSpy: MockInstance<any>;
  // Setup and teardown functions
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockProps = { ...defaultMockProps };
    mockHook = { ...defaultMockHook };
    hookSpy = vi.spyOn(Hook, 'useHomePage');
    hookSpy.mockImplementation(() => mockHook);
    // Mock return values for each function that is in the props
  });
  afterEach(() => {
    vi.useRealTimers();
    hookSpy.mockRestore();
  });

  // Tests
  test('Should render the component with all vals in correct locations', () => {
    render(<HomePage {...mockProps} />);
    expect(screen.getByText('Pages:HomePage:Home')).toBeInTheDocument();
    expect(screen.getByTestId('apiStatus')).toBeInTheDocument();
    expect(screen.getByTestId('apiStatus')).toHaveTextContent(
      'Pages:HomePage:API Status: OK'
    );
    expect(
      screen.getByText('Pages:HomePage:API Status: OK')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Pages:HomePage:Client Calculator')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Pages:HomePage:Server Calculator')
    ).toBeInTheDocument();
  });
});
