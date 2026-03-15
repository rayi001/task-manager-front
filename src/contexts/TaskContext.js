import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

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

  const fetchTasks = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/');
      dispatch({
        type: 'FETCH_TASKS_SUCCESS',
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.detail || 'Failed to fetch tasks'
      });
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/', taskData);
      dispatch({
        type: 'ADD_TASK',
        payload: response.data
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data || 'Failed to create task'
      });
      throw error;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/tasks/${id}/`, taskData);
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
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
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
