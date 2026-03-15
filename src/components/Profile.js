import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 sm:py-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences.
          </p>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Member Since
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Account Status
                    </dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
