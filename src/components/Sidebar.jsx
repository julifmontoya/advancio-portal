import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Asegúrate de importar Supabase si lo usas
// import supabase from '../supabaseClient'; 

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Comenta o elimina esto si no estás usando Supabase por ahora
    const signOut = async () => {
        // const { error } = await supabase.auth.signOut();
        // if (error) {
        //     console.error('Error signing out:', error.message);
        // } else {
        //     navigate("/login");
        // }
        console.log("Sign out attempted (Supabase not imported)");
        navigate("/login"); // Para que funcione sin Supabase
    };

    const linkClass = (path) =>
        `px-3 py-2 rounded transition-colors duration-200 ${location.pathname === path
            ? 'bg-gray-700'  // Active link style
            : 'hover:bg-gray-700' // Hover style for inactive links
        }`;

    return (
        // Asegúrate de que el aside tenga estas clases:
        <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-800 text-white p-6 flex flex-col gap-4 z-10"> 
            <h2 className="text-xl font-bold mb-4">Support Portal</h2>
            <nav className="flex flex-col gap-3">
                <Link to="/tickets" className={linkClass('/tickets')}>Tickets</Link>
                <Link to="/profile" className={linkClass('/profile')}>Profile</Link>
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