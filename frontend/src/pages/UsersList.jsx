import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../api/users';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Please log in to view users.');
                    setLoading(false);
                    return;
                }
                const response = await getAllUsers(token);
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users. Please try again later.');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.bio && user.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    );

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
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Skill Exchange Members</h1>
                    <p className="text-gray-600">Connect with other members to exchange skills and knowledge</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Search by name or bio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div key={user.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-center">
                                        {user.photo_url ? (
                                            <img 
                                                className="h-16 w-16 rounded-full object-cover" 
                                                src={user.photo_url} 
                                                alt={user.name} 
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-600">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="ml-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                <Link 
                                                    to={`/users/${user.id}`}
                                                    className="hover:text-purple-600 hover:underline"
                                                >
                                                    {user.name}
                                                </Link>
                                            </h3>
                                            {user.location && (
                                                <p className="text-sm text-gray-500 flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {user.location}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {user.bio && (
                                        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                            {user.bio}
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-1">Offers:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {user.offered_skills && user.offered_skills.length > 0 ? (
                                                user.offered_skills.slice(0, 3).map((skill, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                                    >
                                                        {typeof skill === 'object' ? skill.name : skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">No skills listed</span>
                                            )}
                                            {user.offered_skills && user.offered_skills.length > 3 && (
                                                <span className="text-xs text-gray-500">+{user.offered_skills.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="text-sm font-medium text-gray-900 mb-1">Seeks:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {user.required_skills && user.required_skills.length > 0 ? (
                                                user.required_skills.slice(0, 3).map((skill, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {typeof skill === 'object' ? skill.name : skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-500">No skills requested</span>
                                            )}
                                            {user.required_skills && user.required_skills.length > 3 && (
                                                <span className="text-xs text-gray-500">+{user.required_skills.length - 3} more</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <Link
                                            to={`/users/${user.id}`}
                                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search or filter to find what you\'re looking for.' 
                                : 'There are currently no users to display.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UsersList;
