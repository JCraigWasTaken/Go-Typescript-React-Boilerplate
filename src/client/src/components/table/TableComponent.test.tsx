import { render, screen, fireEvent } from '@testing-library/react';

import { defaultMockProps as useTableProps } from './useTable.test';
import TableComponent, { ITableComponentProps } from './TableComponent';
import Hook from './useTable';
import { TTableColumnSortOptions } from '../../typescript/ITCommon';

// Default mock the props for the component
export const defaultMockProps: ITableComponentProps = {
  ...useTableProps,
  rowHeight: 10,
  rowsPerPageOptions: [5, 10, 25],
};
let mockProps = { ...defaultMockProps };

// Default mock the hook return values
const defaultMockHook = {
  sortState: {
    sortColumn: 'id',
    sortDirection: 'asc' as TTableColumnSortOptions,
  },
  page: 0,
  rowsPerPage: 5,
  rowsState: {
    rows: [] as Array<{ id: number; name: string }>,
    totalCount: 0,
  },
  onChangeSort: jest.fn(),
  onChangePage: jest.fn(),
  onChangeRowsPerPage: jest.fn(),
};
let mockHook = { ...defaultMockHook };

// Default mock all local subcomponents

describe('TableComponent', () => {
  let hookSpy: jest.SpyInstance<any, any, any>;
  // Setup and teardown functions
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockProps = { ...defaultMockProps };
    mockHook = { ...defaultMockHook };
    hookSpy = jest.spyOn(Hook, 'useTable');
    hookSpy.mockImplementation(() => mockHook);
    // Mock return values for each function that is in the props
    mockProps.onChangeTableState = jest.fn().mockResolvedValue([[], 0]);
  });
  afterEach(() => {
    jest.useRealTimers();
    hookSpy.mockRestore();
  });

  // Tests
  describe('tableHeader', () => {
    test('Should render the component with all vals in correct locations', () => {
      render(<TableComponent {...mockProps} />);
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      mockProps.columnHeaders.forEach(columnHeader => {
        expect(screen.getByText(columnHeader.label)).toBeInTheDocument();
        expect(
          screen.getByTestId(`sortable-column-header-${columnHeader.id}`)
        ).toBeInTheDocument();
      });
      expect(
        screen.getByTestId(`sortable-column-header-direction-id`)
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId(`sortable-column-header-direction-name`)
      ).not.toBeInTheDocument();
    });
    test('Should call onChangeSort when a sortable column header is clicked', () => {
      render(<TableComponent {...mockProps} />);
      const sortableColumnHeader = screen.getByTestId(
        `sortable-column-header-id`
      );
      fireEvent.click(sortableColumnHeader);
      expect(mockHook.onChangeSort).toHaveBeenCalledTimes(1);
    });
    describe('sortState.sortDirection', () => {
      test('asc', () => {
        render(<TableComponent {...mockProps} />);
        expect(
          screen.getByTestId(`sortable-column-header-direction-id`)
        ).toHaveTextContent('sorted ascending');
      });
      test('desc', () => {
        mockHook.sortState.sortDirection = 'desc';
        render(<TableComponent {...mockProps} />);
        expect(
          screen.getByTestId(`sortable-column-header-direction-id`)
        ).toHaveTextContent('sorted descending');
      });
    });
  });

  describe('tableBody', () => {
    test('Should render the component with all vals in correct locations', () => {
      mockHook.rowsState.rows = [
        {
          id: 1,
          name: 'test',
        },
      ];
      mockHook.rowsState.totalCount = 1;
      render(<TableComponent {...mockProps} />);
      jest.runAllTimers();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
      mockHook.rowsState.rows.forEach((row, rowIndex) => {
        expect(screen.getByTestId(`table-row-${rowIndex}`)).toBeInTheDocument();
        mockProps.columnHeaders.forEach(columnHeader => {
          expect(
            screen.getByTestId(`table-cell-${columnHeader.id}-${rowIndex}`)
          ).toBeInTheDocument();
        });
      });
    });
  });
});
