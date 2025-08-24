import React, { useState, useEffect } from 'react';
import { getSkills, getUsersBySkill } from '../api/skills';
import { FaSearch, FaExchangeAlt, FaUser, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const SkillsBrowser = ({ onInitiateBarter }) => {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const data = await getSkills();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleSkillSelect = async (skill) => {
    try {
      setSelectedSkill(skill);
      setLoading(true);
      const data = await getUsersBySkill(skill.id);
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users for skill:', err);
      setError('Failed to load users for this skill.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !selectedSkill) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
    );
  }

  if (!selectedSkill) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleSkillSelect(skill)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-left"
            >
              <h3 className="font-medium text-gray-900">{skill.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{skill.user_count} people available</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setSelectedSkill(null)}
        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        ← Back to all skills
      </button>
      
      <h2 className="text-xl font-bold text-gray-900">{selectedSkill.name}</h2>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found with this skill.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {user.photo_url ? (
                      <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src={user.photo_url} 
                        alt={user.name} 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    {user.location && (
                      <p className="flex items-center text-sm text-gray-500">
                        <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                        {user.location}
                      </p>
                    )}
                    {user.availability && (
                      <p className="flex items-center text-sm text-gray-500 mt-1">
                        <FaClock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-gray-400" />
                        {user.availability}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => onInitiateBarter(user)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaExchangeAlt className="mr-1.5 h-3.5 w-3.5" />
                      Barter
                    </button>
                  </div>
                </div>
                
                {user.offered_skills && user.offered_skills.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Offers</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {user.offered_skills.map((skill) => (
                        <span 
                          key={skill.id} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user.requested_skills && user.requested_skills.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Looking For</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {user.requested_skills.map((skill) => (
                        <span 
                          key={skill.id} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsBrowser;
