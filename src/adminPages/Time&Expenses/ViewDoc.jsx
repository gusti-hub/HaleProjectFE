import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import FetchTime from './FetchTime';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import ViewExpense from './ViewExpense';

const ViewDoc = () => {

    const navigate = useNavigate();
    const address = useParams();

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [doc, setDoc] = useState({});

    const fetchDoc = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/te-doc/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoc(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoc();
    }, []);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full min-h-screen flex flex-col items-center justify-start rounded-lg">

                <div className="w-full flex items-center justify-start p-6 bg-[#F8F9FD] gap-6">
                    <div onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-[50%] bg-[#7F55DE] p-2 cursor-pointer">
                        <IoArrowBack className='text-white text-2xl' />
                    </div>
                    <img className={`w-[6rem]`} src="../../images/logoBlue.png" alt="Logo" />
                </div>

                {
                    loading ?
                        <div className='w-full flex items-center justify-center mt-24'>
                            <CircularProgress />
                        </div> :
                        error ?
                            <div className="w-full flex items-center justify-center text-red-600 font-medium mt-24">
                                Error: {error}
                            </div> :
                            <div className="w-full flex flex-col items-center justify-start">
                                <div className="w-full flex flex-col items-start justify-start p-6 pb-0 gap-1">
                                    <div className="w-full text-left font-semibold text-lg">Document No.: <span className='font-normal'>{doc.docid}</span></div>
                                    <div className="w-full text-left font-semibold">Type: <span className='font-normal'>{doc.type}</span></div>
                                    <div className="w-full flex items-center justify-start gap-1">
                                        <div className="text-left font-semibold">Status:</div>
                                        <div className='font-normal'>
                                            {
                                                doc.status === "Draft on Approval" ?
                                                    <div className='text-gray-700 font-medium text-nowrap'>{doc.status}</div> :
                                                    doc.status === "Approved" ?
                                                        <div className='text-green-700 font-medium text-nowrap'>{doc.status}</div> :
                                                        doc.status === "Rejected" ?
                                                            <div className='text-red-700 font-medium text-nowrap'>{doc.status}</div> : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    address.type === "time" ? <FetchTime id={doc.teid} status={doc.status} />
                                        : address.type === "expense" ? <ViewExpense id={doc.teid} status={doc.status} /> : ''
                                }
                            </div>
                }
            </div>
        </div>
    );
};

export default ViewDoc;
