export type TTableColumnSortOptions = 'asc' | 'desc';

export type TTableColumnHeaders = {
  id: string;
  label: string;
}[];

export type TTableColumnValues = {
  [key: string]: any;
}[];

export type TTableArgs = {
  pageNumber: number | undefined;
  numRows: number | undefined;
  searchQuery: string | undefined;
  sortHeader: string | undefined;
  sortDirection: TTableColumnSortOptions | undefined;
};
