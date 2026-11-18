import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';

import Hook, { IUseTableProps } from './useTable';
import helper from './tableHelper';
import { mockChangeEvent, mockMouseEvent } from '../../mocks/commonMock';

// No vi.mock('./tableHelper'): the hook's sortReducer/rowsReducer must stay
// real, and beforeEach() below replaces the three helper functions this file
// wants mocked by assigning them directly (same net effect CRA's hoisted
// jest.mock + reassignment produced).

// Default mock props for the hook
export const defaultMockProps: IUseTableProps = {
  columnHeaders: [
    {
      id: 'id',
      label: 'label',
    },
    {
      id: 'id2',
      label: 'label2',
    },
  ],
  sortableColumnHeaderIDs: ['id'],
  initRowsPerPage: 10,
  onChangeTableState: vi.fn(),
};
let mockProps = { ...defaultMockProps };
// Mock props function return values
const mockPropsReturnValues = {
  onChangeTableState: [
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
};
// Mock helper function return values
const mockHelperReturnValues = {
  handleOnChangeSort: ['id2', 'desc'],
  handleOnChangeRowsPerPage: 20,
};

// Wrap Tests with file name
describe('useTable', () => {
  // Setup and teardown functions
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Re-mock the props and assign return values to the mock functions
    mockProps = { ...defaultMockProps };
    mockProps.onChangeTableState = vi
      .fn()
      .mockResolvedValue(mockPropsReturnValues.onChangeTableState);
    // Re-mock the helper functions and assign return values to the mock functions
    helper.tableDataValidation = vi.fn();
    helper.handleOnChangeSort = vi
      .fn()
      .mockReturnValue(mockHelperReturnValues.handleOnChangeSort);
    helper.handleOnChangeRowsPerPage = vi
      .fn()
      .mockReturnValue(mockHelperReturnValues.handleOnChangeRowsPerPage);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // UseEffect Tests
  describe('useEffect - Table State Change', () => {
    test('should call helper.onChangeTableState with the correct arguments and update rowsState', async () => {
      const { result } = renderHook(() => Hook.useTable(mockProps));
      expect(mockProps.onChangeTableState).toHaveBeenCalledWith({
        numRows: result.current.rowsPerPage,
        pageNumber: result.current.page,
        searchQuery: undefined,
        sortHeader: result.current.sortState.sortColumn,
        sortDirection: result.current.sortState.sortDirection,
      });

      await waitFor(() =>
        expect(result.current.rowsState).toEqual({
          rows: mockPropsReturnValues.onChangeTableState[0],
          totalCount: mockPropsReturnValues.onChangeTableState[1],
        })
      );
    });
  });

  describe('useEffect - Table Data Validation', () => {
    test('should call helper.tableDataValidation with the correct arguments', async () => {
      const { result } = renderHook(() => Hook.useTable(mockProps));
      expect(helper.tableDataValidation).toHaveBeenCalledWith(
        mockProps.columnHeaders,
        result.current.rowsState,
        mockProps.sortableColumnHeaderIDs
      );
    });
  });

  // Callback Tests
  describe('handleOnChangeSort', () => {
    test('should call helper.handleOnChangeSort with the correct arguments and update sortState', async () => {
      const { result } = renderHook(() => Hook.useTable(mockProps));
      const mockEvent = mockMouseEvent('id');
      const callState = result.current;
      act(() => {
        result.current.onChangeSort(mockEvent);
      });
      expect(helper.handleOnChangeSort).toHaveBeenCalledWith(
        mockEvent,
        callState.sortState
      );
      await waitFor(() => {
        expect(result.current.sortState).toEqual({
          sortColumn: mockHelperReturnValues.handleOnChangeSort[0],
          sortDirection: mockHelperReturnValues.handleOnChangeSort[1],
        });
      });
    });
  });

  describe('handleOnChangePage', () => {
    test('should set page to the newPage', async () => {
      const { result } = renderHook(() => Hook.useTable(mockProps));
      const newPage = 2;
      act(() => {
        result.current.onChangePage(null, newPage);
      });
      await waitFor(() => {
        expect(result.current.page).toEqual(newPage);
      });
    });
  });

  describe('handleOnChangeRowsPerPage', () => {
    test('should call helper.handleOnChangeRowsPerPage with the correct arguments and update rowsPerPage and page', async () => {
      const { result } = renderHook(() => Hook.useTable(mockProps));
      const mockEvent = mockChangeEvent(20);
      act(() => {
        result.current.onChangeRowsPerPage(mockEvent);
      });
      expect(helper.handleOnChangeRowsPerPage).toHaveBeenCalledWith(mockEvent);
      await waitFor(() => {
        expect(result.current.rowsPerPage).toEqual(20);
      });
      expect(result.current.page).toEqual(0);
    });
  });
});
