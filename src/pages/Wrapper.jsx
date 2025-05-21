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

import React, { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import { Navigate } from "react-router-dom";

function Wrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setLoading(false);
    };

    getSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    if (authenticated) {
      return <>{children}</>;
    }
    return <Navigate to="/login" />;
  }
}

export default Wrapper;
