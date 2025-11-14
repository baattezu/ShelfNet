export type ApiClientConfig = {
  baseUrl?: string;
  defaultHeaders?: HeadersInit;
};

const DEFAULT_TIMEOUT = 8000;

export function createApiClient(config: ApiClientConfig = {}) {
  const baseUrl = config.baseUrl ?? "";
  const defaultHeaders = config.defaultHeaders ?? {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  return async function apiClient<T>(
    input: string,
    init: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const url = input.startsWith("http")
        ? input
        : `${baseUrl.replace(/\/$/, "")}/${input.replace(/^\//, "")}`;

      const response = await fetch(url, {
        ...init,
        headers: {
          ...defaultHeaders,
          ...(init.headers ?? {}),
        },
        signal: controller.signal,
      });

      const text = await response.text();
      const payload = text ? (JSON.parse(text) as T) : (undefined as T);

      if (!response.ok) {
        throw new Error(
          payload && typeof payload === "object"
            ? JSON.stringify(payload)
            : response.statusText
        );
      }

      return payload;
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };
}

export const apiClient = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
