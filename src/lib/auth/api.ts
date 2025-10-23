/**
 * API utilities for authentication with .NET backend
 * 
 * MOCKING: Set MOCK_AUTH=true in environment to use mock authentication
 * Remove mock imports and logic when backend is ready
 */

// Mock imports - REMOVE WHEN BACKEND IS READY
import {
  mockLogin,
  mockRefreshToken,
  mockGetCurrentUser,
  mockLogout,
  mockRegister,
  mockRequestPasswordReset,
  mockResetPassword,
} from './mock';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatar?: string;
  phone?: string;
  company?: string; // For vendors
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Base API URL - should be in environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.destinacioni.com';

// Mock flag - REMOVE WHEN BACKEND IS READY
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' || process.env.NODE_ENV === 'development';

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockLogin(credentials);
  }
  
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockRefreshToken(refreshToken);
  }
  
  return apiRequest<RefreshTokenResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

/**
 * Get current user data
 */
export async function getCurrentUser(): Promise<User> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockGetCurrentUser();
  }
  
  return apiRequest<User>('/auth/me');
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockLogout();
  }
  
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
}

/**
 * Register new user
 */
export async function register(userData: {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'vendor';
}): Promise<LoginResponse> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockRegister(userData);
  }
  
  return apiRequest<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockRequestPasswordReset(email);
  }
  
  return apiRequest<void>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Reset password
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // MOCK: Use mock when enabled - REMOVE WHEN BACKEND IS READY
  if (USE_MOCK_AUTH) {
    return mockResetPassword(token, newPassword);
  }
  
  return apiRequest<void>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password: newPassword }),
  });
}
