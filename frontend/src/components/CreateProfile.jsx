import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../api/profile';
import { FaUserCircle, FaBriefcase, FaLightbulb, FaMapMarkerAlt, FaClock, FaCamera } from 'react-icons/fa';

const CreateProfile = () => {
    const [formData, setFormData] = useState({
        bio: '',
        photo_url: '',
        availability: '',
        location: '',
        offered_skills: '',
        required_skills: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token ? 'Token exists' : 'No token');
            
            if (!token) {
                setError('Authentication token not found. Please log in again.');
                navigate('/login');
                return;
            }

            const profileData = {
                ...formData,
                offered_skills: formData.offered_skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
                required_skills: formData.required_skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
            };

            console.log('Sending profile data:', profileData);
            
            const response = await updateProfile(profileData, token);
            console.log('Profile update response:', response);
            
            navigate('/dashboard');
        } catch (err) {
            console.error('Profile creation error:', err);
            
            if (err.response) {
                // Server responded with error status
                if (err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                    // Clear the invalid token
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                } else if (err.response.status === 400) {
                    setError(err.response.data.message || 'Invalid data provided. Please check your inputs.');
                } else {
                    setError(err.response.data.message || 'Failed to create profile. Please try again.');
                }
            } else if (err.request) {
                // Network error
                setError('Network error. Please check your connection and try again.');
            } else {
                // Other error
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const InputField = ({ id, name, value, onChange, placeholder, icon: Icon }) => (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
            </div>
            <input
                type="text"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-white focus:bg-white"
            />
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all duration-300 hover:shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                            <FaUserCircle className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Tell Us About Yourself
                        </h1>
                        <p className="text-gray-600 mt-2">Create your profile to start sharing your skills and discovering new ones.</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                id="photo_url" 
                                name="photo_url" 
                                value={formData.photo_url} 
                                onChange={handleChange} 
                                placeholder="Link to your profile photo" 
                                icon={FaCamera} 
                            />
                            <InputField 
                                id="location" 
                                name="location" 
                                value={formData.location} 
                                onChange={handleChange} 
                                placeholder="Your location (e.g., City, Country)" 
                                icon={FaMapMarkerAlt} 
                            />
                            <InputField 
                                id="availability" 
                                name="availability" 
                                value={formData.availability} 
                                onChange={handleChange} 
                                placeholder="Your availability (e.g., Weekends)" 
                                icon={FaClock} 
                            />
                        </div>

                        <div>
                            <div className="relative group">
                                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaBriefcase className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                                </div>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Share a bit about yourself, your interests, and what you're passionate about."
                                    rows="4"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:bg-white focus:bg-white"
                                ></textarea>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <InputField 
                                id="offered_skills" 
                                name="offered_skills" 
                                value={formData.offered_skills} 
                                onChange={handleChange} 
                                placeholder="Skills you can offer (comma separated: Python, Guitar, Cooking)" 
                                icon={FaLightbulb} 
                            />
                            <InputField 
                                id="required_skills" 
                                name="required_skills" 
                                value={formData.required_skills} 
                                onChange={handleChange} 
                                placeholder="Skills you want to learn (comma separated: Public Speaking, Photography)" 
                                icon={FaLightbulb} 
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Creating Profile...' : 'Save and Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProfile;