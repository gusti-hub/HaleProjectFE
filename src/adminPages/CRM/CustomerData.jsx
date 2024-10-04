import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import toast from 'react-hot-toast';

const CustomerData = () => {

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/clients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [oppStatus, setOppStatus] = useState({});
    const [oppStage, setOppStage] = useState({});

    const handleOppStatus = async (e, userId) => {
        const { value } = e.target;

        setOppStatus(prevState => ({
            ...prevState,
            [userId]: value
        }));

        try {
            const res = await axios.put(`${backendServer}/api/update-opportunity-status/${userId}`, {
                status: value,
            });
            toast.success(res.data.message);
            await fetchUsers();
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    const handleOppStage = async (e, userId) => {
        const { value } = e.target;

        setOppStage(prevState => ({
            ...prevState,
            [userId]: value
        }));

        try {
            const res = await axios.put(`${backendServer}/api/update-opportunity-stage/${userId}`, {
                status: value,
            });
            toast.success(res.data.message);
            await fetchUsers();
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    return (
        <div className="w-full flex items-center justify-start">
            {
                loading ?
                    <div className='w-full flex items-center justify-center mt-8'>
                        <CircularProgress />
                    </div> :
                    error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium mt-8">
                            Error: {error}
                        </div> :
                        <div className="w-full flex flex-col items-center justify-start bg-white pt-2 p-4 rounded-lg gap-4">
                            <div className="w-full flex items-center justify-start">
                                {
                                    users.length != 0 &&
                                    <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                                        <FiSearch className='text-xl text-gray-600 ml-2' />
                                        <input
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className='outline-none p-2 mr-1 text-gray-600'
                                            type="search" placeholder='Search by name' />
                                    </div>
                                }
                            </div>

                            {
                                filteredUsers.length === 0 ?
                                    <div className="w-full flex items-center justify-start text-lg font-medium">
                                        No records found!
                                    </div> :
                                    <div className="w-full flex flex-col items-start justify-start">
                                        <div className="w-full flex items-start justify-start max-w-[68rem] overflow-x-scroll scroll-smooth pb-2" style={{ scrollbarWidth: 'thin' }}>
                                            <table className='border-collapse w-full'>
                                                <thead>
                                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                                        <th>Code</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Address</th>
                                                        <th>City</th>
                                                        <th>State</th>
                                                        <th>Zip</th>
                                                        <th>Phone</th>
                                                        <th>Notes</th>
                                                        <th>Opportunity Status</th>
                                                        <th>Opportunity Stages</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        current.map(user => (
                                                            <tr key={user._id} className='text-base text-center text-gray-700 text-nowrap'>
                                                                <td>{user.code}</td>
                                                                <td>{user.name}</td>
                                                                <td>{user.email}</td>
                                                                <td>{user.address}</td>
                                                                <td>{user.city}</td>
                                                                <td>{user.state}</td>
                                                                <td>{user.zip}</td>
                                                                <td>{user.phone}</td>
                                                                <td>{user.notes}</td>
                                                                <td>
                                                                    <div className="w-full flex items-center justify-center">
                                                                        <select value={oppStatus[user._id] || user.oppStatus ? user.oppStatus : ''}
                                                                            onChange={(e) => handleOppStatus(e, user._id)}
                                                                            className='w-full border border-solid border-gray-300 p-1 outline-none'>
                                                                            <option value="" disabled>Select an option</option>
                                                                            <option value="open">Open</option>
                                                                            <option value="lost">Lost</option>
                                                                            <option value="won">Won</option>
                                                                        </select>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="w-full flex items-center justify-center">
                                                                        <select value={oppStage[user._id] || user.oppStage ? user.oppStage : ''}
                                                                            onChange={(e) => handleOppStage(e, user._id)}
                                                                            className='w-full border border-solid border-gray-300 p-1 outline-none'>
                                                                            <option value="" disabled>Select an option</option>
                                                                            <option value="unqualified">Unqualified</option>
                                                                            <option value="qualified">Qualified</option>
                                                                            <option value="follow-up">Follow-up</option>
                                                                            <option value="demo">Demo</option>
                                                                            <option value="negotiation">Negotiation</option>
                                                                            <option value="lost">Lost</option>
                                                                            <option value="won">Won</option>
                                                                        </select>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
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

export default CustomerData;
