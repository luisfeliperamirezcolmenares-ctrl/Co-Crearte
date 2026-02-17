import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistence
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async () => {
    // Simulate Google Login Popup flow
    // In a real app, you would use useGoogleLogin from @react-oauth/google
    return new Promise<void>((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const mockUser: User = {
          id: 'google-uid-123',
          displayName: 'Operario Colsubsidio',
          email: 'operaciones@colsubsidio.com',
          // Google-style placeholder avatar
          photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocIq8d_8d_8d_8d_8d_8d_8d_8d=s96-c' 
        };
        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        resolve();
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};