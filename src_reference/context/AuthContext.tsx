import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin } from '../components/api';
import { Client } from '../components/types';

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response: Client = await apiLogin(email, password);

      if (response && response.id_key) {
        const userData: User = {
          id: response.id_key.toString(),
          email: response.email,
          name: response.name,
          isAdmin: response.is_admin || email === 'admin@techstore.com',
        };

        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return userData;
      }

      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
