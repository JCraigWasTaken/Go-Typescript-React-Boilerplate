import { describe, it, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

import Hook, { IUseCalculatorProps } from './useCalculator';
import helper from './calculatorHelper';
import { mockChangeEvent } from '../../mocks/commonMock';

// Vitest hoists module mocks to the top of the file; declare them at the
// module's top level (Jest used to hoist them out of the setup hooks).
vi.mock('./calculatorHelper');
vi.mock('react-i18next', async () => {
  // imported inside the factory: vi.mock is hoisted above the imports,
  // so the shared mock may only be reached through a dynamic import
  const { mockUseTranslation } = await import('../../mocks/commonMock');
  return { useTranslation: mockUseTranslation };
});

// Default mock props for the hook
export const defaultMockProps: IUseCalculatorProps = {
  onClick: vi.fn(),
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
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Re-mock the props and assign return values to the mock functions
    mockProps = { ...defaultMockProps };
    mockProps.onClick = vi
      .fn()
      .mockResolvedValue(mockPropsReturnValues.onClick);
    // Re-mock the helper functions and assign return values to the mock functions
    helper.handleClick = vi
      .fn()
      .mockResolvedValue(mockHelperReturnValues.handleClick);
  });
  afterEach(() => {
    vi.useRealTimers();
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
