const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export type ApiError = { message: string; code?: string }

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type')
  const isJson = contentType?.includes('application/json')
  const body = isJson ? await res.json() : await res.text()

  if (!res.ok) {
    const error: ApiError = isJson
      ? (body as ApiError)
      : { message: body || res.statusText }
    throw new Error(error.message ?? `Request failed: ${res.status}`)
  }

  return body as T
}

export async function apiGet<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  })
  return handleResponse<T>(res)
}

export async function apiPost<T>(path: string, data?: unknown, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })
  return handleResponse<T>(res)
}

export async function apiPut<T>(path: string, data?: unknown, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })
  return handleResponse<T>(res)
}

export async function apiDelete<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    method: 'DELETE',
    credentials: 'include',
  })
  return handleResponse<T>(res)
}
