import React from 'react';
import { initiateBarter } from '../api/matches';

const MatchCard = ({ match, onInitiateBarter }) => {
  const handleInitiateBarter = async (offeredSkillId, requestedSkillId) => {
    try {
      await onInitiateBarter({
        provider_id: match.user.id,
        offered_skill_id: offeredSkillId,
        requested_skill_id: requestedSkillId
      });
      alert('Barter session initiated successfully!');
    } catch (error) {
      console.error('Failed to initiate barter:', error);
      alert('Failed to initiate barter. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={match.user.photo_url || 'https://via.placeholder.com/150'} 
            alt={match.user.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{match.user.name}</h3>
            <p className="text-sm text-gray-500">Location: {match.user.location || 'Not specified'}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">They offer:</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {match.offered_skills.map(skill => (
              <span key={skill.id} className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">They're looking for:</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {match.requested_skills.map(skill => (
              <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Initiate Barter:</h4>
          <div className="space-y-2">
            {match.possible_exchanges.map((exchange, idx) => (
              <button
                key={idx}
                onClick={() => handleInitiateBarter(exchange.offered_skill_id, exchange.requested_skill_id)}
                className="w-full flex justify-between items-center px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700"
              >
                <span>I'll give: <span className="text-green-600">{exchange.offered_skill_name}</span></span>
                <span className="mx-2">↔</span>
                <span>I'll get: <span className="text-blue-600">{exchange.requested_skill_name}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
