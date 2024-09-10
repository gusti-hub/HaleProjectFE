import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { AiTwotoneNotification } from 'react-icons/ai';

const Notification = ({ data, loader, error }) => {

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="w-full flex items-center justify-center bg-[#F8F9FD]">
            {
                loader ?
                    <div className='w-full flex items-center justify-center my-[5rem]'>
                        <CircularProgress />
                    </div> :
                    error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium text-sm my-[5.5rem]">
                            Error: {error}
                        </div> :
                        <div style={{scrollbarWidth: 'thin'}}
                        className="w-full min-h-[12rem] max-h-[25rem] flex flex-col items-center justify-start gap-2.5 p-2 scroll-smooth overflow-y-scroll">
                            {
                                data.length === 0 ? <div className="w-full text-left text-sm">No new notification for you.</div> :
                                    data.map(ntf => {
                                        return (
                                            <div className="w-full flex items-start justify-start gap-1">
                                                <AiTwotoneNotification />
                                                <div className="w-full text-left text-sm">
                                                    The deadline for the {ntf.rfqId} is {new Date(ntf.deadline).toLocaleDateString('en-US', options)}.
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
            }
        </div>
    );
};

export default Notification;
