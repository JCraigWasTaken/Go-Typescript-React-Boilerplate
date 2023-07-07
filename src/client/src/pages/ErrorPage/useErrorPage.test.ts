import { renderHook } from '@testing-library/react';
import { setupServer } from 'msw/node';

import {
  successHandlers,
  undefinedHandlers,
  errorHandlers,
} from '../../mocks/apiMock';
import Hook, { IUseErrorPageProps } from './useErrorPage';

// Setup mock server
const server = setupServer(...successHandlers);

// Default mock props for the hook
export const defaultMockProps: IUseErrorPageProps = {};
let mockProps = { ...defaultMockProps };

describe('useErrorPage', () => {
  // Setup and teardown functions
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    server.resetHandlers();
    server.use(...successHandlers);
    mockProps = { ...defaultMockProps };
    // Mock return values for each function that is in the props
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  // UseEffect Tests

  // Exported Functions Tests

  // Misc Tests
  describe('t', () => {
    test('should return a function', () => {
      const { result } = renderHook(() => Hook.useErrorPage(mockProps));
      expect(result.current.t).toBeInstanceOf(Function);
    });
  });
});
