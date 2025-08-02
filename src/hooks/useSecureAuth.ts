import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { checkRateLimit } from '@/utils/security';

export const useSecureAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Log auth events for security monitoring
        console.log(`Auth event: ${event}`, { 
          userId: session?.user?.id,
          timestamp: new Date().toISOString() 
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const secureSignIn = async (email: string, password: string) => {
    const identifier = `signin:${email}`;
    
    if (!checkRateLimit(identifier)) {
      throw new Error('تعداد تلاش‌های ورود بیش از حد مجاز. لطفاً بعداً تلاش کنید.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    return data;
  };

  const secureSignUp = async (email: string, password: string) => {
    const identifier = `signup:${email}`;
    
    if (!checkRateLimit(identifier, 3)) {
      throw new Error('تعداد تلاش‌های ثبت‌نام بیش از حد مجاز. لطفاً بعداً تلاش کنید.');
    }

    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }

    return data;
  };

  const secureSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    secureSignIn,
    secureSignUp,
    secureSignOut,
    isAuthenticated: !!session
  };
};