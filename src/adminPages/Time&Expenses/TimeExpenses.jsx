import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const TimeExpenses = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Time & Expenses</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            {
                !loading ?
                    <div className='w-full flex items-center justify-center'>
                        <CircularProgress />
                    </div> :
                    error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium">
                            Error: {error}
                        </div> :
                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex items-center justify-between">
                                <button onClick={() => navigate("/time-expenses")}
                                    className='flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-[#7F55DE] text-white text-lg'>
                                    <IoMdAdd className='text-xl' />
                                    <div>ADD</div>
                                </button>
                            </div>
                        </div>
            }
        </div>
    );
};

export default TimeExpenses;
