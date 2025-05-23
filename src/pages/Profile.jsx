import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { getProfile } from '../helper/getProfile';
import { getSessionToken } from '../helper/getSessionToken';

export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        company: '',
        phone: ''
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;

            try {
                const data = await getProfile(user.id);
                if (data) {
                    setProfile({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        company: data.company || '',
                        phone: data.phone || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setMessage({ type: 'error', text: 'Failed to load profile.' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const accessToken = await getSessionToken();
            if (!accessToken) throw new Error('No access token available');

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    ...profile,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <div className="ml-64 flex-1 min-h-screen p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Profile</h2>
                {loading ? (
                    <p>Loading profile...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-10 rounded-xl shadow-md space-y-6">

                        <div className="space-y-2">
                            <label className="block font-medium">First Name</label>
                            <input
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">Last Name</label>
                            <input
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">Company</label>
                            <input
                                name="company"
                                value={profile.company}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block font-medium">Phone</label>
                            <input
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded"
                            />
                        </div>

                        {message && (
                            <div
                                className={`text-sm font-medium px-4 py-2 rounded ${message.type === 'success'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-red-100 text-red-700 border border-red-300'
                                    }`}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="cursor-pointer px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="cursor-pointer px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
