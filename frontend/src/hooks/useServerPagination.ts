import { useCallback, useEffect, useState } from 'react';

interface PageInfo {
  items: unknown[];
  totalCount: number;
  pageSize: number;
  pageCount: number;
}

export function getPageInfo(
  data: { items?: unknown[]; totalCount?: number; pageSize?: number } | undefined,
  defaultPageSize: number,
): PageInfo {
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

export function useServerPagination(resetDeps: unknown[] = []) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, resetDeps);

  const goToPage = (value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clampToMax = useCallback((maxPage: number) => {
    setPage((current) => (current > maxPage ? maxPage : current));
  }, []);

  return { page, goToPage, clampToMax };
}
