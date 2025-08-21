// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api/profile';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value.split(',').map(skill => skill.trim()) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await updateProfile(profile, token);
            alert('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Your Profile</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} disabled />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} disabled />
                </div>
                <div>
                    <label>Bio:</label>
                    <textarea name="bio" value={profile.bio || ''} onChange={handleChange}></textarea>
                </div>
                <div>
                    <label>Photo URL:</label>
                    <input type="text" name="photo_url" value={profile.photo_url || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Offered Skills (comma-separated):</label>
                    <input type="text" name="offered_skills" value={profile.offered_skills.join(', ')} onChange={handleSkillsChange} />
                </div>
                <div>
                    <label>Required Skills (comma-separated):</label>
                    <input type="text" name="required_skills" value={profile.required_skills.join(', ')} onChange={handleSkillsChange} />
                </div>
                <div>
                    <label>Availability:</label>
                    <input type="text" name="availability" value={profile.availability || ''} onChange={handleChange} />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={profile.location || ''} onChange={handleChange} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
