import { cookies } from 'next/headers';
import { API_BASE_URL } from './api';

export async function fetchServerApi(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const baseUrl = process.env.INTERNAL_API_URL || API_BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    cache: options.cache || 'no-store'
  };

  const response = await fetch(url, config);

  let data;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Server API Error');
  }

  return data;
}
