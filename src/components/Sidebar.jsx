import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../helper/supabaseClient';

const Sidebar = () => {
    const navigate = useNavigate();

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        } else {
            navigate("/login");
        }
    };

    return (
        <aside className="w-64 h-screen bg-gray-800 text-white p-6 flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Support Portal</h2>
            <nav className="flex flex-col gap-3">
                <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded">Dashboard</Link>
                <p
                    onClick={signOut}
                    className="cursor-pointer hover:bg-red-600 px-3 py-2 rounded transition-colors duration-200"
                >
                    Sign Out
                </p>
            </nav>
        </aside>
    );
};

export default Sidebar;
