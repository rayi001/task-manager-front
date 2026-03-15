import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      };
    case 'REGISTER_START':
      return { ...state, loading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password
      });
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.access
        }
      });
      
      return response.data;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.error || 'Login failed'
      });
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'REGISTER_START' });
    try {
      const response = await axios.post('http://localhost:8000/api/register/', userData);
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.access
        }
      });
      
      return response.data;
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.response?.data || 'Registration failed'
      });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout
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
