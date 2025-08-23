import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { getProfile, checkProfileStatus } from '../api/profile';
import { logout } from '../api/auth';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const statusRes = await checkProfileStatus(token);
        if (!statusRes.data.has_profile) {
          navigate('/create-profile');
          return;
        }

        const profileRes = await getProfile(token);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading Dashboard...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {profile?.name || 'User'}!</span>
            <Link to="/profile" className="flex items-center">
              <img className="h-10 w-10 rounded-full object-cover" src={profile?.photo_url || 'https://via.placeholder.com/150'} alt="Profile" />
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="ml-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 flex items-center"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
                <p className="mt-2 text-sm text-gray-500">Keep your personal information and skills up to date.</p>
                <div className="mt-6">
                  <Link to="/profile" className="text-sm font-semibold text-blue-600 hover:text-blue-500">View & Edit Profile &rarr;</Link>
                </div>
              </div>

              {/* Portfolio Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900">Your Portfolio</h3>
                <p className="mt-2 text-sm text-gray-500">Showcase your best work to attract swap partners.</p>
                <div className="mt-6">
                  <Link to="/portfolio" className="text-sm font-semibold text-blue-600 hover:text-blue-500">Manage Portfolio &rarr;</Link>
                </div>
              </div>

              {/* Matches Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900">Find Matches</h3>
                <p className="mt-2 text-sm text-gray-500">Discover users with complementary skills.</p>
                <div className="mt-6">
                  <Link to="/matches" className="text-sm font-semibold text-blue-600 hover:text-blue-500">Browse Matches &rarr;</Link>
                </div>
              </div>

              {/* Sessions Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900">Barter Sessions</h3>
                <p className="mt-2 text-sm text-gray-500">Track your ongoing and completed skill swaps.</p>
                <div className="mt-6">
                  <Link to="/sessions" className="text-sm font-semibold text-blue-600 hover:text-blue-500">View Sessions &rarr;</Link>
                </div>
              </div>

              {/* Chat Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                <p className="mt-2 text-sm text-gray-500">Communicate with your swap partners.</p>
                <div className="mt-6">
                  <Link to="/chat" className="text-sm font-semibold text-blue-600 hover:text-blue-500">Open Chat &rarr;</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
