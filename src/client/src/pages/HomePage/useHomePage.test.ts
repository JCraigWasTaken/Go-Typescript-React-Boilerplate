import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

import Hook, { IUseHomePageProps } from './useHomePage';
import helper from './homePageHelper';
import { TTableArgs } from '../../typescript/ITCommon';
import { act } from 'react';

// Vitest hoists module mocks to the top of the file; declare them at the
// module's top level (Jest used to hoist them out of the setup hooks).
vi.mock('./homePageHelper');
vi.mock('react-i18next', async () => {
  // imported inside the factory: vi.mock is hoisted above the imports,
  // so the shared mock may only be reached through a dynamic import
  const { mockUseTranslation } = await import('../../mocks/commonMock');
  return { useTranslation: mockUseTranslation };
});

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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Re-mock the props and assign return values to the mock functions
    mockProps = { ...defaultMockProps };
    // Re-mock the helper functions and assign return values to the mock functions
    helper.pageLoad = vi
      .fn()
      .mockResolvedValue(mockHelperReturnValues.pageLoad);
    helper.handleCalculatorClick_Client = vi
      .fn()
      .mockReturnValue(mockHelperReturnValues.handleCalculatorClick_Client);
    helper.handleCalculatorClick_Server = vi
      .fn()
      .mockResolvedValue(mockHelperReturnValues.handleCalculatorClick_Server);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // UseEffect Tests
  describe('useEffect - Page Load', () => {
    test('should call helper.pageLoad with the correct arguments and update apiStatus', async () => {
      const { result } = renderHook(() => Hook.useHomePage(mockProps));
      await waitFor(() => {
        expect(result.current.apiStatus).toBe('OK');
      });
      expect(helper.pageLoad).toHaveBeenCalledTimes(1);
    });
  });

  // Callback Tests

  describe('handleCalculatorClick_Client', () => {
    test('should call helper.handleCalculatorClick_Client with the correct arguments and return the correct value', async () => {
      const { result } = renderHook(() => Hook.useHomePage(mockProps));
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
      const { result } = renderHook(() => Hook.useHomePage(mockProps));
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
