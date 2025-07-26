import { useState, useEffect } from 'react';
import { getMatches } from '../api/matching';

const useMatches = (token) => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (token) {
      getMatches(token)
        .then(response => setMatches(response.data))
        .catch(error => console.error('Error fetching matches:', error));
    }
  }, [token]);

  return { matches };
};

export default useMatches;
