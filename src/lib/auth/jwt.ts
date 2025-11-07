/**
 * JWT utilities for client-side token handling
 * Note: This is for client-side token management only
 * Actual JWT validation happens on the backend
 */

// .NET JWT uses XML schema claims with full URIs
interface NetJWTClaims {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string; // User ID
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string; // Email
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string; // First name
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'?: string; // Last name
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'?: string; // Phone
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'?: string | string[]; // Roles
  exp: number; // Expiration timestamp
  iat?: number; // Issued at
}

// Simplified interface for our app
export interface JWTPayload {
  sub: string;           // User ID
  email: string;
  name?: string;         // Full name (first + last)
  roles: string[];      // ['user', 'vendor', 'admin']
  phone?: string;       // Mobile phone
  iat?: number;         // Issued at
  exp: number;          // Expires at
}

/**
 * Decode JWT token (client-side only)
 * Note: This doesn't validate the signature - that's done by the backend
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const rawPayload = JSON.parse(atob(parts[1])) as NetJWTClaims;
    
    // Convert .NET claims structure to our simplified format
    const idClaim = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
    const emailClaim = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    const nameClaim = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    const surnameClaim = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'];
    const phoneClaim = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'];
    const roleClaim = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
    
    // Handle roles - can be string or array
    let roles: string[] = [];
    if (roleClaim) {
      roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    }
    
    // Combine first name and surname
    const fullName = [nameClaim, surnameClaim].filter(Boolean).join(' ') || undefined;
    
    return {
      sub: idClaim,
      email: emailClaim,
      name: fullName,
      roles,
      phone: phoneClaim,
      iat: rawPayload.iat,
      exp: rawPayload.exp,
    };
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
  
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const tokenCookie = cookies.find(cookie => cookie.startsWith('jwt_token='));
  return tokenCookie ? tokenCookie.substring('jwt_token='.length) : null;
}

/**
 * Store token in cookies (for middleware access)
 */
export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') return;
  // Set cookie with 24 hour expiration
  const expires = new Date();
  expires.setTime(expires.getTime() + (24 * 60 * 60 * 1000));
  document.cookie = `jwt_token=${token}; expires=${expires.toUTCString()}; path=/; samesite=lax`;
}

/**
 * Remove token from cookies
 */
export function removeStoredToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
