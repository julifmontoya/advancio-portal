import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const validateWithZoho = async (email) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getContactByEmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: import.meta.env.VITE_TOKEN_API,
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Zoho validation error:", error);
      return {
        success: false,
        message: "Error validating email. Please try again later.",
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // Step 1: Check if user exists in Zoho Desk
    const zohoResult = await validateWithZoho(email);
    if (!zohoResult.success) {
      setMessage(zohoResult.message);
      return;
    }

    // Step 2: Proceed with Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data) {
      setMessage("User account created!");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <br />
      {message && <span>{message}</span>}
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Create Account</button>
      </form>
      <span>Already have an account? </span>
      <Link to="/login">Log in.</Link>
    </div>
  );
}

export default Register;
