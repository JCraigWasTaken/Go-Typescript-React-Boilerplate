import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import Hook, { IUseCalculatorProps } from './useCalculator';
import helper from './calculatorHelper';
import { mockChangeEvent, mockUseTranslation } from '../../mocks/commonMock';

// Default mock props for the hook
export const defaultMockProps: IUseCalculatorProps = {
  onClick: jest.fn(),
};
let mockProps = { ...defaultMockProps };
// Mock props function return values
const mockPropsReturnValues = {
  onClick: 20,
};
// Mock helper function return values
const mockHelperReturnValues = {
  handleClick: 10,
};

// Wrap Tests with file name
describe('useCalculator', () => {
  // Setup and teardown functions
  beforeAll(() => {
    // Mock helper functions
    jest.mock('./calculatorHelper');
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
    mockProps.onClick = jest
      .fn()
      .mockResolvedValue(mockPropsReturnValues.onClick);
    // Re-mock the helper functions and assign return values to the mock functions
    jest.mock('./calculatorHelper');
    helper.handleClick = jest
      .fn()
      .mockResolvedValue(mockHelperReturnValues.handleClick);
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  // UseEffect Tests

  // Callback Tests
  describe('handleOnChangeValA', () => {
    test('should call setValA with the correct arguments', () => {
      const { result } = renderHook(() => Hook.useCalculator(mockProps));
      act(() => {
        result.current.onChangeValA(mockChangeEvent('5'));
      });
      expect(result.current.valA).toBe('5');
    });
  });

  describe('handleOnChangeValB', () => {
    test('should call setValB with the correct arguments', () => {
      const { result } = renderHook(() => Hook.useCalculator(mockProps));
      act(() => {
        result.current.onChangeValB(mockChangeEvent('5'));
      });
      expect(result.current.valB).toBe('5');
    });
  });

  describe('handleOnClick', () => {
    it('should call helper.handleClick with the correct arguments and set the result', async () => {
      // Arrange
      const { result } = renderHook(() => Hook.useCalculator(mockProps));
      // Act
      await act(async () => {
        await result.current.onClick();
      });
      // Assert
      expect(result.current.result).toBe(10);
      expect(helper.handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
