import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';

import {
  TTableArgs,
  TTableColumnHeaders,
  TTableColumnSortOptions,
  TTableColumnValues,
} from '../../typescript/ITCommon';
import helper from './tableHelper';

export interface IUseTableProps {
  columnHeaders: TTableColumnHeaders;
  sortableColumnHeaderIDs: string[];
  initRowsPerPage: number;
  onChangeTableState: (
    args: TTableArgs
  ) => Promise<[TTableColumnValues, number]>;
}

function useTable(props: IUseTableProps) {
  // Props
  const {
    columnHeaders,
    sortableColumnHeaderIDs,
    initRowsPerPage,
    onChangeTableState,
  } = props;

  // State and reducers
  const [sortState, dispatchSortState] = useReducer(helper.sortReducer, {
    sortColumn: '',
    sortDirection: 'asc' as TTableColumnSortOptions,
  });
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(initRowsPerPage);
  const [rowsState, dispatchRowsState] = useReducer(helper.rowsReducer, {
    rows: [],
    totalCount: 0,
  });

  // Callbacks
  const handleOnChangeSort = useCallback(
    (event: MouseEvent<HTMLSpanElement>) => {
      const [columnId, sortDirection] = helper.handleOnChangeSort(
        event,
        sortState
      );
      dispatchSortState({
        type: 'setSortDirection',
        payload: sortDirection,
      });
      dispatchSortState({
        type: 'setSortColumn',
        payload: columnId,
      });
    },
    [sortState]
  );

  const handleOnChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleOnChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newRowsPerPage = helper.handleOnChangeRowsPerPage(event);
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    },
    []
  );

  // UseEffects
  useEffect(() => {
    // Table State Change
    onChangeTableState({
      numRows: rowsPerPage,
      pageNumber: page,
      searchQuery: undefined,
      sortHeader: sortState.sortColumn,
      sortDirection: sortState.sortDirection,
    }).then(([newRows, newCount]) => {
      dispatchRowsState({
        type: 'setRows',
        payload: newRows,
      });
      dispatchRowsState({
        type: 'setTotalCount',
        payload: newCount,
      });
    });
  }, [onChangeTableState, page, rowsPerPage, sortState]);

  useEffect(() => {
    // Table Data Validation
    helper.tableDataValidation(
      columnHeaders,
      rowsState,
      sortableColumnHeaderIDs
    );
  }, [columnHeaders, rowsState, sortableColumnHeaderIDs]);

  // Return
  return {
    sortState,
    page,
    rowsPerPage,
    rowsState,
    onChangeSort: handleOnChangeSort,
    onChangePage: handleOnChangePage,
    onChangeRowsPerPage: handleOnChangeRowsPerPage,
  };
}

const Hook = {
  useTable,
};

export default Hook;
