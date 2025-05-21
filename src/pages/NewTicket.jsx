import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../helper/getProfile';

export default function NewTicket() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (!user?.id) return;

        getProfile(user.id)
            .then(data => setProfileData(data))
            .catch(err => console.error('Error fetching profile:', err));
    }, [user?.id]);


    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Create a New Ticket</h2>
            <p className="text-gray-700 mb-2">
                Logged in as: <span className="font-medium">{user?.email || 'Unknown user'}</span>
            </p>

            {/* You can add your form fields for the ticket here */}
            <h2>Welcome, {profileData?.desk_contact_id}</h2>

        </div>
    );
}