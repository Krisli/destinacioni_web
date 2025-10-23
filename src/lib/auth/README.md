# Authentication System

## Mock Authentication (Development)

The authentication system includes mock functionality for development when the backend is not ready.

### Mock Users

The following test accounts are available:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@destinacioni.com` | `admin123` | Admin | Full admin access |
| `vendor@destinacioni.com` | `vendor123` | Vendor | Vendor portal access |
| `user@destinacioni.com` | `user123` | User | Regular user access |

### Environment Variables

Add to your `.env.local`:

```env
# Enable mock authentication
NEXT_PUBLIC_MOCK_AUTH=true

# API URL (when backend is ready)
NEXT_PUBLIC_API_URL=https://api.destinacioni.com
```

### Switching to Real Backend

When the backend is ready:

1. Set `NEXT_PUBLIC_MOCK_AUTH=false` or remove it
2. Update `NEXT_PUBLIC_API_URL` to your real API
3. Delete `src/lib/auth/mock.ts`
4. Remove mock imports from `src/lib/auth/api.ts`

### Mock Features

- ✅ Login with test accounts
- ✅ Role-based routing
- ✅ Token refresh simulation
- ✅ User data fetching
- ✅ Logout functionality
- ✅ Registration simulation
- ✅ Password reset simulation

### Testing Different Roles

1. **Admin Access**: Login with `admin@destinacioni.com` → Can access `/admin`
2. **Vendor Access**: Login with `vendor@destinacioni.com` → Can access `/vendor`
3. **User Access**: Login with `user@destinacioni.com` → Redirected to home page

### Mock Token Behavior

- Tokens expire after 24 hours
- Refresh tokens work automatically
- All tokens are mock JWT format (not cryptographically secure)
- Tokens are stored in localStorage
