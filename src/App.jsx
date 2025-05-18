import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './context/AuthContext';

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* 👈 Aquí envuelves TODA la app */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Wrapper><Dashboard /></Wrapper>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App