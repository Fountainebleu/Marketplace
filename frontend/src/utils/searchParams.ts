export function getSearchParam(searchParams: URLSearchParams, key: string): string {
  return searchParams.get(key) ?? '';
}

export function getSearchParamNumber(
  searchParams: URLSearchParams,
  key: string,
  fallback = 1,
): number {
  const value = Number(searchParams.get(key));

  if (!Number.isFinite(value) || value < 1) {
    return fallback;
  }

  return Math.floor(value);
}

export function setSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | number | undefined | null,
) {
  if (value === undefined || value === null || value === '') {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}
