import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMatches, getAvailableSkills } from '../api/matching';
import { createBarterSession } from '../api/skills';
import useAuth from '../hooks/useAuth';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Matches = () => {
  console.log('Matches component rendering...');
  const [matches, setMatches] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    skill_id: '',
    location: ''
  });
  const [view, setView] = useState('browse');
  const navigate = useNavigate();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    console.log('Auth check effect:', { isAuthenticated, authLoading });
    if (!authLoading && !isAuthenticated) {
      console.log('Redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch available skills for filter
  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    
    const fetchSkills = async () => {
      setLoadingSkills(true);
      try {
        const response = await getAvailableSkills(token);
        setSkills(response.data.data || []);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, [token, isAuthenticated, authLoading]);

  // Fetch matches based on filters
  const fetchMatches = useCallback(async () => {
    console.log('fetchMatches called', { isAuthenticated, view });
    if (!isAuthenticated) {
      console.log('Not authenticated, returning early');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching matches with filters:', filters);
      
      const response = await getMatches(token, filters);
      console.log('Matches API response:', response.data);
      
      if (response.data && response.data.success) {
        setMatches(response.data.data || []);
      } else {
        console.error('API returned unsuccessful response:', response.data);
        setError(response.data?.error || 'Failed to load matches');
        setMatches([]);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again later.');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, [token, filters, isAuthenticated, view]);

  // Fetch matches when filters or view changes
  useEffect(() => {
    console.log('useEffect triggered', { isAuthenticated, view, filters });
    if (isAuthenticated && view === 'matches') {
      console.log('Fetching matches...');
      fetchMatches();
    } else {
      console.log('Skipping fetch - condition not met', { isAuthenticated, view });
    }
  }, [filters, view, isAuthenticated, fetchMatches]);

  const handleInitiateBarterFromSkill = async (user) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {

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

  const handleInitiateBarter = useCallback(async (barterData) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
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
      setError('Failed to initiate barter. Please try again.');
      throw error;
    }
  }, [isAuthenticated, navigate]);

  console.log('Rendering Matches component state:', {
    loading,
    isAuthenticated,
    authLoading,
    matchesCount: matches.length,
    error
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Finding Potential Matches...</h1>
          <div className="flex flex-col items-center p-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <div className="text-gray-600">Loading matches...</div>
            <div className="text-sm text-gray-500">
              {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
            </div>
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

        {/* Simple view toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setView('browse')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                view === 'browse' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Browse Skills
            </button>
            <button
              onClick={() => setView('matches')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                view === 'matches' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              View Matches
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
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
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
        ) : (
          <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Find Matches</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Connect with other users who have the skills you need and need the skills you have.
                </p>
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
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => (
                  <div key={match.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{match.name}</h3>
                      {match.profile?.location && (
                        <p className="mt-1 text-sm text-gray-500 flex items-center">
                          <LocationOnIcon className="h-4 w-4 mr-1 text-gray-400" />
                          {match.profile.location}
                        </p>
                      )}
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Offers:</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {match.offered_skills?.map((skill) => (
                            <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Looking for:</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {match.required_skills?.map((skill) => (
                            <span key={skill.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          onClick={() => handleInitiateBarterFromSkill(match)}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Start Barter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
