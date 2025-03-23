export type PageParams<K> = Readonly<{
  page: number;
  perPage: number;
  sortKey?: K;
  sortOrder?: 'asc' | 'desc';
}>;

export type PageInfo = Readonly<{
  totalCount: number;
  perPage: number;
  totalPage: number;
  currentPage: number;
}>;

export type PaginationResult<T> = Readonly<{
  items: T[];
  pageInfo: PageInfo;
  key: string;
}>;
