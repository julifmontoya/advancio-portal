import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../helper/getProfile';
import Sidebar from '../components/Sidebar';
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeStatus, setActiveStatus] = useState('Open');


  const fetchTickets = async (deskAccountId) => {
    try {
      const response = await fetch(
        `https://n8n.advancio.io/webhook-test/crmv1/getTickets?accountId=${deskAccountId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_TOKEN_API,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Tickets API error ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      const ticketData = await response.json();
      const ticketList = Array.isArray(ticketData) ? ticketData[0]?.data || [] : [];
      setTickets(ticketList);
    } catch (error) {
      console.error('Error fetching tickets:', error.message);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    getProfile(user.id)
      .then(data => setProfileData(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, [user?.id]);

  useEffect(() => {
    if (profileData?.desk_account_id) {
      fetchTickets(profileData.desk_account_id);
    }
  }, [profileData?.desk_account_id]);

  const groupedTickets = tickets.reduce(
    (acc, ticket) => {
      const status = ticket.statusType;
      acc[status] = acc[status] || [];
      acc[status].push(ticket);
      return acc;
    },
    {}
  );

  const statusTypes = ['Open', 'Closed', 'All'];
  const statusColors = {
    Open: 'bg-green-100 text-green-800',
    Closed: 'bg-red-100 text-red-800',
  };

  const filteredTickets =
    activeStatus === 'All'
      ? tickets
      : groupedTickets[activeStatus] || [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Link to="/new-ticket">
            <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm">
              New Ticket
            </button>
          </Link>
        </div>

        {/* Status Filters */}
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 items-center">
            {statusTypes.map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status)}
                className={`px-4 py-1.5 rounded text-sm font-medium border transition ${activeStatus === status
                  ? `${status === 'All'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : statusColors[status]
                  } border-transparent`
                  : 'cursor-pointer bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
              >
                {status} ({status === 'All' ? tickets.length : groupedTickets[status]?.length || 0})
              </button>
            ))}
          </div>

          {/* Ticket List */}
          {filteredTickets.length > 0 ? (
            <ul className="space-y-4">
              {filteredTickets.map((ticket, index) => (
                <li
                  key={ticket.id || index}
                  className="p-4 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition"
                >
                  <a
                    href={ticket.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    #{ticket.ticketNumber} - {ticket.subject}
                  </a>
                  <div className="text-sm text-gray-600 mt-1">
                    <p>
                      Status:{' '}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusColors[ticket.statusType] || 'bg-gray-200 text-gray-800'
                          }`}
                      >
                        {ticket.statusType}
                      </span>
                    </p>
                    <p>Priority: {ticket.priority}</p>
                    <p>Created: {new Date(ticket.createdTime).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No tickets found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
