import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../api/profile';
import { FaUserCircle, FaBriefcase, FaLightbulb, FaMapMarkerAlt, FaClock, FaCamera, FaUpload, FaLink } from 'react-icons/fa';

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
    const [activeTab, setActiveTab] = useState('link'); // 'link' or 'upload'
    const [photoPreview, setPhotoPreview] = useState('');
    const navigate = useNavigate();
    const fileInputRef = React.useRef();

    const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64 with specified quality
                    const base64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(base64);
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB');
            return;
        }

        try {
            const compressedImage = await compressImage(file);
            setPhotoPreview(compressedImage);
            setFormData(prev => ({ ...prev, photo_url: compressedImage }));
            setError('');
        } catch (error) {
            console.error('Error processing image:', error);
            setError('Failed to process image. Please try another one.');
        }
    };

    const handlePhotoUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, photo_url: url }));
        if (url) {
            setPhotoPreview(url);
        }
    };

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
                        <div className="mx-auto relative group mb-6">
                            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                                {photoPreview ? (
                                    <img 
                                        src={photoPreview} 
                                        alt="Profile preview" 
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            setPhotoPreview('');
                                        }}
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                        <FaUserCircle className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 shadow-lg transform transition-transform hover:scale-110 focus:outline-none"
                                title="Upload photo"
                            >
                                <FaCamera className="h-4 w-4" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
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
                            <div className="space-y-2">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('link')}
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'link' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FaLink className="inline mr-1" /> Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('upload')}
                                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <FaUpload className="inline mr-1" /> Upload
                                    </button>
                                </div>
                                
                                {activeTab === 'link' ? (
                                    <InputField 
                                        id="photo_url" 
                                        name="photo_url" 
                                        value={formData.photo_url} 
                                        onChange={(e) => {
                                            handleChange(e);
                                            handlePhotoUrlChange(e);
                                        }}
                                        placeholder="Paste your profile photo URL" 
                                        icon={FaLink} 
                                    />
                                ) : (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FaUpload className="w-8 h-8 mb-2 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                />
                                            </label>
                                        </div>
                                        {photoPreview && (
                                            <p className="mt-2 text-sm text-green-600 text-center">
                                                Image selected! Click the camera icon to change.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
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