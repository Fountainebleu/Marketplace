interface IPageInfo {
  items: unknown[];
  totalCount: number;
  pageSize: number;
  pageCount: number;
}

export function getPageInfo(
  data: { items?: unknown[]; totalCount?: number; pageSize?: number } | undefined,
  defaultPageSize: number,
): IPageInfo {
  const totalCount = data?.totalCount ?? 0;
  const pageSize = data?.pageSize ?? defaultPageSize;
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    items: data?.items ?? [],
    totalCount,
    pageSize,
    pageCount,
  };
}
