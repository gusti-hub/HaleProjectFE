import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineMoreVert } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import toast from 'react-hot-toast';

const TimeExpenses = () => {

    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('name');

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [teDocs, setTEDocs] = useState([]);

    const fetchTEDocs = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/te-docs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTEDocs(response.data.filter(doc => doc.user === loggedInUser));
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTEDocs();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const docs = teDocs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(teDocs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [menuOpen, setMenuOpen] = useState('');

    const openMenu = (_id) => {
        if (menuOpen === _id) {
            setMenuOpen(null);
        } else {
            setMenuOpen(_id);
        }
    };

    const [menuSaveLoader, setMenuSaveLoader] = useState(false);

    const updateStatus = async (_id, status) => {

        setMenuSaveLoader(true);

        try {
            const response = await axios.put(`${backendServer}/api/update-te-status/${_id}`, { status: status });
            toast.success(response.data.message);
            setMenuSaveLoader(false);
            await fetchTEDocs();
        } catch (error) {
            toast.error(error.response.data.message);
            setMenuSaveLoader(false);
        }
    };

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Time & Expenses</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            {
                loading ?
                    <div className='w-full flex items-center justify-center'>
                        <CircularProgress />
                    </div> :
                    error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium">
                            Error: {error}
                        </div> :
                        <div className="w-full flex flex-col items-center justify-start gap-6">
                            <div className="w-full flex items-center justify-between">
                                <button onClick={() => navigate("/time-expenses")}
                                    className='flex items-center justify-center gap-1 pl-5 pr-6 py-2 rounded-lg bg-[#7F55DE] text-white text-lg'>
                                    <IoMdAdd className='text-xl' />
                                    <div>ADD</div>
                                </button>
                            </div>

                            {
                                teDocs.length === 0 ? <div className="w-full flex items-center justify-start text-lg font-medium">No document found!</div> :
                                    <div className="w-full flex flex-col items-center">
                                        <table className='w-full border-collapse mt-4'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>Action</th>
                                                    <th>Document No.</th>
                                                    <th>Type</th>
                                                    <th>Date Created</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    docs.map(doc => {
                                                        return (
                                                            <tr key={doc._id} className='text-base text-center text-gray-700'>
                                                                <td>
                                                                    <div className="w-full flex items-start justify-center gap-2 relative">
                                                                        {
                                                                            menuOpen != doc._id ?
                                                                                <MdOutlineMoreVert
                                                                                    onClick={() => openMenu(doc._id)}
                                                                                    className='cursor-pointer text-xl' />
                                                                                :
                                                                                <IoCloseSharp
                                                                                    onClick={() => openMenu(doc._id)}
                                                                                    className='cursor-pointer text-xl' />
                                                                        }
                                                                        <div style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}
                                                                            className={`${menuOpen === doc._id ? 'block' : 'hidden'} w-[12rem] flex flex-col items-start justify-start p-2 fixed bg-white ml-[14rem] mt-[0.5rem]`}>
                                                                            {
                                                                                menuSaveLoader ?
                                                                                    <div className="w-full text-center my-8"> <CircularProgress /> </div> :
                                                                                    <div className="w-full flex flex-col items-start gap-1">
                                                                                        <button onClick={() => navigate(`/view-doc/${doc.type.toLowerCase()}/${doc._id}`)}
                                                                                            className="w-full text-left font-normal">
                                                                                                {doc.type === 'Time' ? 'View' : 'View / Edit'}
                                                                                            </button>
                                                                                        {doc.status === "Draft on Approval" && <div className={`w-full h-[2px] bg-gray-300`}></div>}
                                                                                        {
                                                                                            doc.status === "Draft on Approval" && <button onClick={() => updateStatus(doc._id, "Approved")}
                                                                                                className="w-full text-left font-normal">Approve</button>
                                                                                        }
                                                                                        {doc.status === "Draft on Approval" && <div className={`w-full h-[2px] bg-gray-300`}></div>}
                                                                                        {
                                                                                            doc.status === "Draft on Approval" && <button onClick={() => updateStatus(doc._id, "Rejected")}
                                                                                                className="w-full text-left font-normal">Reject</button>
                                                                                        }
                                                                                    </div>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>{doc.docid}</td>
                                                                <td>{doc.type}</td>
                                                                <td>{new Date(doc.createdAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                })}</td>
                                                                <td>
                                                                    <div className="w-full flex items-center justify-center">
                                                                        {
                                                                            doc.status === "Draft on Approval" ?
                                                                                <div className='w-fit p-1 px-6 bg-blue-gray-50 text-gray-700 rounded-3xl font-medium text-nowrap'>{doc.status}</div> :
                                                                                doc.status === "Approved" ?
                                                                                    <div className='w-fit p-1 px-6 bg-green-50 text-green-700 rounded-3xl font-medium text-nowrap'>{doc.status}</div> :
                                                                                    doc.status === "Rejected" ?
                                                                                        <div className='w-fit p-1 px-6 bg-red-50 text-red-700 rounded-3xl font-medium text-nowrap'>{doc.status}</div> :
                                                                                        ''
                                                                        }
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className='w-full flex items-center justify-end gap-2 mt-4'>

                                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center cursor-pointer">
                                                <MdOutlineKeyboardArrowLeft className='text-xl' />
                                            </button>

                                            <div className='text-gray-800 text-sm'>
                                                Page {currentPage} of {totalPages}
                                            </div>

                                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center cursor-pointer">
                                                <MdOutlineKeyboardArrowRight className='text-xl' />
                                            </button>

                                        </div>
                                    </div>
                            }
                        </div>
            }
        </div>
    );
};

export default TimeExpenses;
