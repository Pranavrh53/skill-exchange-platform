import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../api/profile';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        bio: '',
        photo_url: '',
        offered_skills: [],
        required_skills: [],
        availability: '',
        location: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in to view profiles.');
                    setLoading(false);
                    return;
                }
                const response = await getUserProfile(userId, token);
                setProfile(response.data);
            } catch (err) {
                setError('Failed to fetch user profile. The user may not exist or you may not have permission.');
                console.error('Error fetching user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    const handleStartBarter = () => {
        // Navigate to a page where users can start a barter session
        navigate(`/barter/new?with=${userId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p>{error}</p>
                <button 
                    onClick={() => navigate(-1)}
                    className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-center">
                        {profile.photo_url ? (
                            <img 
                                src={profile.photo_url} 
                                alt={profile.name}
                                className="mx-auto h-32 w-32 rounded-full border-4 border-white shadow-lg"
                            />
                        ) : (
                            <div className="mx-auto h-32 w-32 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl text-white font-bold">
                                {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <h1 className="mt-4 text-3xl font-bold text-white">{profile.name || 'User'}</h1>
                        <p className="text-purple-100">{profile.email || ''}</p>
                        <button
                            onClick={handleStartBarter}
                            className="mt-4 px-6 py-2 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors"
                        >
                            Start Barter
                        </button>
                    </div>

                    {/* Profile Details */}
                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                About Me
                            </h2>
                            <p className="text-gray-600 whitespace-pre-line">
                                {profile.bio || 'No bio available'}
                            </p>
                            {profile.location && (
                                <div className="mt-2 flex items-center text-gray-600">
                                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {profile.location}
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Skills I Offer
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.offered_skills && profile.offered_skills.length > 0 ? (
                                        profile.offered_skills.map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                                            >
                                                {typeof skill === 'object' ? skill.name : skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills offered yet</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Skills I'm Looking For
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.required_skills && profile.required_skills.length > 0 ? (
                                        profile.required_skills.map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                            >
                                                {typeof skill === 'object' ? skill.name : skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills requested yet</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {profile.availability && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Availability
                                </h2>
                                <p className="text-gray-600">{profile.availability}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        ← Back to List
                    </button>
                    <button
                        onClick={handleStartBarter}
                        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 transition-colors"
                    >
                        Start Barter Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
