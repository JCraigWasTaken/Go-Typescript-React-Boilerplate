// apiHandler.test.ts
import { apiHandler } from './apiHandler';

describe('apiHandler tests', () => {
  let mockRequestFunction: jest.Mock;
  let mockSuccessCallback: jest.Mock;
  let mockErrorCallback: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestFunction = jest.fn();
    mockSuccessCallback = jest.fn();
    mockErrorCallback = jest.fn();
  });

  test('Should handle successful requests', async () => {
    const response = { data: 'Test data' };
    mockRequestFunction.mockResolvedValue(response);

    await apiHandler(mockRequestFunction, [], {
      successCallback: mockSuccessCallback,
      errorCallback: mockErrorCallback,
    });

    expect(mockRequestFunction).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledWith(response);
    expect(mockErrorCallback).toBeCalledTimes(0);
  });

  test('Should handle error requests', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    mockRequestFunction.mockRejectedValue(error);

    await apiHandler(mockRequestFunction, [], {
      successCallback: mockSuccessCallback,
      errorCallback: mockErrorCallback,
    });

    expect(mockRequestFunction).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledTimes(0);
    expect(mockErrorCallback).toBeCalledTimes(1);
    expect(mockErrorCallback).toBeCalledWith(error);
  });

  test('Should handle error requests when errorCallback is not provided', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Test error');
    mockRequestFunction.mockRejectedValue(error);

    await expect(
      apiHandler(mockRequestFunction, [], {
        successCallback: mockSuccessCallback,
      })
    ).rejects.toThrow('Test error'); // Expect to reject with error message

    expect(mockRequestFunction).toBeCalledTimes(1);
    expect(mockSuccessCallback).toBeCalledTimes(0);
    expect(mockErrorCallback).toBeCalledTimes(0);
    expect(console.error).toBeCalledWith(error);
  });
});
