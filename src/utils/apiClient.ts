/**
 * Shared API client for making requests to the backend with consistent error handling.
 */

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export async function apiPost<T>(
  url: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let json: any;
  try {
    json = await response.json();
  } catch {
    return {
      success: false,
      error: `Request failed with status ${response.status} (non-JSON response)`,
    };
  }

  if (response.ok && json.success) {
    return { success: true, data: json as T };
  }

  return {
    success: false,
    error: json.error || `Request failed with status ${response.status}`,
  };
}

export async function apiGet<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);

  let json: any;
  try {
    json = await response.json();
  } catch {
    return {
      success: false,
      error: `Request failed with status ${response.status} (non-JSON response)`,
    };
  }

  if (response.ok && json.success !== false) {
    return { success: true, data: json as T };
  }

  return {
    success: false,
    error: json.error || `Request failed with status ${response.status}`,
  };
}
