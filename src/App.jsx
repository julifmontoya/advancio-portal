import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './context/AuthContext';

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard.jsx";
import Tickets from "./pages/Tickets.jsx";
import NewTicket from "./pages/NewTicket";
import ReadTicket from "./pages/ReadTicket";
import Profile from "./pages/Profile";
import NotFound from './pages/NotFound';
import Wrapper from "./pages/Wrapper";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<Wrapper><Tickets /></Wrapper>} />
          <Route path="/ticket/:id" element={<Wrapper><ReadTicket /></Wrapper>} />
          <Route path="/create-ticket" element={<Wrapper><NewTicket /></Wrapper>} />
          <Route path="/profile" element={<Wrapper><Profile /></Wrapper>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App