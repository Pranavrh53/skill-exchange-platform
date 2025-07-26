import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile } from '../api/profile';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    bio: '',
    photo: '',
    offered_skills: [],
    required_skills: [],
    availability: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await getProfile(token);
        const { data } = response;
        setProfile({
          bio: data.bio || '',
          photo: data.photo || '',
          offered_skills: data.offered_skills || [],
          required_skills: data.required_skills || [],
          availability: data.availability || ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

    const onChange = e => {
    const { name, value } = e.target;
    if (name === 'offered_skills' || name === 'required_skills') {
      setProfile({ ...profile, [name]: value.split(',').map(skill => skill.trim()) });
    } else {
      setProfile({ ...profile, [name]: value });
    }
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
      await updateProfile(profile, token);
      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
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
                <img className="h-24 w-24 object-cover rounded-full shadow-md" src={profile.photo || 'https://via.placeholder.com/150'} alt="Current profile photo" />
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input type="file" onChange={onFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
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
                <input type="text" id="offered-skills" name="offered_skills" value={Array.isArray(profile.offered_skills) ? profile.offered_skills.join(', ') : ''} onChange={onChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="e.g., React, Python, Graphic Design"/>
                <p className="text-sm text-gray-500 mt-2">Separate skills with a comma.</p>
              </div>
              <div>
                <label htmlFor="required-skills" className="block text-lg font-medium text-gray-800 mb-2">Skills You Need</label>
                <input type="text" id="required-skills" name="required_skills" value={Array.isArray(profile.required_skills) ? profile.required_skills.join(', ') : ''} onChange={onChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" placeholder="e.g., SEO, Marketing, Public Speaking"/>
                <p className="text-sm text-gray-500 mt-2">Separate skills with a comma.</p>
              </div>
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
