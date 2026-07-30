export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
// In production (Vercel), we use Next.js rewrites to proxy /api to the backend, so we always use /api
export const API_BASE_URL = typeof window !== 'undefined' ? '/api' : (process.env.INTERNAL_API_URL || `${BACKEND_URL}/api`);

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set default headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Allow sending cookies (needed for JWT in HttpOnly cookie)
  const config: RequestInit = {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  };

  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch (error) {
    // If not JSON, return null or handle differently
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Something went wrong with the API request');
  }

  return data;
}
