import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Wrapper = ({ children }) => {
  const { user } = useAuth();

  if (user === null) return <Navigate to="/login" />;

  return children;
};

export default Wrapper;
