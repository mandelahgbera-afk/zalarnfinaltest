import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { authAPI, supabase } from '@/api/supabaseClient';
import { db } from '@/api/dbClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const initialCheckDone = useRef(false);

  const enrichWithProfile = useCallback(async (authUser) => {
    if (!authUser?.email) return authUser;
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser.email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
      }
      
      if (profile) {
        return {
          ...authUser,
          full_name: profile.full_name,
          role: profile.role,
          db_id: profile.id,
        };
      }
    } catch (err) {
      console.error('Error enriching auth user:', err);
    }
    return authUser;
  }, []);

  const processAuthUser = useCallback(async (authUser) => {
    if (authUser) {
      const enriched = await enrichWithProfile(authUser);
      setUser(enriched);
      setIsAuthenticated(true);
      setIsAdmin(enriched.role === 'admin');
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [enrichWithProfile]);

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        if (!cancelled) {
          await processAuthUser(currentUser);
          initialCheckDone.current = true;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (!cancelled) setAuthError(error.message);
      } finally {
        if (!cancelled) setIsLoadingAuth(false);
      }
    };

    initAuth();

    const { data: { subscription } } = authAPI.onAuthStateChange(async (event, session) => {
      if (!initialCheckDone.current) return;
      await processAuthUser(session?.user || null);
    });

    return () => {
      cancelled = true;
      subscription?.unsubscribe();
    };
  }, [processAuthUser]);

  const logout = async () => {
    try {
      const { error } = await authAPI.logout();
      if (error) throw new Error(error);

      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setAuthError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError(error.message);
    }
  };

  const login = async (email, password) => {
    try {
      setAuthError(null);
      const { user: newUser, error } = await authAPI.login(email, password);

      if (error) {
        setAuthError(error);
        return { success: false, error };
      }

      await processAuthUser(newUser);
      return { success: true };
    } catch (error) {
      const message = error.message || 'Login failed';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password, metadata = {}) => {
    try {
      setAuthError(null);
      const { user: newUser, error } = await authAPI.register(email, password, metadata);

      if (error) {
        setAuthError(error);
        return { success: false, error };
      }

      setUser(newUser);
      setIsAuthenticated(true);
      setIsAdmin(false);

      return { success: true };
    } catch (error) {
      const message = error.message || 'Registration failed';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const refreshProfile = useCallback(async () => {
    if (!user?.email) return;
    const enriched = await enrichWithProfile(user);
    setUser(enriched);
    setIsAdmin(enriched.role === 'admin');
  }, [user, enrichWithProfile]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authError,
      isAdmin,
      logout,
      login,
      register,
      refreshProfile,
      isLoadingPublicSettings: isLoadingAuth,
      navigateToLogin: () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
