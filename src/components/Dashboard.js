import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import { testApiConnection } from '../utils/apiTest';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { tasks, fetchTasks, loading, error, clearError } = useTask();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // 5 second timeout

    // Only fetch tasks if user is authenticated
    if (user) {
      fetchTasks();
    }
    
    return () => clearTimeout(timeout);
  }, [fetchTasks, user]);

  const getStatusCount = (status) => {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.filter(task => task.status === status).length;
  };

  const todoCount = getStatusCount('todo');
  const inProgressCount = getStatusCount('in_progress');
  const completedCount = getStatusCount('completed');

  if (loading && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (loadingTimeout && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600 mb-4">Taking longer than expected...</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 sm:py-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your tasks.
          </p>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connection Issue</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => {
                    clearError();
                    fetchTasks();
                  }}
                  className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                >
                  Retry
                </button>
                <button
                  onClick={async () => {
                    const result = await testApiConnection();
                    console.log('API Test Result:', result);
                    const message = result.results ? result.results.join('\n') : `Test failed: ${result.error}`;
                    alert(`API Test Results:\n\n${message}\n\nCheck console (F12) for more details.`);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Test API
                </button>
                <button
                  onClick={clearError}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8">
          {/* Todo Tasks */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <div className="text-white text-2xl">📋</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      To Do
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {todoCount}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  <Link to="/tasks" className="hover:text-gray-700">
                    View all to-do tasks →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <div className="text-white text-2xl">🔄</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      In Progress
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {inProgressCount}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  <Link to="/tasks" className="hover:text-gray-700">
                    View all in-progress tasks →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <div className="text-white text-2xl">✅</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-gray-900 truncate">
                      Completed
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {completedCount}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  <Link to="/tasks" className="hover:text-gray-700">
                    View all completed tasks →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="text-center">
            <Link
              to="/tasks/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create New Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
