import { render, screen } from '@testing-library/react';

import ErrorPage, { IErrorPageProps } from './ErrorPage';
import Hook from './useErrorPage';

// Default mock the props for the component
export const defaultMockProps: IErrorPageProps = {};
let mockProps = { ...defaultMockProps };

// Default mock the hook return values
const defaultMockHook = {
  t: (key: string) => key,
};
let mockHook = { ...defaultMockHook };

// Default mock all local subcomponents

describe('ErrorPage', () => {
  let hookSpy: jest.SpyInstance<any, any, any>;
  // Setup and teardown functions
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockProps = { ...defaultMockProps };
    mockHook = { ...defaultMockHook };
    hookSpy = jest.spyOn(Hook, 'useErrorPage');
    hookSpy.mockImplementation(() => mockHook);
    // Mock return values for each function that is in the props
  });
  afterEach(() => {
    jest.useRealTimers();
    hookSpy.mockRestore();
  });

  // Tests
  test('Should render page with all vals in the correct locations', () => {
    render(<ErrorPage {...mockProps} />);
    expect(screen.getByTestId('errorMessage')).toBeInTheDocument();
  });
});
