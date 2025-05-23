import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../helper/getProfile';
import Sidebar from '../components/Sidebar';

export default function NewTicket() {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [values, setValues] = useState({
        subject: '',
        description: '',
        priority: 'medium',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const descriptionRef = useRef(null);

    useEffect(() => {
        if (!user?.id) return;

        getProfile(user.id)
            .then(data => setProfileData(data))
            .catch(err => console.error('Error fetching profile:', err));
    }, [user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setValues(prev => ({ ...prev, [name]: value }));

        // Clear error for the field as user types
        setErrors(prev => ({ ...prev, [name]: '' }));

        if (name === 'description' && descriptionRef.current) {
            descriptionRef.current.style.height = 'auto';
            descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
        }
    };

    const handleCancel = () => {
        navigate('/tickets');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        let tempErrors = {};

        if (values.subject.trim().length < 3) {
            tempErrors.subject = 'Subject must be at least 3 characters.';
        }

        if (values.description.trim().length < 10) {
            tempErrors.description = 'Description must be at least 10 characters.';
        }

        if (!profileData?.desk_contact_id) {
            tempErrors.profile = 'Profile data not loaded. Please try again.';
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            return;
        }

        setSubmitting(true);

        const ticketData = {
            subject: values.subject,
            departmentId: "481653000002618165",
            contactId: profileData.desk_contact_id,
            description: values.description,
            priority: values.priority,
            channel: "Web"
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/createTicket`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'token': import.meta.env.VITE_TOKEN_API,
                },
                body: JSON.stringify(ticketData)
            });

            if (!response.ok) {
                throw new Error('Failed to create ticket');
            }

            navigate('/tickets');
        } catch (error) {
            console.error('Error submitting ticket:', error);
            setErrors({ submit: 'There was a problem creating the ticket. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex bg-gray-100">
            <Sidebar />

            <div className="ml-64 flex-1 min-h-screen p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Create a New Ticket</h2>

                <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-10 rounded-xl shadow-md space-y-6">
                    <div>
                        <label className="block mb-1 font-semibold">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={values.subject}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.subject && <p className="text-red-600 mt-1 text-sm">{errors.subject}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Description</label>
                        <textarea
                            ref={descriptionRef}
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                            rows={1}
                            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]
                                ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.description && <p className="text-red-600 mt-1 text-sm">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Priority</label>
                        <select
                            name="priority"
                            value={values.priority}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>

                    {errors.profile && (
                        <p className="text-red-600 mb-2">{errors.profile}</p>
                    )}

                    {errors.submit && (
                        <p className="text-red-600 mb-2">{errors.submit}</p>
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
            </div>
        </div>
    );
}
