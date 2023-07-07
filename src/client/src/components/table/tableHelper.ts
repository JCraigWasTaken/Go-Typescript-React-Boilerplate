import { ChangeEvent, MouseEvent } from 'react';
import {
  TTableColumnHeaders,
  TTableColumnSortOptions,
  TTableColumnValues,
} from '../../typescript/ITCommon';
import { every, includes } from 'lodash';

export interface ISortState {
  sortColumn: string;
  sortDirection: TTableColumnSortOptions;
}
const sortReducer = (
  state: ISortState,
  action:
    | { type: 'setSortColumn'; payload: string }
    | { type: 'setSortDirection'; payload: TTableColumnSortOptions }
) => {
  switch (action.type) {
    case 'setSortColumn':
      return { ...state, sortColumn: action.payload };
    case 'setSortDirection':
      return { ...state, sortDirection: action.payload };
  }
};

export interface IRowsState {
  rows: TTableColumnValues;
  totalCount: number;
}
const rowsReducer = (
  state: IRowsState,
  action:
    | { type: 'setRows'; payload: TTableColumnValues }
    | { type: 'setTotalCount'; payload: number }
) => {
  switch (action.type) {
    case 'setRows':
      return { ...state, rows: action.payload };
    case 'setTotalCount':
      return { ...state, totalCount: action.payload };
  }
};

const handleOnChangeSort = (
  event: MouseEvent<HTMLSpanElement>,
  sortState: ISortState
): [string, TTableColumnSortOptions] => {
  const clickedColumnID = event.currentTarget.getAttribute('data-columnID');
  let sortDirection: TTableColumnSortOptions = 'asc';
  if (!clickedColumnID) {
    return [sortState.sortColumn, sortState.sortDirection];
  }
  if (sortState.sortColumn === clickedColumnID) {
    sortDirection = sortState.sortDirection === 'asc' ? 'desc' : 'asc';
  }
  return [clickedColumnID, sortDirection];
};

const handleOnChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
  return parseInt(event.target.value, 10);
};

const tableDataValidation = (
  columnHeaders: TTableColumnHeaders,
  rowsState: IRowsState,
  sortableColumnHeaderIDs: string[]
) => {
  const isValidData = () => {
    const columnIds = columnHeaders.map(column => column.id);
    const isValidRows = every(rowsState.rows, row => {
      const rowKeys = Object.keys(row);
      return every(columnIds, columnId => includes(rowKeys, columnId));
    });
    const isValidSortableColumnHeaderIDs = every(sortableColumnHeaderIDs, id =>
      includes(columnIds, id)
    );
    return isValidRows && isValidSortableColumnHeaderIDs;
  };
  if (!isValidData()) {
    console.error('Invalid table row data');
  }
};

const helper = {
  sortReducer,
  rowsReducer,
  handleOnChangeSort,
  handleOnChangeRowsPerPage,
  tableDataValidation,
};

export default helper;
