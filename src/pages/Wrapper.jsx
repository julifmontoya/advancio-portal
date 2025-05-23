/* import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Wrapper = ({ children }) => {
  const { user } = useAuth();

  if (user === null) return <Navigate to="/login" />;

  return children;
};

export default Wrapper;
 */

import { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Navigate } from "react-router-dom";

function Wrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(null); // null = unknown

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(!!session);
    };

    checkSession();
  }, []);

  if (authenticated === null) {
    return null; // show nothing while checking
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default Wrapper;
