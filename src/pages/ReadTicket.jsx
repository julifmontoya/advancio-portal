import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const ReadTicketWithComments = () => {
  const { id } = useParams();
  const location = useLocation();

  const initialTicket = location.state?.ticket || null;
  const [ticket, setTicket] = useState(initialTicket);
  const [ticketLoading, setTicketLoading] = useState(!initialTicket);
  const [ticketError, setTicketError] = useState(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);
  const [commentError, setCommentError] = useState(null);

  // Fetch ticket if not initially passed
  useEffect(() => {
    if (ticket) return;

    const fetchTicket = async () => {
      setTicketLoading(true);
      setTicketError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getTicket?ticketId=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            token: import.meta.env.VITE_TOKEN_API,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setTicket(data[0]);
        } else {
          throw new Error('No ticket found.');
        }
      } catch (err) {
        setTicketError(err.message);
      } finally {
        setTicketLoading(false);
      }
    };

    fetchTicket();
  }, [id, ticket]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/getComments?ticketId=${id}`, {
          headers: {
            'Content-Type': 'application/json',
            token: import.meta.env.VITE_TOKEN_API,
          },
        });

        if (!res.ok) throw new Error('Failed to load comments');

        const data = await res.json();

        const sortedComments = (data[0]?.data || []).sort(
          (a, b) => new Date(b.commentedTime) - new Date(a.commentedTime)
        );

        setComments(sortedComments);
      } catch (err) {
        setCommentsError(err.message);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  // Post comment handler
  const handlePostComment = async () => {
    const trimmed = commentText.trim();

    if (trimmed.length < 10) {
      setCommentError('Comment must be at least 10 characters.');
      return;
    }

    setCommentError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/insertComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: import.meta.env.VITE_TOKEN_API,
        },
        body: JSON.stringify({
          zoho_ticket_id: id,
          isPublic: "true",
          content: trimmed,
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      const response = await res.json();
      const newComment = response[0]?.comment;

      if (!newComment) throw new Error('Invalid comment response');

      setComments((prev) =>
        [newComment, ...prev].sort((a, b) => new Date(b.commentedTime) - new Date(a.commentedTime))
      );
      setCommentText('');
    } catch (err) {
      alert(err.message || 'Could not post comment');
    }
  };

  const statusColors = {
    Open: 'bg-green-100 text-green-800',
    Closed: 'bg-red-100 text-red-800',
  };

  // Format relative time for comments
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const diff = (new Date() - date) / 1000;

    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diff < 60) return formatter.format(-Math.floor(diff), 'second');
    if (diff < 3600) return formatter.format(-Math.floor(diff / 60), 'minute');
    if (diff < 86400) return formatter.format(-Math.floor(diff / 3600), 'hour');
    return formatter.format(-Math.floor(diff / 86400), 'day');
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar />
      <div className="ml-64 flex-1 min-h-screen p-6 overflow-y-auto">
        <h1 className="mb-6 text-2xl font-bold">Ticket Details</h1>

        {ticketLoading ? (
          <p>Loading ticket...</p>
        ) : ticketError ? (
          <div className="text-red-500 bg-white p-4 rounded shadow">
            Error: {ticketError}
          </div>
        ) : ticket ? (
          <div className="bg-white p-4 rounded shadow">
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
                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                    statusColors[ticket.statusType] || 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {ticket.statusType}
                </span>
              </p>
              <p>Priority: {ticket.priority}</p>
              <p>Created: {new Date(ticket.createdTime).toLocaleString()}</p>
              <p>dueDate: {new Date(ticket.dueDate).toLocaleString()}</p>
            </div>
            <p className="mt-2 whitespace-pre-line">{ticket.description}</p>
          </div>
        ) : null}

        {/* Comments */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded mb-2"
            rows={3}
          />
          {commentError && <p className="text-red-500 mb-2">{commentError}</p>}
          <button
            onClick={handlePostComment}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Comment
          </button>

          {commentsLoading ? (
            <p className="mt-4">Loading comments...</p>
          ) : commentsError ? (
            <p className="mt-4 text-red-500">Error: {commentsError}</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 mt-4">No comments yet.</p>
          ) : (
            <ul className="space-y-4 mt-4 mb-6">
              {comments.map((comment) => (
                <li key={comment.id} className="bg-white p-4 rounded shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <div>
                      <p className="font-semibold">{comment.commenter?.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{formatRelativeTime(comment.commentedTime)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-line">{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadTicketWithComments;
