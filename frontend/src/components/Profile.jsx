import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/profile';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    bio: '',
    photo_url: '',
    availability: '',
    location: ''
  });
  const [offeredSkills, setOfferedSkills] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          console.log('No token or userId found, redirecting to login');
          navigate('/login');
          return;
        }
        
        console.log('Fetching profile with token:', token);
        const response = await getProfile(userId, token);
        console.log('Profile response:', response);
        
        if (response.data) {
          setProfile({
            bio: response.data.bio || '',
            photo: response.data.photo || '',
            offered_skills: response.data.offered_skills || [],
            required_skills: response.data.required_skills || [],
            availability: response.data.availability || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
          if (error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

    const onChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e, type) => {
    const value = e.target.value;
    if (type === 'offered') {
      setOfferedSkills(value);
    } else {
      setRequiredSkills(value);
    }
  };

  const formatSkills = (skillsString) => {
    return skillsString.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .map(skill => ({
        name: skill,
        id: skill.toLowerCase().replace(/\s+/g, '-')
      }));
  };

  const onFileChange = e => {
    // For now, we'll just log the file. Full upload logic will be next.
    console.log(e.target.files[0]);
    // In a real app, you would upload the file and set the photo URL in the state
    // For demonstration, we'll use a placeholder URL
    setProfile({ ...profile, photo: URL.createObjectURL(e.target.files[0]) });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        alert('You must be logged in to update your profile.');
        return;
      }
      
      // Prepare the profile data according to the database schema
      const profileData = {
        ...profile,
        offered_skills: formatSkills(offeredSkills),
        required_skills: formatSkills(requiredSkills)
      };
      
      console.log('Updating profile with data:', profileData);
      const response = await updateProfile(userId, profileData, token);
      console.log('Update response:', response);
      
      if (response && response.status === 200) {
        alert('Profile updated successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        alert(`Failed to update profile: ${error.response.data?.message || error.message}`);
      } else {
        alert(`Failed to update profile: ${error.message}`);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center"><p className="text-lg text-gray-600">Loading Profile...</p></div>
        ) : (
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Create Your Profile
            </h1>
            <p className="text-gray-600 mt-3 text-lg">Let others know who you are and what skills you have to offer.</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Photo Upload */}
            <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="shrink-0">
                <img className="h-24 w-24 object-cover rounded-full shadow-md" src={profile.photo_url || 'https://via.placeholder.com/150'} alt="Profile" />
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input 
                  type="file" 
                  onChange={onFileChange} 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <input
                  type="text"
                  name="photo_url"
                  value={profile.photo_url || ''}
                  onChange={onChange}
                  placeholder="Or enter image URL"
                  className="mt-2 w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </label>
            </div>

            {/* Bio Section */}
            <div>
              <label htmlFor="bio" className="block text-lg font-medium text-gray-800 mb-2">Bio & Educational Details</label>
              <textarea id="bio" name="bio" value={profile.bio} onChange={onChange} rows="4" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400" placeholder="Tell us about yourself, your background, and your education..."></textarea>
            </div>

            {/* Skills Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="offered-skills" className="block text-lg font-medium text-gray-800 mb-2">Skills You Offer</label>
                <input 
                  type="text" 
                  id="offered-skills" 
                  value={offeredSkills} 
                  onChange={(e) => handleSkillsChange(e, 'offered')} 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  placeholder="e.g., React, Python, Graphic Design"
                />
                <p className="text-sm text-gray-500 mt-2">Separate skills with a comma.</p>
              </div>
              <div>
                <label htmlFor="required-skills" className="block text-lg font-medium text-gray-800 mb-2">Skills You Need</label>
                <input 
                  type="text" 
                  id="required-skills" 
                  value={requiredSkills} 
                  onChange={(e) => handleSkillsChange(e, 'required')} 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                  placeholder="e.g., SEO, Marketing, Public Speaking"
                />
                <p className="text-sm text-gray-500 mt-2">Separate skills with a comma.</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="location" className="block text-lg font-medium text-gray-800 mb-2">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                value={profile.location || ''} 
                onChange={onChange} 
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                placeholder="e.g., New York, NY"
              />
            </div>

            {/* Availability Section */}
            <div>
                <label htmlFor="availability" className="block text-lg font-medium text-gray-800 mb-2">Your Availability</label>
                <input type="text" id="availability" name="availability" value={profile.availability} onChange={onChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="e.g., Weekday evenings, flexible hours"/>
            </div>

            {/* Submit Button */}
            <div className="pt-5">
              <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
                Save Profile
              </button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
