// shared/api/http.ts
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// функция, откуда достаём токен
// можешь заменить на cookies, zustand, next-auth session, etc
function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

interface RequestOptions extends RequestInit {
  auth?: boolean; // <-- нужно ли добавлять Authorization
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // подшить токен если auth = true
  if (options.auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text();

    // можешь подшить logout, refresh или throw typed error
    throw new Error(`API error: ${res.status} ${text}`);
  }

  return res.json();
}

export const api = {
  get: <T>(url: string, opts?: RequestOptions) =>
    request<T>(url, { ...opts, method: "GET" }),

  post: <T>(url: string, body?: any, opts?: RequestOptions) =>
    request<T>(url, {
      ...opts,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body?: any, opts?: RequestOptions) =>
    request<T>(url, {
      ...opts,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, opts?: RequestOptions) =>
    request<T>(url, { ...opts, method: "DELETE" }),
};
