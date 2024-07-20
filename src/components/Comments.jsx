import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendServer } from '../utils/info';
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
import { FaUserCircle } from 'react-icons/fa';

const Comments = ({ id }) => {
    const loggedInUser = localStorage.getItem('name');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState([]);
    const [newComment, setNewComment] = useState({
        projectId: id, userName: loggedInUser, body: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComment(prevComment => ({
            ...prevComment,
            [name]: value
        }));
    };

    const resetForm = () => {
        setNewComment({ projectId: id, userName: loggedInUser, body: '' });
    }

    const fetchAllComments = async () => {
        const response = await axios.get(`${backendServer}/api/getComments/${id}`);
        setComment(response.data);
    }

    useEffect(() => {
        fetchAllComments()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${backendServer}/api/newComment`, newComment);
            setLoading(false);
            toast.success(response.data.message);
            fetchAllComments();
            resetForm();
        } catch (error) {
            setLoading(false);
            setError(error.message);
            toast.error(error.message);
            resetForm();
        }
    }

    console.log(comment);

    if (loading) return (
        <div className='w-full flex items-center justify-center p-4'>
            <CircularProgress />
        </div>
    );

    if (error) return (
        <div className="w-full flex items-center justify-center text-red-600 font-medium p-4">
            Error: {error}
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center justify-start p-4 gap-3">
            <div className="w-full flex items-center justify-start text-gray-900 text-2xl font-medium">
                Comments
            </div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <div className="w-full flex flex-col items-center justify-start">
                <div className="w-full flex flex-col items-center justify-start">
                    {
                        comment.length === 0 ?
                            <div className="w-full items-center justify-start">No comment yet!</div>
                            :
                            comment.map(comment => {
                                return (
                                    <div className="w-full flex flex-col items-center bg-[#F8F9FD] gap-1">
                                        <div className="w-full flex items-center justify-start p-2 text-base font-medium gap-2">
                                            <FaUserCircle className='text-xl' />
                                            <div>{comment.userName}</div>
                                            <div className='text-sm'>{comment.createdAt.split('T')[0]}</div>
                                        </div>
                                        <div className="w-full flex items-center justify-start p-2 bg-white">{comment.body}</div>
                                    </div>
                                )
                            })
                    }
                </div>
                <form onSubmit={handleSubmit} className="w-full flex items-start gap-6 mt-8">
                    <textarea value={newComment.body} onChange={handleInputChange}
                        className='w-full p-2 border border-solid border-gray-300 outline-none'
                        placeholder='Type here...'
                        name="body" id="" rows="2"></textarea>
                    <button onClick={handleSubmit}
                        type="button" className='w-fit bg-[#7F55DE] p-2 px-3 text-white text-base font-medium rounded-lg'>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Comments;
