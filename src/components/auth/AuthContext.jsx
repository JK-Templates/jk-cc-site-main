import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Internal provider component to use hooks
function AuthProviderContent({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        if (currentUser) {
          setUser(currentUser);
          setIsAdmin(currentUser.email === 'yonikashi432@gmail.com');
        }
      } catch (error) {
        // Not logged in
        console.log("User not logged in");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async () => {
    await base44.auth.redirectToLogin();
  };

  const logout = async () => {
    await base44.auth.logout();
    setUser(null);
    setIsAdmin(false);
    toast.success('התנתקת בהצלחה');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }) {
  return (
    <AuthProviderContent>
      {children}
    </AuthProviderContent>
  );
}