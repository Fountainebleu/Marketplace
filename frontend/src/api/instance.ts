export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText;

    try {
      const body = await response.json();
      if (body.title) {
        message = body.title;
      } else if (body.message) {
        message = body.message;
      }
    } catch {
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) {
    return '';
  }

  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

export async function apiGet<T>(url: string, params?: Record<string, string | number | undefined>) {
  const fullUrl = `${url}${buildQuery(params)}`;
  const response = await fetch(fullUrl, { headers: { Accept: 'application/json' } });

  return parseResponse<T>(response);
}

export async function apiPost<T>(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

export async function apiPut<T>(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

export async function apiPatch<T>(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response);
}

export async function apiDelete(url: string) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });

  return parseResponse<void>(response);
}
