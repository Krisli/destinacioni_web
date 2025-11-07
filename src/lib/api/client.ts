/**
 * API Client for .NET Backend
 * 
 * Calls .NET API directly from both client and server.
 * Requires .NET API to have CORS properly configured.
 */

// API base URL from environment
const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 
    'http://destination-alb-1339224077.eu-central-1.elb.amazonaws.com/api';
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request configuration
export interface ApiRequestConfig extends RequestInit {
  skipAuth?: boolean; // Skip automatic token injection
  retries?: number; // Number of retries for failed requests
}

/**
 * Parse error response from API
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  let errorData: unknown;
  let errorMessage: string;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
      const data = errorData as Record<string, unknown>;
      errorMessage = 
        (typeof data.message === 'string' ? data.message : null) ||
        (typeof data.error === 'string' ? data.error : null) ||
        (Array.isArray(data.errors) && data.errors.length > 0 
          ? String(data.errors[0]) 
          : null) ||
        response.statusText ||
        `HTTP ${response.status}`;
    } else {
      const text = await response.text();
      errorMessage = text || response.statusText || `HTTP ${response.status}`;
      errorData = { text };
    }
  } catch {
    errorMessage = response.statusText || `HTTP ${response.status}`;
    errorData = null;
  }

  return new ApiError(
    errorMessage,
    response.status,
    response.statusText,
    errorData
  );
}

/**
 * Get stored JWT token for authentication
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const tokenCookie = cookies.find(cookie => cookie.startsWith('jwt_token='));
    return tokenCookie ? tokenCookie.substring('jwt_token='.length) : null;
  } catch {
    return null;
  }
}

/**
 * Main API client function
 */
export async function apiClient<T>(
  endpoint: string,
  config: ApiRequestConfig = {}
): Promise<T> {
  const {
    skipAuth = false,
    retries = 0,
    headers = {},
    ...restConfig
  } = config;

  // Build URL
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Get token if not skipping auth
  let token: string | null = null;
  if (!skipAuth) {
    token = getAuthToken();
  }

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add authorization header if token exists
  if (token && !skipAuth) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Make request with retry logic
  let lastError: ApiError | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      // Handle non-OK responses
      if (!response.ok) {
        throw await parseErrorResponse(response);
      }

      // Handle empty responses (204 No Content, etc.)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json() as Promise<T>;
      }
      
      // For non-JSON responses
      if (response.status === 204) {
        return {} as T;
      }

      const text = await response.text();
      return (text ? JSON.parse(text) : {}) as T;

    } catch (error) {
      // If it's our ApiError, store it and potentially retry
      if (error instanceof ApiError) {
        lastError = error;
        
        // Don't retry on 4xx errors (except 429 rate limit)
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }
        
        // Retry on 5xx errors or 429 rate limit
        if (attempt < retries && (error.status >= 500 || error.status === 429)) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
          continue;
        }
      }
      
      throw error;
    }
  }

  throw lastError || new ApiError('Request failed after retries', 0, 'Unknown');
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: Omit<ApiRequestConfig, 'method'>) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
    apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};

export default apiClient;

