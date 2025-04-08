import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the shape of the user object
interface User {
  id: string;
  name: string;
  email: string;
}

// Define the context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create the auth context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  clearError: () => {},
});

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode;
}

// Create the auth provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // For now, we'll assume the token is valid without additional validation
          // In a real app, you might want to verify the token with the server
          setIsAuthenticated(true);
          setLoading(false);
        } catch (err) {
          // Clear invalid token
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
          setLoading(false);
          setError('Authentication error. Please login again.');
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login user
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', authToken);
      
      // Set default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { token: authToken, user: userData } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', authToken);
      
      // Set default headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 