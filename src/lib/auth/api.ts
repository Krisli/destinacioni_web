/**
 * Authentication API for .NET Backend
 * 
 * All authentication endpoints call .NET API directly.
 */

import { api, ApiError } from '@/lib/api/client';
import { decodeJWT, getStoredToken as getTokenFromStorage } from './jwt';

// Request/Response interfaces matching .NET API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  jwtToken: string;
  refreshToken: string;
  refreshTokenExpiryDate: string; // ISO 8601 date string
}

export interface RefreshTokenRequest {
  jwtToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  jwtToken: string;
  refreshToken: string;
  refreshTokenExpiryDate: string; // ISO 8601 date string
}

// Normalized response with user data extracted from JWT
export interface NormalizedLoginResponse {
  jwtToken: string;
  refreshToken: string;
  refreshTokenExpiryDate: string;
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

// Re-export ApiError for convenience
export { ApiError };

/**
 * Login user
 * Returns normalized response with user data extracted from JWT
 */
export async function login(credentials: LoginRequest): Promise<NormalizedLoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', credentials, {
      skipAuth: true, // Login endpoint doesn't require auth
    });
    
    // Extract user data from JWT token
    const payload = decodeJWT(response.jwtToken);
    if (!payload) {
      throw new Error('Failed to decode JWT token');
    }
    
    // Build normalized response
    return {
      jwtToken: response.jwtToken,
      refreshToken: response.refreshToken,
      refreshTokenExpiryDate: response.refreshTokenExpiryDate,
      user: {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0], // Fallback to email username if no name
        roles: payload.roles || [],
      },
    };
  } catch (error) {
    // Enhance error messages for login failures
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Invalid email or password');
      }
      if (error.status === 403) {
        throw new Error('Account is disabled or not verified');
      }
      if (error.status >= 500) {
        throw new Error('Server error. Please try again later');
      }
    }
    throw error;
  }
}

/**
 * Refresh access token
 * @param jwtToken - Current JWT token
 * @param refreshTokenValue - Refresh token
 */
export async function refreshToken(
  jwtToken: string,
  refreshTokenValue: string
): Promise<RefreshTokenResponse> {
  return api.post<RefreshTokenResponse>(
    '/auth/refresh',
    { 
      jwtToken,
      refreshToken: refreshTokenValue,
    },
    {
      skipAuth: true, // Refresh endpoint uses refresh token in body, not auth header
    }
  );
}

/**
 * Get current user data
 * Extracts user data from stored JWT token (no API call needed)
 */
export async function getCurrentUser(): Promise<User> {
  // Extract user data from stored JWT token
  const token = getTokenFromStorage();
  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const payload = decodeJWT(token);
  if (!payload) {
    throw new Error('Invalid token');
  }
  
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    roles: payload.roles || [],
    phone: payload.phone,
  };
}
