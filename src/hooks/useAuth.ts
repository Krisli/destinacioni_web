/**
 * Authentication hook for easier access to auth state
 * This is a re-export of the useAuth hook from AuthContext
 */

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

export const useAuth = useAuthContext;
