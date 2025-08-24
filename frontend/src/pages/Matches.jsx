import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPotentialMatches } from '../api/matches';
import { createBarterSession } from '../api/skills';
import MatchCard from '../components/MatchCard';
import SkillsBrowser from '../components/SkillsBrowser';
import UsersList from './UsersList';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('browse'); // 'browse', 'matches', or 'users'
  const navigate = useNavigate();

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const data = await getPotentialMatches(token);
      setMatches(data);
      setView('matches');
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateBarterFromSkill = async (user) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Here you would typically show a modal to select which skills to exchange
      // For now, we'll just create a simple barter session with the first matching skills
      const barterData = {
        provider_id: user.id,
        offered_skill_id: user.requested_skills[0]?.id, // First skill they're looking for
        requested_skill_id: user.offered_skills[0]?.id  // First skill they offer
      };

      await createBarterSession(barterData);
      alert('Barter session initiated successfully!');
      
      // Refresh the matches
      await fetchMatches();
    } catch (error) {
      console.error('Error initiating barter:', error);
      alert('Failed to initiate barter. Please try again.');
    }
  };

  const handleInitiateBarter = async (barterData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/barter-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(barterData)
      });

      if (!response.ok) {
        throw new Error('Failed to initiate barter');
      }

      // Update the matches list to remove the matched user
      setMatches(prevMatches => 
        prevMatches.filter(match => match.user.id !== barterData.provider_id)
      );
      
      return await response.json();
    } catch (error) {
      console.error('Error initiating barter:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Finding Potential Matches...</h1>
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Find Your Skill Matches</h1>
          <p className="text-lg text-gray-600">Connect with others to exchange skills and knowledge</p>
        </div>

        {/* Toggle between browse, matches, and users */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setView('browse')}
              className={`px-6 py-2 text-sm font-medium ${
                view === 'browse'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${view === 'browse' ? 'rounded-l-lg' : 'border-l border-gray-300'}`}
            >
              Browse Skills
            </button>
            <button
              onClick={fetchMatches}
              className={`px-6 py-2 text-sm font-medium ${
                view === 'matches'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-l border-r border-gray-300`}
            >
              View Matches
            </button>
            <button
              onClick={() => setView('users')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                view === 'users'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse All Users
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : view === 'browse' ? (
          <div className="bg-white rounded-lg shadow p-6">
            <SkillsBrowser onInitiateBarter={handleInitiateBarterFromSkill} />
          </div>
        ) : view === 'users' ? (
          <UsersList />
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => (
              <MatchCard 
                key={match.user.id} 
                match={match} 
                onInitiateBarter={handleInitiateBarter}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any potential matches based on your skills. Try updating your profile with more skills.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/profile')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
