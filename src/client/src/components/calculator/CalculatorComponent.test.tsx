import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import CalculatorComponent, {
  ICalculatorComponentProps,
} from './CalculatorComponent';
import Hook from './useCalculator';

// Default mock the props for the component
const defaultMockProps: ICalculatorComponentProps = {
  onClick: vi.fn(),
};
let mockProps = { ...defaultMockProps };

// Default mock the hook return values
const defaultMockHook = {
  t: vi.fn(),
  valA: '0',
  valB: '0',
  result: '0',
  onChangeValA: vi.fn(),
  onChangeValB: vi.fn(),
  onClick: vi.fn(),
};
let mockHook = { ...defaultMockHook };

// Default mock all local subcomponents

describe('CalculatorComponent', () => {
  let hookSpy: MockInstance<any>;
  // Setup and teardown functions
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockProps = { ...defaultMockProps };
    mockHook = { ...defaultMockHook };
    hookSpy = vi.spyOn(Hook, 'useCalculator');
    hookSpy.mockImplementation(() => mockHook);
    // Mock return values for each function that is in the props
    mockProps.onClick = vi.fn().mockReturnValue(0);
  });
  afterEach(() => {
    vi.useRealTimers();
    hookSpy.mockRestore();
  });

  // Tests
  test('Should render the component with all vals in correct locations', () => {
    render(<CalculatorComponent {...mockProps} />);
    expect(screen.getByTestId('valueA-input')).toBeInTheDocument();
    expect(screen.getByTestId('valueA-input')).toHaveValue(
      parseFloat(mockHook.valA)
    );
    expect(screen.getByTestId('valueB-input')).toBeInTheDocument();
    expect(screen.getByTestId('valueB-input')).toHaveValue(
      parseFloat(mockHook.valB)
    );
    expect(screen.getByTestId('result-value')).toBeInTheDocument();
    expect(screen.getByTestId('result-value')).toHaveTextContent(
      mockHook.result
    );
    expect(screen.getByTestId('calculate-button')).toBeInTheDocument();
  });

  test('Change value A should call setValA', () => {
    render(<CalculatorComponent {...mockProps} />);
    const input = screen.getByTestId('valueA-input');
    fireEvent.change(input, { target: { value: '1' } });
    vi.runAllTimers();
    expect(mockHook.onChangeValA).toHaveBeenCalledTimes(1);
  });

  test('Change value B should call setValB', () => {
    render(<CalculatorComponent {...mockProps} />);
    const input = screen.getByTestId('valueB-input');
    fireEvent.change(input, { target: { value: '1' } });
    vi.runAllTimers();
    expect(mockHook.onChangeValB).toHaveBeenCalledTimes(1);
  });

  test('Click calculate button should call onClick', () => {
    render(<CalculatorComponent {...mockProps} />);
    const button = screen.getByTestId('calculate-button');
    fireEvent.click(button);
    vi.runAllTimers();
    expect(mockHook.onClick).toHaveBeenCalledTimes(1);
  });
});
