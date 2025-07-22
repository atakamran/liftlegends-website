import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { setRedirectUrl } from '@/utils/redirectUtils';

interface UseAuthRedirectOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Hook to handle authentication redirects
 * @param options - Configuration options
 * @returns Object with user data and loading state
 */
export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { redirectTo = '/login', requireAuth = true } = options;
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Check localStorage first for quick feedback
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        // Get current session
        const { data } = await supabase.auth.getSession();
        
        if (data.session && data.session.user) {
          // User is authenticated
          setUser(data.session.user);
          setIsAuthenticated(true);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          // User is not authenticated
          setUser(null);
          setIsAuthenticated(false);
          localStorage.setItem('isLoggedIn', 'false');
          
          // If authentication is required, redirect to login
          if (requireAuth) {
            setRedirectUrl();
            navigate(redirectTo);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setIsAuthenticated(false);
        
        if (requireAuth) {
          setRedirectUrl();
          navigate(redirectTo);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          setIsAuthenticated(true);
          localStorage.setItem('isLoggedIn', 'true');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.setItem('isLoggedIn', 'false');
          
          if (requireAuth) {
            setRedirectUrl();
            navigate(redirectTo);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, redirectTo, requireAuth]);

  return {
    user,
    loading,
    isAuthenticated
  };
};