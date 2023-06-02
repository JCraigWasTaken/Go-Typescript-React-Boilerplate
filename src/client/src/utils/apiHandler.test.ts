// apiHandler.test.ts
import { apiHandler } from './apiHandler';

describe('apiHandler', () => {
  let mockRequestFunction: jest.Mock;
  let mockSuccessCallback: jest.Mock;
  let mockErrorCallback: jest.Mock;

  beforeEach(() => {
    mockRequestFunction = jest.fn();
    mockSuccessCallback = jest.fn();
    mockErrorCallback = jest.fn();
  });

  it('should handle successful requests', async () => {
    const response = { data: 'Test data' };
    mockRequestFunction.mockResolvedValue(response);

    await apiHandler(
      mockRequestFunction,
      {},
      { successCallback: mockSuccessCallback, errorCallback: mockErrorCallback }
    );

    expect(mockRequestFunction).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledWith(response);
    expect(mockErrorCallback).toBeCalledTimes(0);
  });

  it('should handle error requests', async () => {
    const error = new Error('Test error');
    mockRequestFunction.mockRejectedValue(error);

    await apiHandler(
      mockRequestFunction,
      {},
      { successCallback: mockSuccessCallback, errorCallback: mockErrorCallback }
    );

    expect(mockRequestFunction).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledTimes(0);
    expect(mockErrorCallback).toBeCalledTimes(1);
  });

  it('should handle error requests when errorCallback is not provided', async () => {
    const error = new Error('Test error');
    mockRequestFunction.mockRejectedValue(error);

    console.error = jest.fn(); // mock console.error to prevent it from showing up in the test output

    await apiHandler(
      mockRequestFunction,
      {},
      { successCallback: mockSuccessCallback }
    );

    expect(mockRequestFunction).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledTimes(0);
    expect(console.error).toBeCalledWith(error);
  });
});
