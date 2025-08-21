import React, { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { getProfile, checkProfileStatus } from '../api/profile';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            <Link to="/profile">
              <img className="h-10 w-10 rounded-full object-cover" src={profile?.photo || 'https://via.placeholder.com/150'} alt="Profile" />
            </Link>
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
