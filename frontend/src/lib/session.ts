import { cookies } from 'next/headers';
import { API_BASE_URL } from './api';

export function getUserSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export async function getProfile() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  
  try {
    const baseUrl = process.env.INTERNAL_API_URL || API_BASE_URL;
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (error) {
    return null;
  }
}

export async function getGrades() {
  try {
    const baseUrl = process.env.INTERNAL_API_URL || API_BASE_URL;
    const res = await fetch(`${baseUrl}/settings/grades`, {
      cache: 'no-store' // Or use Next.js revalidate tags
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}
