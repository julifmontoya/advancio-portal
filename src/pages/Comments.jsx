import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Comments = () => {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/getComments?ticketId=${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': import.meta.env.VITE_TOKEN_API,
                    },
                });

                if (!res.ok) throw new Error('Failed to load comments');

                const data = await res.json();
                setComments(data[0]?.data || []);
            } catch (err) {
                setError(err.message || 'Error fetching comments');
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [id]);

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
                    'token': import.meta.env.VITE_TOKEN_API,
                },
                body: JSON.stringify({
                    zoho_ticket_id: id,
                    isPublic: "true",
                    content: trimmed,
                }),
            });

            if (!res.ok) throw new Error('Failed to post comment');

            const newCommentResponse = await res.json();
            const newComment = newCommentResponse[0]?.comment;

            if (!newComment) throw new Error('Invalid comment response');

            setComments((prev) => [...prev, newComment]);
            setCommentText('');
        } catch (err) {
            setCommentError(err.message || 'Could not post comment');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Comments for Ticket #{id}</h1>

                {loading ? (
                    <p>Loading comments...</p>
                ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                ) : (
                    <>
                        {comments.length === 0 ? (
                            <p className="text-gray-500">No comments yet.</p>
                        ) : (
                            <ul className="space-y-4 mb-6">
                                {comments.map((comment) => (
                                    <li
                                        key={comment.id}
                                        className="bg-white p-4 rounded shadow-sm border"
                                    >
                                        <div className="flex items-start gap-3 mb-2">
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {comment.commenter?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(comment.commentedTime).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-800">{comment.content}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 border rounded mb-2"
                            rows={3}
                        />
                        {commentError && (
                            <p className="text-red-600 text-sm mb-2">{commentError}</p>
                        )}
                        <button
                            onClick={handlePostComment}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Post Comment
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Comments;
