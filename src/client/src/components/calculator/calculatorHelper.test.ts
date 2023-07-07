import { setupServer } from 'msw/node';

import { successHandlers } from '../../mocks/apiMock';
import helper from './calculatorHelper';

// Setup mock server
const server = setupServer(...successHandlers);

describe('calculatorHelper', () => {
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
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  // Tests
  describe('handleClick', () => {
    test('should call onClick with the correct arguments', async () => {
      // Arrange
      const valA = 1;
      const valB = 2;
      const onClick = jest.fn().mockResolvedValue(3);

      // Act
      await helper.handleClick(valA, valB, onClick);

      // Assert
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(valA, valB);
    });
  });
});
