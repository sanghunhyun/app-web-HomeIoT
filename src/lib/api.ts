export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('home_iot_token');
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
