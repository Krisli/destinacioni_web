/**
 * JWT utilities for client-side token handling
 * Note: This is for client-side token management only
 * Actual JWT validation happens on the backend
 */

export interface JWTPayload {
  sub: string;           // User ID
  email: string;
  roles: string[];       // ['user', 'vendor', 'admin']
  iat: number;           // Issued at
  exp: number;           // Expires at
}

/**
 * Decode JWT token (client-side only)
 * Note: This doesn't validate the signature - that's done by the backend
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Get token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

/**
 * Store token in localStorage
 */
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', token);
}

/**
 * Remove token from localStorage
 */
export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
}

/**
 * Get refresh token from localStorage
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

/**
 * Store refresh token in localStorage
 */
export function setStoredRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('refresh_token', token);
}

/**
 * Remove refresh token from localStorage
 */
export function removeStoredRefreshToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('refresh_token');
}
