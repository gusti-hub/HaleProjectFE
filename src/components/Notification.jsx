import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { AiTwotoneNotification } from 'react-icons/ai';
import { backendServer } from '../utils/info';
import axios from 'axios';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Notification = () => {

    const [ntfs, setNtfs] = useState([]);
    const [ntfLoader, setNtfLoader] = useState(false);
    const [ntfError, setNtfError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const fetchNotifications = async () => {
        setNtfLoader(true);
        try {
            const response = await axios.get(`${backendServer}/api/getApproachingRFQsPOs`);
            setNtfs(response.data);
            setNtfLoader(false);
        } catch (error) {
            setNtfError(error.response?.data?.message || 'Error fetching notifications');
            setNtfLoader(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = ntfs.slice(indexOfFirstNotification, indexOfLastNotification);
    const totalPages = Math.ceil(ntfs.length / notificationsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-start gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Your Notification(s)</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            {
                ntfLoader ? 
                    <div className='w-full flex items-center justify-center'>
                        <CircularProgress />
                    </div> :
                    ntfError ? 
                        <div className="w-full flex items-center justify-center text-red-600 font-medium text-sm">
                            Error: {ntfError}
                        </div> :
                        <div className="w-full flex flex-col items-center justify-start gap-3">
                            {
                                ntfs.length === 0 ? 
                                    <div className="w-full text-left font-medium">No new notification for you.</div> :
                                    <>
                                        {
                                            currentNotifications.map((ntf, index) => (
                                                <div key={index} className="w-full flex items-center justify-start gap-1">
                                                    <AiTwotoneNotification className='text-lg' />
                                                    <div className="w-full text-left">
                                                        {
                                                            ntf.type === "RFQ" ?
                                                                `The Deadline for the ${ntf.id} is ${new Date(ntf.date).toLocaleDateString('en-US', options)}.` :
                                                                `The Estimation received date for the ${ntf.id} is ${new Date(ntf.date).toLocaleDateString('en-US', options)}.`
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }

                                        <div className="w-full flex justify-end items-center gap-2 mt-4">
                                            <button 
                                                onClick={handlePreviousPage} 
                                                disabled={currentPage === 1}
                                                className={`flex items-center justify-center ${currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <MdOutlineKeyboardArrowLeft className='text-xl' />
                                            </button>
                                            <div className='text-sm text-gray-800'>Page {currentPage} of {totalPages}</div>
                                            <button 
                                                onClick={handleNextPage} 
                                                disabled={currentPage === totalPages}
                                                className={`flex items-center justify-center ${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <MdOutlineKeyboardArrowRight className='text-xl' />
                                            </button>
                                        </div>
                                    </>
                            }
                        </div>
            }
        </div>
    );
};

export default Notification;
