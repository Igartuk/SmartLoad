type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestOptions {
  method: HttpMethod;
  headers?: Record<string, string>;
  data?: unknown;
}

class FetchWrapper {
  private static async request<T>(
    url: string,
    options: RequestOptions,
  ): Promise<T> {
    const { method, headers, data } = options;

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        ...headers,
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Better error handling: try to get error message from body
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) return {} as T;

      return await response.json();
    } catch (error) {
      console.error(`Error in ${method} request to ${url}:`, error);
      throw error;
    }
  }

  static get<T>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "GET", headers });
  }

  static post<T>(url: string, data: unknown, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "POST", data, headers });
  }

  static put<T>(url: string, data: unknown, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "PUT", data, headers });
  }

  static patch<T>(
    url: string,
    data: unknown,
    headers?: Record<string, string>,
  ) {
    return this.request<T>(url, { method: "PATCH", data, headers });
  }

  static delete<T>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "DELETE", headers });
  }
}

export default FetchWrapper;
