import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { backendServer } from '../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import { LuSend } from "react-icons/lu";
import ViewHardware from '../components/view/hardware';
import ViewArtwork from '../components/view/artwork';
import ViewCasegood from '../components/view/casegood';
import ViewAcessory from '../components/view/accessory';
import ViewArearug from '../components/view/arearug';
import ViewEquipment from '../components/view/equipment';
import ViewFabric from '../components/view/fabric';
import ViewHardwired from '../components/view/lightfixture';
import ViewDecorativeLighting from '../components/view/decoretivelighting';
import ViewMirror from '../components/view/mirror';
import ViewMiscellaneous from '../components/view/miscellaneous';
import ViewTable from '../components/view/table';
import ViewSeating from '../components/view/seating';
import ViewWallpaper from '../components/view/wallpaper';
import ViewUpholstery from '../components/view/upholstery';
import ViewWindowTreatment from '../components/view/windowtreatment';
import GlobalVariable from '../utils/GlobalVariable';

const PrjCollab = () => {

    const navigate = useNavigate();
    const address = useParams();

    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };

    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('name');
    const userType = localStorage.getItem('type');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusLoader, setStatusLoader] = useState('');
    const [sendLoader, setSendLoader] = useState(false);

    const [data, setData] = useState([]);

    const [chatBody, setChatBody] = useState('');

    const handleInputChange = (e) => {
        setChatBody(e.target.value);
    }

    const fetchSecWithPdts = async () => {
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

    const sendChat = async (id) => {
        setSendLoader(true);

        if (chatBody.length === 0) {
            toast.error('Unable to send empty chat!');
            setSendLoader(false);
        } else {
            try {
                const response = await axios.put(`${backendServer}/api/newChat/${id}`, {
                    name: loggedInUser,
                    body: chatBody,
                    userType: userType
                });
                toast.success(response.data.message);
                fetchSecWithPdts();
                setSendLoader(false);
                setChatBody('');
            } catch (error) {
                toast.error(error.response.data.message);
                setSendLoader(false);
            }
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
                                                                                <div className="w-[60%] flex items-center justify-center border-2 border-solid border-gray-300 p-4 rounded-lg h-[46.8rem] overflow-y-scroll scroll-smooth" style={{scrollbarWidth: 'thin'}}>
                                                                                    <img className='w-full' src={pdt.imageUrl} alt="" />
                                                                                </div>
                                                                                <div className="w-[40%] flex flex-col items-center gap-4 border-2 border-solid border-gray-300 p-4 rounded-lg">
                                                                                    <div className="w-full flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg p-2.5">
                                                                                        {
                                                                                            statusLoader === pdt._id ? <CircularProgress /> :
                                                                                                pdt.status === GlobalVariable.ProductStatus.WaitingForClientApproval ?
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
                                                                                                        </div> : <div className='w-full flex items-center justify-center'>
                                                                                                            <div className="w-fit p-1 px-8 bg-blue-gray-50 text-gray-700 rounded-3xl font-medium">
                                                                                                                {GlobalVariable.ProductStatus.WaitingForClientApproval}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    : pdt.status === 'Approved' ? <div className='w-full flex items-center justify-center'>
                                                                                                        <div className="w-fit p-1 px-8 bg-green-50 text-green-700 rounded-3xl font-medium">
                                                                                                            {pdt.status}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                        : pdt.status === 'Rejected' ? <div className='w-full flex items-center justify-center'>
                                                                                                            <div className="w-fit p-1 px-8 bg-red-50 text-red-700 rounded-3xl font-medium">
                                                                                                                {pdt.status}
                                                                                                            </div>
                                                                                                        </div> : ''
                                                                                        }
                                                                                    </div>
                                                                                    <div className="w-full flex flex-col items-center gap-2 border-2 border-solid border-gray-300 rounded-lg p-2.5 h-[15rem] overflow-y-scroll scroll-smooth" style={{scrollbarWidth: 'thin'}}>
                                                                                        <div className="w-full flex items-center justify-start gap-2">
                                                                                            <div className='font-semibold'>Description:</div>
                                                                                        </div>
                                                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                                                       {
                                                                                            <><div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-medium'>SKU:</div>
                                                                                                <div>{pdt.sku}</div>
                                                                                            </div><div className="w-full flex items-center justify-start gap-2">
                                                                                                    <div className='font-medium'>Quantity:</div>
                                                                                                    <div>{pdt.qty}</div>
                                                                                            </div>
                                                                                            {pdt.furnishing === 'Accessory' ? (
                                                                                                <ViewAcessory
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Area Rug' ? (
                                                                                                <ViewArearug
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Equipment' ? (
                                                                                                <ViewEquipment
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Hardware' ? (
                                                                                                <ViewHardware
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Artwork' ? (
                                                                                                <ViewArtwork
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Casegood' ? (
                                                                                                <ViewCasegood
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Fabric' ? (
                                                                                                <ViewFabric
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Light Fixture (hardwired)' ? (
                                                                                                <ViewHardwired
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Decorative Lighting' ? (
                                                                                                <ViewDecorativeLighting
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Mirror' ? (
                                                                                                <ViewMirror
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Miscellaneous' ? (
                                                                                                <ViewMiscellaneous
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Table' ? (
                                                                                                <ViewTable
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Seating' ? (
                                                                                                <ViewSeating
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Wallpaper' ? (
                                                                                                <ViewWallpaper
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Upholstery' ? (
                                                                                                <ViewUpholstery
                                                                                                    pdt={pdt}
                                                                                                />
                                                                                            )   : pdt.furnishing === 'Window Treatment' ? (
                                                                                                <ViewWindowTreatment
                                                                                                    pdt={pdt}
                                                                                                />                      
                                                                                            )                                                                                                                                                                                       
                                                                                            : <></>
                                                                                            }
                                                                                            </>
                                                                                        }
                                                                                                                                                                                                                                     
                                                                                    </div>
                                                                                    <div className="w-full flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg p-2.5">
                                                                                        <div className="w-full flex flex-col items-center justify-start gap-2">
                                                                                            <div className='w-full text-left font-semibold'>Chat here:</div>
                                                                                            <div className="w-full h-[2px] bg-gray-300"></div>
                                                                                            <div className="w-full flex flex-col items-center gap-2 bg-[#F8F9FD] p-2 rounded-lg">
                                                                                                <div className="w-full flex flex-col items-center gap-1.5 bg-white p-2 h-[15rem] overflow-y-scroll scroll-smooth" style={{scrollbarWidth: 'thin'}}>
                                                                                                    {
                                                                                                        pdt.chats.length === 0 ?
                                                                                                            <div className='w-full text-left mb-8'>No chat found!</div> :
                                                                                                            pdt.chats.map(chat => {
                                                                                                                return (
                                                                                                                    chat.userType === userType ?
                                                                                                                        <div className="w-full flex items-center justify-end">
                                                                                                                            <div className="max-w-[60%] min-w-[40%] flex flex-col items-center gap-0.5 bg-green-50 p-1 px-2 rounded-l-md rounded-tr-md">
                                                                                                                                <div className="w-full text-left text-[0.6rem] text-gray-600">{chat.name}</div>
                                                                                                                                <div className="w-full text-sm">{chat.body}</div>
                                                                                                                                <div className="w-full text-end text-[0.6rem] text-gray-600">
                                                                                                                                    {new Intl.DateTimeFormat('en-US', options).format(new Date(chat.createdAt))}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        :
                                                                                                                        <div className="w-full flex items-center justify-start">
                                                                                                                            <div className="max-w-[60%] min-w-[40%] flex flex-col items-center gap-0.5 bg-blue-50 p-1 px-2 rounded-r-md rounded-tl-md">
                                                                                                                                <div className="w-full text-left text-[0.6rem] text-gray-600">{chat.name}</div>
                                                                                                                                <div className="w-full text-sm">{chat.body}</div>
                                                                                                                                <div className="w-full text-end text-[0.6rem] text-gray-600">
                                                                                                                                    {new Intl.DateTimeFormat('en-US', options).format(new Date(chat.createdAt))}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                )
                                                                                                            })
                                                                                                    }
                                                                                                </div>
                                                                                                <div className="w-full flex items-start gap-2">
                                                                                                    <textarea value={chatBody} onChange={handleInputChange}
                                                                                                        className='w-full outline-none p-2 border border-solid border-gray-300 text-sm'
                                                                                                        placeholder='Type here...' rows="2"></textarea>
                                                                                                    {
                                                                                                        sendLoader ? <CircularProgress /> :
                                                                                                            <button onClick={() => sendChat(pdt._id)} className="flex items-center justify-center">
                                                                                                                <LuSend className='text-[#7F55DE] text-2xl' />
                                                                                                            </button>
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
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
