import { setupServer } from 'msw/node';

import {
  successHandlers,
  undefinedHandlers,
  errorHandlers_APIDisconnect,
  errorHandlers_APIInternal,
} from '../../mocks/apiMock';
import helper from './homePageHelper';
import { mock_endpointsCommon_SumResponse } from '../../mocks/apiResponseDataMock';
import { TTableArgs } from '../../typescript/ITCommon';

// Setup mock server
const server = setupServer(...successHandlers);

describe('homePageHelper', () => {
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
  describe('pageLoad', () => {
    test('should return "OK" if the API call is successful', async () => {
      const result = await helper.pageLoad();
      expect(result).toEqual('OK');
    });
    test('should return "Not OK" if the API call is undefined', async () => {
      server.use(...undefinedHandlers);
      const result = await helper.pageLoad();
      expect(result).toEqual('Not OK');
    });
    test('should return "Not OK" if the API is disconnected', async () => {
      server.use(...errorHandlers_APIDisconnect);
      const result = await helper.pageLoad();
      expect(result).toEqual('Not OK');
    });
    test('should return "Not OK" if the API has internal error', async () => {
      server.use(...errorHandlers_APIInternal);
      const result = await helper.pageLoad();
      expect(result).toEqual('Not OK');
    });
  });

  describe('handleCalculatorClick_Server', () => {
    test('should return the sum if the API call is successful', async () => {
      const result = await helper.handleCalculatorClick_Server([1, 2, 3]);
      // Always expect the sum to be 7
      expect(result).toEqual(mock_endpointsCommon_SumResponse.result);
    });
    test('should return 0 if the API call is undefined', async () => {
      server.use(...undefinedHandlers);
      const result = await helper.handleCalculatorClick_Server([1, 2, 3]);
      expect(result).toEqual(0);
    });
    test('should return 0 if the API is disconnected', async () => {
      server.use(...errorHandlers_APIDisconnect);
      const result = await helper.handleCalculatorClick_Server([1, 2, 3]);
      expect(result).toEqual(0);
    });
    test('should return 0 if the API has internal error', async () => {
      server.use(...errorHandlers_APIInternal);
      const result = await helper.handleCalculatorClick_Server([1, 2, 3]);
      expect(result).toEqual(0);
    });
  });

  describe('handleCalculatorClick_Client', () => {
    test('should return the sum of the numbers', async () => {
      const result = await helper.handleCalculatorClick_Client(1, 2);
      expect(result).toEqual(3);
    });
  });
});
