'use client'

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/card';
import { useLanguage } from '@/shared/components/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { login as apiLogin, type LoginRequest } from '@/lib/auth/api';
import { setStoredToken, setStoredRefreshToken } from '@/lib/auth/jwt';

function LoginPageContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { login, user, isAuthenticated } = useAuth();
  
  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/';
  const role = searchParams.get('role') || 'user'; // user, vendor, admin

  useEffect(() => {
    // Clear any existing error when component mounts
    setError('');
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      // Apply role-based redirects
      let redirectPath = redirectTo;
      
      if (redirectTo === '/' || redirectTo === '/login') {
        if (user.roles.includes('admin')) {
          redirectPath = '/admin';
        } else if (user.roles.includes('vendor')) {
          redirectPath = '/vendor/dashboard';
        } else {
          redirectPath = '/';
        }
      }
      
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const credentials: LoginRequest = { email, password };
      const response = await apiLogin(credentials);
      
      // Store tokens (using jwtToken and refreshToken from .NET API)
      setStoredToken(response.jwtToken);
      setStoredRefreshToken(response.refreshToken);
      
      // Update auth context
      login({
        ...response.user,
        isAuthenticated: true,
        token: response.jwtToken,
      });

      // Redirect based on user role and intended destination
      let redirectPath = redirectTo;

      // If redirecting to protected area, check permissions
      if (redirectTo.startsWith('/vendor') && !response.user.roles.includes('vendor') && !response.user.roles.includes('admin')) {
        redirectPath = '/';
      } else if (redirectTo.startsWith('/admin') && !response.user.roles.includes('admin')) {
        redirectPath = '/';
      }

      // Default role-based redirects
      if (redirectTo === '/' || redirectTo === '/login') {
        if (response.user.roles.includes('admin')) {
          redirectPath = '/admin';
        } else if (response.user.roles.includes('vendor')) {
          redirectPath = '/vendor/dashboard';
        } else {
          redirectPath = '/';
        }
      }

      // Redirect immediately after successful login
      router.replace(redirectPath);
      // Don't set loading to false here since we're redirecting
    } catch (err: unknown) {
      setError((err as Error).message || t('loginError') || 'Login failed');
      setLoading(false);
    }
  };

  const getRoleSpecificText = () => {
    switch (role) {
      case 'vendor':
        return {
          title: t('vendorLogin') || 'Vendor Login',
          description: t('vendorLoginDescription') || 'Access your vendor dashboard',
        };
      case 'admin':
        return {
          title: t('adminLogin') || 'Admin Login',
          description: t('adminLoginDescription') || 'Access the admin panel',
        };
      default:
        return {
          title: t('userLogin') || 'User Login',
          description: t('userLoginDescription') || 'Sign in to your account',
        };
    }
  };

  const { title, description } = getRoleSpecificText();

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email') || 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail') || 'Enter your email'}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('password') || 'Password'}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterPassword') || 'Enter your password'}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signingIn') || 'Signing in...'}
                  </>
                ) : (
                  t('signIn') || 'Sign In'
                )}
              </Button>
            </form>

            {/* Additional Links */}
            <div className="mt-6 space-y-2 text-center">
              <Button
                variant="link"
                className="text-sm"
                onClick={() => router.push('/forgot-password')}
              >
                {t('forgotPassword') || 'Forgot your password?'}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                {t('dontHaveAccount') || "Don't have an account?"}{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => router.push('/register')}
                >
                  {t('signUp') || 'Sign up'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
