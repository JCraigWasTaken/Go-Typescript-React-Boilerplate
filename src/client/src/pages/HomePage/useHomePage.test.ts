import { renderHook, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import Hook, { IUseHomePageProps } from './useHomePage';
import { mockUseTranslation } from '../../mocks/commonMock';
import helper from './homePageHelper';
import { TTableArgs } from '../../typescript/ITCommon';
import { act } from 'react-dom/test-utils';

// Default mock the props for the hook
export const defaultMockProps: IUseHomePageProps = {};
let mockProps = { ...defaultMockProps };
// Mock props function return values

// Mock helper function return values
const mockHelperReturnValues = {
  pageLoad: 'OK',
  getEquationTable: [
    [
      {
        id: 'id',
        value: 'value',
      },
      {
        id: 'id2',
        value: 'value2',
      },
    ],
    2,
  ],
  handleCalculatorClick_Client: 3,
  handleCalculatorClick_Server: 4,
};

// Wrap Tests with file name
describe('useHomePage', () => {
  // Setup and teardown functions
  beforeAll(() => {
    // Mock helper functions
    jest.mock('./homePageHelper');
    // Mock any other miscellaneous hooks
    jest.mock('react-i18next', () => ({
      useTranslation: mockUseTranslation,
    }));
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Re-mock the props and assign return values to the mock functions
    mockProps = { ...defaultMockProps };
    // Re-mock the helper functions and assign return values to the mock functions
    jest.mock('./homePageHelper');
    helper.pageLoad = jest
      .fn()
      .mockResolvedValue(mockHelperReturnValues.pageLoad);
    helper.handleCalculatorClick_Client = jest
      .fn()
      .mockReturnValue(mockHelperReturnValues.handleCalculatorClick_Client);
    helper.handleCalculatorClick_Server = jest
      .fn()
      .mockResolvedValue(mockHelperReturnValues.handleCalculatorClick_Server);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  // UseEffect Tests
  describe('useEffect - Page Load', () => {
    test('should call helper.pageLoad with the correct arguments and update apiStatus', async () => {
      const { result } = renderHook(() => Hook.useHomePage(mockProps), {
        wrapper: RecoilRoot,
      });
      await waitFor(() => {
        expect(result.current.apiStatus).toBe('OK');
      });
      expect(helper.pageLoad).toHaveBeenCalledTimes(1);
    });
  });

  // Callback Tests

  describe('handleCalculatorClick_Client', () => {
    test('should call helper.handleCalculatorClick_Client with the correct arguments and return the correct value', async () => {
      const { result } = renderHook(() => Hook.useHomePage(mockProps), {
        wrapper: RecoilRoot,
      });
      const args = {
        valA: 1,
        valB: 2,
      };
      await act(async () => {
        const response = await result.current.handleCalculatorClick_Client(
          args.valA,
          args.valB
        );
        expect(response).toEqual(
          mockHelperReturnValues.handleCalculatorClick_Client
        );
      });
      expect(helper.handleCalculatorClick_Client).toHaveBeenCalledWith(
        args.valA,
        args.valB
      );
    });
  });

  describe('handleCalculatorClick_Server', () => {
    test('should call helper.handleCalculatorClick_Server with the correct arguments and return the correct value', async () => {
      const { result } = renderHook(() => Hook.useHomePage(mockProps), {
        wrapper: RecoilRoot,
      });
      const args = {
        valA: 2,
        valB: 2,
      };
      await act(async () => {
        const response = await result.current.handleCalculatorClick_Server(
          args.valA,
          args.valB
        );
        expect(response).toEqual(
          mockHelperReturnValues.handleCalculatorClick_Server
        );
      });
      expect(helper.handleCalculatorClick_Server).toHaveBeenCalledWith([
        args.valA,
        args.valB,
      ]);
    });
  });
});
