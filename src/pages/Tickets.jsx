import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../helper/getProfile';
import Sidebar from '../components/Sidebar';
import SkeletonTickets from '../components/SkeletonTickets';
import TicketsList from '../components/TicketsList';
import { Link } from "react-router-dom";

const Tickets = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [activeStatus, setActiveStatus] = useState('Open');
  const [loading, setLoading] = useState(true);

  const fetchTickets = async (deskAccountId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/getTickets?accountId=${deskAccountId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': import.meta.env.VITE_TOKEN_API,
        },
      });

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
    const fetchAllData = async () => {
      if (!user?.id) return;

      try {
        const profile = await getProfile(user.id);
        setProfileData(profile);

        if (profile?.desk_account_id) {
          await fetchTickets(profile.desk_account_id);
        }
      } catch (err) {
        console.error('Error fetching profile or tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user?.id]);

  const groupedTickets = tickets.reduce((acc, ticket) => {
    const status = ticket.statusType;
    acc[status] = acc[status] || [];
    acc[status].push(ticket);
    return acc;
  }, {});

  const statusTypes = ['Open', 'Closed', 'All'];

  const filteredTickets = activeStatus === 'All' ? tickets : groupedTickets[activeStatus] || [];

  return (
    <div className="flex bg-gray-100">
      <Sidebar />

      <div className="ml-64 flex-1 min-h-screen p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
          <Link to="/create-ticket">
            <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm">
              New Ticket
            </button>
          </Link>
        </div>

        {loading ? (
          <SkeletonTickets />
        ) : (
          <>
            <div className="flex flex-wrap gap-3 items-center">
              {statusTypes.map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={`px-4 py-1.5 rounded text-sm font-medium border transition ${
                    activeStatus === status
                      ? status === 'All'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : `${status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} border-transparent`
                      : 'cursor-pointer bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {status} ({status === 'All' ? tickets.length : groupedTickets[status]?.length || 0})
                </button>
              ))}
            </div>

            {filteredTickets.length > 0 ? (
              <TicketsList tickets={filteredTickets} />
            ) : (
              <p className="text-gray-600 mt-4">No tickets found for this category.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tickets;
