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
      const crmData = Array.isArray(result) ? result[0] : result;
      const contactInfo = crmData.contact || crmData[0]?.contact;

      if (!contactInfo) throw new Error("No contact info found");

      return {
        success: true,
        contact: {
          firstName: contactInfo.First_Name !== "null" ? contactInfo.First_Name : "",
          lastName: contactInfo.Last_Name !== "null" ? contactInfo.Last_Name : "",
          company: contactInfo.Account_Name || "",
          phone: contactInfo.Phone || contactInfo.Mobile || null,
          crmContactId: contactInfo.CRM_id,
          deskContactId: contactInfo.Desk_id,
          crmAccountId: contactInfo.CRM_Account_id,
          deskAccountId: contactInfo.Desk_Account_id,
        },
      };
    } catch (error) {
      console.error("Zoho validation error:", error);
      return {
        success: false,
        message: "Email not registered as a contact with Advancio. Please contact your account manager",
      };
    }
  };

  const updateProfile = async (userId, contact) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_TOKEN_KEY}`,
        },
        body: JSON.stringify({
          id: userId,
          crm_contact_id: contact.crmContactId,
          desk_contact_id: contact.deskContactId,
          first_name: contact.firstName,
          last_name: contact.lastName,
          company: contact.company,
          phone: contact.phone,
          desk_account_id: contact.deskAccountId,
          crm_account_id: contact.crmAccountId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Error updating profile:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    // Step 1: Validate email with Zoho
    const zohoResult = await validateWithZoho(email);
    if (!zohoResult.success) {
      setMessage(zohoResult.message);
      return;
    }

    // Step 2: Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data?.user?.id) {
      // Step 3: If signup is successful, call your secure backend to update the profile
      await updateProfile(data.user.id, zohoResult.contact);
      setMessage("User account created!");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Create your account</h2>

        {message && (
          <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
