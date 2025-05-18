import React from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      navigate("/login");
    }
  };

  if (!user) return <p>loading user...</p>;

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      <p>ID USER: {user.id}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Dashboard;
