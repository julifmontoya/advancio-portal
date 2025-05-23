import { Link, useNavigate } from "react-router-dom";

const statusColors = {
    Open: 'bg-green-100 text-green-800',
    Closed: 'bg-red-100 text-red-800',
};

const TicketsList = ({ tickets }) => {
    const navigate = useNavigate();

    const handleTicketClick = (ticket) => {
        navigate(`/ticket/${ticket.id}`, { state: { ticket } });
    };

    return (
        <ul className="space-y-4 mt-4">
            {tickets.map((ticket, index) => (
                <li
                    key={ticket.id || index}
                    className="p-4 bg-white rounded shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleTicketClick(ticket)}
                >
                    {/* Main header line with title, status, and priority */}
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                        <a
                            className="text-blue-600 hover:underline font-semibold text-lg leading-tight"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTicketClick(ticket);
                            }}
                        >
                            {ticket.subject}
                        </a>

                        {/* Status Badge */}
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${statusColors[ticket.statusType] || 'bg-gray-200 text-gray-800'}`}
                        >{ticket.statusType}</span>

                        <span className="text-sm text-gray-600">Priority: {ticket.priority}</span>
                    </div>

                    {/* Separate div for other details */}
                    <div className="text-sm text-gray-600 space-y-1"> {/* Using space-y for vertical spacing */}
                        <p>Created: {new Date(ticket.createdTime).toLocaleString()}</p>
                        <p>DueDate: {new Date(ticket.dueDate).toLocaleString()}</p>
                        <p>Modified: {new Date(ticket.modifiedTime).toLocaleString()}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TicketsList;