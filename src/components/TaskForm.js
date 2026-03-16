import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTask, updateTask, tasks } = useTask();
  
  const isEditing = Boolean(id);
  const existingTask = tasks.find(task => task.id === parseInt(id));
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && existingTask) {
      setFormData({
        title: existingTask.title || '',
        description: existingTask.description || '',
        status: existingTask.status || 'todo'
      });
    }
  }, [isEditing, existingTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug: Log the form data being sent
    console.log('Submitting task data:', formData);

    try {
      if (isEditing) {
        await updateTask(parseInt(id), formData);
      } else {
        await createTask(formData);
      }
      navigate('/tasks');
    } catch (err) {
      console.error('Task creation error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Extract more detailed error information
      let errorMessage = 'Failed to save task';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle field-specific errors
        if (errorData.title) {
          errorMessage = `Title: ${Array.isArray(errorData.title) ? errorData.title[0] : errorData.title}`;
        } else if (errorData.description) {
          errorMessage = `Description: ${Array.isArray(errorData.description) ? errorData.description[0] : errorData.description}`;
        } else if (errorData.status) {
          errorMessage = `Status: ${Array.isArray(errorData.status) ? errorData.status[0] : errorData.status}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 sm:py-0">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEditing 
              ? 'Update your task information below.'
              : 'Fill in the details below to create a new task.'
            }
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Task Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength="200"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title..."
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter task description..."
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="form-button"
                >
                  {loading 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? 'Update Task' : 'Create Task')
                  }
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/tasks')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
