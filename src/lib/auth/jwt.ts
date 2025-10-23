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
 * Get token from cookies
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // More robust cookie parsing
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const tokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
  const token = tokenCookie ? tokenCookie.substring('access_token='.length) : null;
  
  return token;
}

/**
 * Store token in cookies (for middleware access)
 */
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  // Set cookie with 24 hour expiration
  const expires = new Date();
  expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
  // Use lax samesite for better compatibility and remove secure for localhost
  document.cookie = `access_token=${token}; expires=${expires.toUTCString()}; path=/; samesite=lax`;
}

/**
 * Remove token from cookies
 */
export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/**
 * Get refresh token from cookies
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refresh_token='));
  return refreshTokenCookie ? refreshTokenCookie.substring('refresh_token='.length) : null;
}

/**
 * Store refresh token in cookies
 */
export function setStoredRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  // Set cookie with 7 day expiration
  const expires = new Date();
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
  document.cookie = `refresh_token=${token}; expires=${expires.toUTCString()}; path=/; samesite=lax`;
}

/**
 * Remove refresh token from cookies
 */
export function removeStoredRefreshToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
