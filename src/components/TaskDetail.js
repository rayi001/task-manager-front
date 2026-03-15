import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, deleteTask } = useTask();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === parseInt(id));
    if (foundTask) {
      setTask(foundTask);
      setLoading(false);
    } else {
      setError('Task not found');
      setLoading(false);
    }
  }, [id, tasks]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(parseInt(id));
        navigate('/tasks');
      } catch (error) {
        setError('Failed to delete task');
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
        <div className="text-lg">Loading task details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-lg">Task not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 sm:py-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              Task Details
            </h1>
            <div className="flex space-x-4">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Task
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {task.title}
                </h2>
                <span className={getStatusBadge(task.status)}>
                  {getStatusText(task.status)}
                </span>
              </div>

              {task.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className={getStatusBadge(task.status)}>
                        {getStatusText(task.status)}
                      </span>
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Created
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.created_at).toLocaleDateString()} at {new Date(task.created_at).toLocaleTimeString()}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Last Updated
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(task.updated_at).toLocaleDateString()} at {new Date(task.updated_at).toLocaleTimeString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <Link
              to="/tasks"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
