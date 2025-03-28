import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import jwtDecode from 'jwt-decode';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Reducer
function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for token on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        dispatch({ type: 'AUTH_ERROR' });
        return;
      }

      try {
        // Validate token expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_ERROR', payload: 'Token expired' });
          return;
        }

        // Get user data
        const res = await api.get('/auth/me');
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: res.data.data,
        });
      } catch (err) {
        localStorage.removeItem('token');
        dispatch({
          type: 'AUTH_ERROR',
          payload: err.response?.data?.message || 'Authentication failed',
        });
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data.data,
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.message || 'Login failed',
      });
      throw err;
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      localStorage.setItem('token', res.data.token);
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data.data,
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: err.response?.data?.message || 'Registration failed',
      });
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
