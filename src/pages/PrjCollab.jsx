import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { backendServer } from '../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';

const PrjCollab = () => {

    const navigate = useNavigate();
    const address = useParams();

    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('name');
    const userType = localStorage.getItem('type');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState([]);

    const fetchSecWithPdts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendServer}/api/project-collab/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const [statusLoader, setStatusLoader] = useState('');

    const handleStatus = async (id, status) => {
        setStatusLoader(id);
        try {
            const response = await axios.put(`${backendServer}/api/updatePdtStatus/${id}`, { status: status });
            toast.success(response.data.message);
            setStatusLoader('');
            fetchSecWithPdts();
        } catch (error) {
            toast.error(error.response.data.message);
            setStatusLoader('');
        }
    };

    useEffect(() => {
        fetchSecWithPdts();
    }, []);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full min-h-screen flex flex-col items-center justify-start border-[0.75rem] border-solid border-[#DCD8FF] rounded-lg bg-[#F8F9FD]">
                <div className="w-full flex items-center justify-start p-6 bg-[#F8F9FD] gap-6">
                    <div onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-[50%] bg-[#7F55DE] p-2 cursor-pointer">
                        <IoArrowBack className='text-white text-2xl' />
                    </div>
                    <img className={`w-[6rem]`} src="../images/logoBlue.png" alt="Logo" />
                </div>

                <div className="w-full flex items-center justify-center bg-[#F8F9FD] px-4 pb-4">
                    <div className="w-full flex flex-col items-center justify-start gap-3 p-4 bg-white">
                        <div className="w-full flex items-center justify-start text-gray-900 text-2xl font-medium">
                            Project Sections
                        </div>
                        <div className="w-full h-[2px] bg-gray-300"></div>
                        {
                            loading ?
                                <div className='w-full flex items-center justify-center my-40'>
                                    <CircularProgress />
                                </div> :
                                error ?
                                    <div className="w-full flex items-center justify-center text-red-600 font-medium mt-4 mb-60">
                                        Error: {error}
                                    </div>
                                    :
                                    <div className="w-full flex flex-col items-center gap-4">
                                        {
                                            data.length === 0 ? <div className="w-full text-left font-medium mt-4 mb-60">No data found!</div>
                                                :
                                                data.map(data => {
                                                    return (
                                                        <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 p-4 rounded-lg gap-4">
                                                            <div className="w-full text-left text-xl font-medium">{data.sectionName}</div>
                                                            {
                                                                data.products.map(pdt => {
                                                                    return (
                                                                        pdt.type === 'Product' && <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 p-4 rounded-lg gap-4">
                                                                            <div className="w-full text-left text-lg font-medium">{pdt.title}</div>
                                                                            <div className="w-full flex items-start justify-center gap-4">
                                                                                <div className="w-[60%] flex items-center justify-center border-2 border-solid border-gray-300 p-4 rounded-lg">
                                                                                    <img className='w-full' src={pdt.imageUrl} alt="" />
                                                                                </div>
                                                                                <div className="w-[40%] flex flex-col items-center gap-4 border-2 border-solid border-gray-300 p-4 rounded-lg">
                                                                                    <div className="w-full flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg p-2.5">
                                                                                        {
                                                                                            statusLoader === pdt._id ? <CircularProgress /> :
                                                                                                pdt.status === 'Pending' ?
                                                                                                    userType === 'Client' ?
                                                                                                        <div className="w-full flex items-center justify-center gap-6">
                                                                                                            <button onClick={() => handleStatus(pdt._id, 'Approved')}
                                                                                                                className='bg-green-600 text-white w-[7rem] py-1.5 rounded-md'>
                                                                                                                Approve
                                                                                                            </button>
                                                                                                            <button onClick={() => handleStatus(pdt._id, 'Rejected')}
                                                                                                                className='bg-red-600 text-white w-[7rem] py-1.5 rounded-md'>
                                                                                                                Reject
                                                                                                            </button>
                                                                                                        </div> : <div className='w-full text-left'>
                                                                                                            <div className="w-fit p-1 px-3 bg-blue-gray-50 text-gray-700 rounded-3xl font-medium">
                                                                                                                Waiting for approval
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    : pdt.status === 'Approved' ? <div className='w-full text-left'>
                                                                                                        <div className="w-fit p-1 px-3 bg-green-50 text-green-700 rounded-3xl font-medium">
                                                                                                            {pdt.status}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                        : pdt.status === 'Rejected' ? <div className='w-full text-left'>
                                                                                                            <div className="w-fit p-1 px-3 bg-red-50 text-red-700 rounded-3xl font-medium">
                                                                                                                {pdt.status}
                                                                                                            </div>
                                                                                                        </div> : ''
                                                                                        }
                                                                                    </div>
                                                                                    <div className="w-full flex flex-col items-center gap-2 border-2 border-solid border-gray-300 rounded-lg p-2.5">
                                                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                                            <div className='font-semibold'>Description:</div>
                                                                                            {
                                                                                                pdt.desc ? <div className="w-full flex items-center justify-start">{pdt.desc}</div> :
                                                                                                    <div className="w-full flex items-center justify-start">Not available</div>
                                                                                            }
                                                                                        </div>
                                                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                                                        {
                                                                                            pdt.productDetails.unit && <div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-medium'>Dimension:</div>
                                                                                                <div className="w-full flex flex-wrap items-center justify-start gap-2">
                                                                                                    {pdt.productDetails.len ? <div><span className='text-black font-medium'>L:</span> {pdt.productDetails.len} {pdt.productDetails.unit}</div> : ''}
                                                                                                    {pdt.productDetails.wid ? <div><span className='text-black font-medium'>W:</span> {pdt.productDetails.wid} {pdt.productDetails.unit}</div> : ''}
                                                                                                    {pdt.productDetails.dia ? <div><span className='text-black font-medium'>Dia:</span> {pdt.productDetails.dia} {pdt.productDetails.unit}</div> : ''}
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            pdt.productDetails.color && <div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-medium'>Color:</div>
                                                                                                <div className="flex items-center justify-center gap-2">
                                                                                                    <div className={`w-7 h-5 rounded-sm`} style={{ backgroundColor: pdt.productDetails.color }}></div>
                                                                                                    <div>{pdt.productDetails.color}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            pdt.productDetails.material && <div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-medium'>Material:</div>
                                                                                                <div>{pdt.productDetails.material}</div>
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            pdt.productDetails.insert && <div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-medium'>Insert:</div>
                                                                                                <div>{pdt.productDetails.insert}</div>
                                                                                            </div>
                                                                                        }
                                                                                        {
                                                                                            pdt.productDetails.finish && <div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-medium'>Finish:</div>
                                                                                                <div>{pdt.productDetails.finish}</div>
                                                                                            </div>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="w-full flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg p-2.5">
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })

                                        }
                                    </div>

                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrjCollab;
