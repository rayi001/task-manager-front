import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';

const TaskList = () => {
  const { tasks, fetchTasks, loading, error, deleteTask, clearError } = useTask();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'todo':
        return 'status-todo';
      case 'in_progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-todo';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 sm:py-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Tasks
          </h1>
          <p className="mt-2 text-gray-600">
            Manage and track all your tasks in one place.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={clearError}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Task Filters */}
        <div className="mb-6 flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            All Tasks
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            To Do
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            In Progress
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Completed
          </button>
        </div>

        {/* Tasks Grid */}
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No tasks yet.{' '}
              <Link to="/tasks/new" className="text-blue-600 hover:text-blue-500 font-medium">
                Create your first task
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div key={task.id} className="task-card fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {task.title}
                  </h3>
                  <span className={getStatusBadge(task.status)}>
                    {getStatusText(task.status)}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                </div>

                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View
                  </Link>
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Task Button */}
        <div className="mt-8 text-center">
          <Link
            to="/tasks/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
