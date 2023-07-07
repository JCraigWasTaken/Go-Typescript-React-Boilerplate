import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';

import Hook, { IUseTableProps } from './useTable';

export interface ITableComponentProps extends IUseTableProps {
  rowHeight: number;
  rowsPerPageOptions: number[];
}

function TableComponent(props: ITableComponentProps) {
  const { columnHeaders, rowHeight, rowsPerPageOptions } = props;
  const useTableProps = {
    columnHeaders: props.columnHeaders,
    sortableColumnHeaderIDs: props.sortableColumnHeaderIDs,
    initRowsPerPage: props.initRowsPerPage,
    onChangeTableState: props.onChangeTableState,
  };
  const {
    sortState,
    page,
    rowsPerPage,
    rowsState,
    onChangeSort,
    onChangePage,
    onChangeRowsPerPage,
  } = Hook.useTable(useTableProps);

  const tableHeader = () => {
    return (
      <TableHead data-testid="table-header">
        <TableRow>
          {columnHeaders.map(columnHeader => (
            <TableCell
              align="center"
              padding="normal"
              key={columnHeader.id}
              sortDirection={
                sortState.sortColumn === columnHeader.id
                  ? sortState.sortDirection
                  : undefined
              }
            >
              <TableSortLabel
                active={sortState.sortColumn === columnHeader.id}
                direction={
                  sortState.sortColumn === columnHeader.id
                    ? sortState.sortDirection
                    : undefined
                }
                onClick={onChangeSort} //onChangeSort(columnHeader.id)}
                data-testid={`sortable-column-header-${columnHeader.id}`}
                data-columnID={columnHeader.id}
              >
                {columnHeader.label}
                {sortState.sortColumn === columnHeader.id ? (
                  <Box
                    component="span"
                    sx={visuallyHidden}
                    data-testid={`sortable-column-header-direction-${columnHeader.id}`}
                  >
                    {sortState.sortDirection.toLowerCase() === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const tableBody = () => {
    const emptyRows = rowsPerPage - rowsState.rows.length;
    return (
      <TableBody data-testid="table-body">
        {rowsState.rows.map((row, index) => {
          return (
            <TableRow data-testid={`table-row-${index}`} key={index}>
              {columnHeaders.map(columnHeader => (
                <TableCell
                  align="center"
                  padding="normal"
                  data-testid={`table-cell-${columnHeader.id}-${index}`}
                >
                  {row[columnHeader.id]}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
        {emptyRows > 0 && (
          <TableRow
            style={{
              height: rowHeight * emptyRows,
            }}
          >
            <TableCell colSpan={columnHeaders.length} />
          </TableRow>
        )}
      </TableBody>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table>
            {tableHeader()}
            {tableBody()}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={rowsState.totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default TableComponent;
