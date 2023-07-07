import { setupServer } from 'msw/node';

import {
  errorHandlers,
  successHandlers,
  undefinedHandlers,
} from '../../mocks/apiMock';
import helper, { ISortState } from './tableHelper';
import {} from '../../mocks/apiResponseDataMock';
import {
  TTableColumnSortOptions,
  TTableColumnValues,
} from '../../typescript/ITCommon';
import { mockChangeEvent, mockMouseEvent } from '../../mocks/commonMock';

// Setup mock server
const server = setupServer(...successHandlers);

describe('tableHelper', () => {
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
  describe('sortReducer', () => {
    test('should return the correct state when the action is "setSortColumn"', () => {
      const state = {
        sortColumn: 'columnA',
        sortDirection: 'asc' as TTableColumnSortOptions,
      };

      const action: { type: 'setSortColumn'; payload: string } = {
        type: 'setSortColumn',
        payload: 'columnB',
      };

      const result = helper.sortReducer(state, action);
      expect(result).toEqual({ sortColumn: 'columnB', sortDirection: 'asc' });
    });
    test('should return the correct state when the action is "setSortDirection"', () => {
      const state = {
        sortColumn: 'columnA',
        sortDirection: 'asc' as TTableColumnSortOptions,
      };
      const action: {
        type: 'setSortDirection';
        payload: TTableColumnSortOptions;
      } = {
        type: 'setSortDirection',
        payload: 'desc',
      };
      const result = helper.sortReducer(state, action);
      expect(result).toEqual({ sortColumn: 'columnA', sortDirection: 'desc' });
    });
  });

  describe('rowsReducer', () => {
    test('should return the correct state when the action is "setRows"', () => {
      const mockRows = [
        {
          id: 'columnA',
          label: 'Column A',
        },
      ];
      const state = { rows: [], totalCount: 0 };
      const action: { type: 'setRows'; payload: TTableColumnValues } = {
        type: 'setRows',
        payload: mockRows,
      };
      const result = helper.rowsReducer(state, action);
      expect(result).toEqual({
        rows: mockRows,
        totalCount: 0,
      });
    });
    test('should return the correct state when the action is "setTotalCount"', () => {
      const state = { rows: [], totalCount: 0 };
      const action: { type: 'setTotalCount'; payload: number } = {
        type: 'setTotalCount',
        payload: 10,
      };
      const result = helper.rowsReducer(state, action);
      expect(result).toEqual({ rows: [], totalCount: 10 });
    });
  });

  describe('handleOnChangeSort', () => {
    test("should return state when the event doesn't have a data-columnID attribute", () => {
      const sortState = {
        sortColumn: 'columnA',
        sortDirection: 'asc',
      } as ISortState;
      const event = mockMouseEvent('columnA');
      const result = helper.handleOnChangeSort(event, sortState);
      expect(result).toEqual(['columnA', 'asc']);
    });
    test('should return the correct values when the sort column is not clicked', () => {
      const sortState1 = {
        sortColumn: 'columnA',
        sortDirection: 'asc',
      } as ISortState;
      const event = mockMouseEvent('columnA', { 'data-columnID': 'columnA' });
      const result = helper.handleOnChangeSort(event, sortState1);
      expect(result).toEqual(['columnA', 'desc']);

      const sortState2 = {
        sortColumn: 'columnA',
        sortDirection: 'desc',
      } as ISortState;
      const result2 = helper.handleOnChangeSort(event, sortState2);
      expect(result2).toEqual(['columnA', 'asc']);
    });
    test('should return the correct values when the sort column is clicked', () => {
      const sortState = {
        sortColumn: 'columnA',
        sortDirection: 'asc',
      } as ISortState;
      const event = mockMouseEvent('columnB', { 'data-columnID': 'columnB' });
      const result = helper.handleOnChangeSort(event, sortState);
      expect(result).toEqual(['columnB', 'asc']);
    });
  });

  describe('handleOnChangeRowsPerPage', () => {
    test('should return the correct value', () => {
      const event = mockChangeEvent(10);
      const result = helper.handleOnChangeRowsPerPage(event as any);
      expect(result).toEqual(10);
    });
  });

  describe('tableDataValidation', () => {
    test('should console error when the table data is invalid', () => {
      const columnHeaders = [
        { id: 'columnA', label: 'Column A' },
        { id: 'columnB', label: 'Column B' },
      ];
      const rowsState = {
        rows: [
          { columnA: 'a', columnB: 'b' },
          { columnA: 'c', columnB: 'd' },
        ],
        totalCount: 2,
      };
      const sortableColumnHeaderIDs = ['columnA', 'columnB', 'columnC'];
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      helper.tableDataValidation(
        columnHeaders,
        rowsState,
        sortableColumnHeaderIDs
      );
      expect(consoleSpy).toHaveBeenCalledTimes(1);
    });
    test('should not console error when the table data is valid', () => {
      const columnHeaders = [
        { id: 'columnA', label: 'Column A' },
        { id: 'columnB', label: 'Column B' },
      ];
      const rowsState = {
        rows: [
          { columnA: 'a', columnB: 'b' },
          { columnA: 'c', columnB: 'd' },
        ],
        totalCount: 2,
      };
      const sortableColumnHeaderIDs = ['columnA', 'columnB'];
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      helper.tableDataValidation(
        columnHeaders,
        rowsState,
        sortableColumnHeaderIDs
      );
      expect(consoleSpy).toHaveBeenCalledTimes(0);
    });
  });
});
