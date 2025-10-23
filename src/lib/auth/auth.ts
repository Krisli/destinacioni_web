/**
 * Core authentication utilities
 * This is the main auth module that provides getUser and other utilities
 */

import { 
  getStoredToken, 
  setStoredToken, 
  removeStoredToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
  removeStoredRefreshToken,
  isTokenExpired,
  decodeJWT,
  type JWTPayload 
} from './jwt';
import { 
  getCurrentUser, 
  refreshToken, 
  logout as apiLogout,
  type User 
} from './api';

export interface AuthUser extends User {
  isAuthenticated: boolean;
  token: string | null;
}

export type UserRole = 'user' | 'vendor' | 'admin';

/**
 * Get current user data with authentication status
 * This is the main function you'll use throughout the app
 */
export async function getUser(): Promise<AuthUser | null> {
  try {
    const token = getStoredToken();
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      // Try to refresh the token
      const refreshTokenValue = getStoredRefreshToken();
      if (refreshTokenValue) {
        try {
          const refreshResponse = await refreshToken(refreshTokenValue);
          setStoredToken(refreshResponse.access_token);
          setStoredRefreshToken(refreshResponse.refresh_token);
          
          // Get user data with new token
          const user = await getCurrentUser();
          return {
            ...user,
            isAuthenticated: true,
            token: refreshResponse.access_token,
          };
        } catch (error) {
          // Refresh failed, clear tokens
          clearAuthData();
          return null;
        }
      } else {
        // No refresh token, clear auth data
        clearAuthData();
        return null;
      }
    }

    // Token is valid, get user data
    const user = await getCurrentUser();
    return {
      ...user,
      isAuthenticated: true,
      token,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    clearAuthData();
    return null;
  }
}

/**
 * Get user data synchronously (from token only)
 * Use this when you need immediate user data without API call
 */
export function getUserSync(): AuthUser | null {
  const token = getStoredToken();
  
  if (!token || isTokenExpired(token)) {
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  return {
    id: payload.sub,
    email: payload.email,
    name: payload.email.split('@')[0], // Fallback name
    roles: payload.roles,
    isAuthenticated: true,
    token,
  };
}

/**
 * Check if user has specific role
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  if (!user || !user.isAuthenticated) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AuthUser | null, roles: UserRole[]): boolean {
  if (!user || !user.isAuthenticated) return false;
  return roles.some(role => user.roles.includes(role));
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user is vendor
 */
export function isVendor(user: AuthUser | null): boolean {
  return hasRole(user, 'vendor');
}

/**
 * Check if user is regular user
 */
export function isUser(user: AuthUser | null): boolean {
  return hasRole(user, 'user');
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  removeStoredToken();
  removeStoredRefreshToken();
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await apiLogout();
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    clearAuthData();
  }
}

/**
 * Get user's primary role (highest privilege)
 */
export function getPrimaryRole(user: AuthUser | null): UserRole | null {
  if (!user || !user.isAuthenticated) return null;
  
  if (user.roles.includes('admin')) return 'admin';
  if (user.roles.includes('vendor')) return 'vendor';
  if (user.roles.includes('user')) return 'user';
  
  return null;
}

/**
 * Check if user can access vendor portal
 */
export function canAccessVendor(user: AuthUser | null): boolean {
  return hasAnyRole(user, ['vendor', 'admin']);
}

/**
 * Check if user can access admin portal
 */
export function canAccessAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}
