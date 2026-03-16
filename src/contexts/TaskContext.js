import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../api';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'FETCH_TASKS_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        tasks: action.payload,
        error: null 
      };
    case 'ADD_TASK':
      return { 
        ...state, 
        tasks: [action.payload, ...state.tasks] 
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    default:
      return state;
  }
};

const initialState = {
  tasks: [],
  loading: false,
  error: null
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await api.get('/api/tasks/', { timeout: 10000 }); // 10 second timeout
      dispatch({
        type: 'FETCH_TASKS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      let errorMessage = 'Unable to connect to the server.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Connection timeout. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to view your tasks.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view these tasks.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      });
    }
  }, []);

  const createTask = async (taskData) => {
    try {
      const response = await api.post('/api/tasks/', taskData);
      dispatch({
        type: 'ADD_TASK',
        payload: response.data
      });
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      
      // Preserve the original error for better handling
      const enhancedError = {
        ...error,
        response: error.response ? {
          ...error.response,
          data: error.response.data || { error: 'Failed to create task' }
        } : { data: { error: 'Network error: Failed to create task' } }
      };
      
      dispatch({
        type: 'SET_ERROR',
        payload: enhancedError.response?.data?.error || 'Failed to create task'
      });
      throw enhancedError;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await api.patch(`/api/tasks/${id}/`, taskData);
      dispatch({
        type: 'UPDATE_TASK',
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data || 'Failed to update task'
      });
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}/`);
      dispatch({
        type: 'DELETE_TASK',
        payload: id
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.detail || 'Failed to delete task'
      });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <TaskContext.Provider value={{
      ...state,
      fetchTasks,
      createTask,
      updateTask,
      deleteTask,
      clearError
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
