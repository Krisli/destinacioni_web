// Dummy JWT decode function for middleware
export function decodeJwt(token: string) {
  try {
    // In a real implementation, you would use a JWT library like 'jsonwebtoken'
    // For now, this is a dummy implementation that returns mock data
    
    // Basic validation - check if token looks like a JWT (3 parts separated by dots)
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Mock decoded payload - replace with actual JWT decoding
    const mockPayload = {
      sub: 'user123',
      roles: ['user'], // Default role
      exp: Date.now() / 1000 + 3600, // 1 hour from now
      iat: Date.now() / 1000,
    }

    // For demo purposes, you can modify roles based on token content
    if (token.includes('vendor')) {
      mockPayload.roles = ['vendor']
    } else if (token.includes('admin')) {
      mockPayload.roles = ['admin']
    }

    return mockPayload
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}

// Additional auth utilities (dummy implementations)
export function createAccessToken(payload: any): string {
  // Dummy implementation - in real app, use a JWT library
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  const signature = 'dummy-signature'
  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): boolean {
  // Dummy implementation - in real app, verify JWT signature
  const decoded = decodeJwt(token)
  if (!decoded) return false
  
  // Check expiration
  const now = Date.now() / 1000
  return decoded.exp > now
}

export function getTokenFromRequest(request: Request): string | null {
  // Extract token from Authorization header or cookies
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // For cookies, you'd need to parse the cookie header
  // This is handled in middleware via req.cookies.get()
  return null
}
