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
  getEquationTable: jest.fn(),
  handleCalculatorClick_Client: jest.fn(),
  handleCalculatorClick_Server: jest.fn(),
};
let mockHook = { ...defaultMockHook };

// Default mock all local subcomponents
jest.mock('../../components/calculator/CalculatorComponent', () => ({
  __esModule: true,
  default: () => <div>CalculatorComponent</div>, // A mock replacement of the CalculatorComponent
}));

describe('HomePage', () => {
  let hookSpy: jest.SpyInstance<any, any, any>;
  // Setup and teardown functions
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockProps = { ...defaultMockProps };
    mockHook = { ...defaultMockHook };
    hookSpy = jest.spyOn(Hook, 'useHomePage');
    hookSpy.mockImplementation(() => mockHook);
    // Mock return values for each function that is in the props
  });
  afterEach(() => {
    jest.useRealTimers();
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
