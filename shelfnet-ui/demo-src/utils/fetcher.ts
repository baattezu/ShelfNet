export type APIError = { status: number; message: string };

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const url = path.startsWith("http")
    ? path
    : `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
  });

  const text = await res.text();

  if (!res.ok) {
    throw { status: res.status, message: text || res.statusText } as APIError;
  }

  if (!text) return null as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    return text as unknown as T;
  }
}

export default apiFetch;
