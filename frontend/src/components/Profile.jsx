import React, { useState, useEffect } from 'react';
import { getProfile } from '../api/profile';

const Profile = () => {
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
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found, please log in.');
                    setLoading(false);
                    return;
                }
                const response = await getProfile(token);
                setProfile(response.data);
            } catch (err) {
                setError('Failed to fetch profile. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
                                                {skill.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills listed</p>
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
                                                {skill.trim()}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No skills listed</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Availability
                                </h2>
                                <p className="text-gray-600">
                                    {profile.availability || 'Not specified'}
                                </p>
                            </div>
                            
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Location
                                </h2>
                                <p className="text-gray-600">
                                    {profile.location || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
