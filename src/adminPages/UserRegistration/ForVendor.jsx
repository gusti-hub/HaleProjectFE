import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoPersonAdd } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { backendServer } from '../../utils/info';
import { FiSearch } from 'react-icons/fi';

const ForVendor = () => {
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', code: '', email: '', pic: '', phone: '', street: '', city: '', state: '', zip: '', note: '', mailAddress: '', siteAddress: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', email: '', pic: '', phone: '', street: '', city: '', state: '', zip: '', note: '', mailAddress: '', siteAddress: '' });
        setEditMode(false);
        setCurrentUserId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendServer}/api/vendors`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setFormData({ name: user.name, code: user.code, email: user.email, pic: user.pic, phone: user.phone, street: user.street, city: user.city, state: user.state, zip: user.zip, note: user.note, mailAddress: user.mailAddress, siteAddress: user.siteAddress });
        setCurrentUserId(user._id);
        setEditMode(true);
        setOpen(true);
    };

    const [saveLoader, setSaveLoader] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoader(true);

        if (formData.name.length === 0 || formData.code.length === 0 || formData.email.length === 0) {
            toast.error("Can't submit empty form!"); setOpen(false); setSaveLoader(false);
        }

        if (formData.name.length > 0 && formData.code.length > 0 && formData.email.length > 0) {
            try {
                const response = editMode
                    ? await axios.put(`${backendServer}/api/vendors/${currentUserId}`, formData)
                    : await axios.post(`${backendServer}/api/vendorreg`, formData);
                toast.success(response.data.message);
                fetchUsers();
                resetForm();
                setOpen(false);
                setSaveLoader(false);
            } catch (error) {
                toast.error(error.response.data.message);
                resetForm();
                setOpen(false);
                setSaveLoader(false);
            }
        }
    };

    const handleDeleteClick = async (userId) => {
        try {
            const response = await axios.delete(`${backendServer}/api/vendors/${userId}`);
            toast.success(response.data.message);
            fetchUsers();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return (
        <div className='w-full flex items-center justify-center'>
            <CircularProgress />
        </div>
    )

    if (error) return (
        <div className="w-full flex items-center justify-center text-red-600 font-medium">
            Error: {error}
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center justify-start bg-white p-4 rounded-lg gap-4">
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <form onSubmit={handleSubmit}
                    className='w-full max-h-[80vh] overflow-y-scroll scroll-smooth flex flex-col items-center justify-start gap-4 bg-white p-4 text-black rounded-lg' style={{scrollbarWidth: 'thin'}}>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <div className="w-full flex items-center justify-start gap-2">
                            <label htmlFor="name">Name:</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        </div>
                        <input
                            value={formData.name}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="name" id="name" />
                    </div>
                    {
                        !editMode && <div className="w-full flex flex-col items-start gap-1 text-base">
                            <div className="w-full flex items-center justify-start gap-2">
                                <label htmlFor="code">Code:</label>
                                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                            </div>
                            <input
                                value={formData.code}
                                onChange={handleInputChange}
                                className='w-full border-b-2 border-solid border-black p-2 outline-none'
                                type="text" placeholder='Type here...' name="code" id="code" />
                        </div>
                    }
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <div className="w-full flex items-center justify-start gap-2">
                            <label htmlFor="email">Email:</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        </div>
                        <input
                            value={formData.email}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="email" placeholder='Type here...' name="email" id="email" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="PIC">PIC:</label>
                        <input
                            value={formData.pic}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="pic" id="pic" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            value={formData.phone}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="phone" id="phone" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="street">Street:</label>
                        <input
                            value={formData.street}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="street" id="street" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="city">City:</label>
                        <input
                            value={formData.city}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="city" id="city" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="state">State:</label>
                        <input
                            value={formData.state}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="state" id="state" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="zip">Zip:</label>
                        <input
                            value={formData.zip}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="zip" id="zip" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="note">Note:</label>
                        <input
                            value={formData.note}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="note" id="note" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="mailAddress">Mailing Address:</label>
                        <input
                            value={formData.mailAddress}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="mailAddress" id="mailAddress" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="siteAddress">Site Address:</label>
                        <input
                            value={formData.siteAddress}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="siteAddress" id="siteAddress" />
                    </div>
                    <div className="w-full flex items-center justify-center">
                        {
                            saveLoader ? <CircularProgress /> :
                                <button className='w-full bg-[#7F55DE] p-2 text-white text-base font-medium rounded-lg'>
                                    {editMode ? 'Update' : 'Register'}
                                </button>
                        }
                    </div>
                </form>
            </Dialog>

            <div className="w-full flex items-center justify-between">
                {
                    users.length != 0 ?
                        <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                            <FiSearch className='text-xl text-gray-600 ml-2' />
                            <input
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className='outline-none p-2 mr-1 text-gray-600'
                                type="search" placeholder='Search by name' />
                        </div> : <div></div>
                }
                <button onClick={handleOpen}
                    className='flex items-center justify-center gap-3 px-5 py-2 rounded-lg bg-[#7F55DE] text-white text-lg'>
                    <IoPersonAdd className='text-base' />
                    <div>ADD</div>
                </button>
            </div>

            {
                filteredUsers.length === 0 ?
                    <div className="w-full flex items-center justify-start text-lg font-medium">
                        No records found!
                    </div> :
                    <div className="w-full flex flex-col items-start justify-start">
                        <div className="w-full flex items-start justify-start max-w-[68rem] overflow-x-scroll scroll-smooth pb-2" style={{ scrollbarWidth: 'thin' }}>
                            <table className='border-collapse w=full'>
                                <thead>
                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                        <th>Actions</th>
                                        <th>Code</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>PIC</th>
                                        <th>Phone</th>
                                        <th>Street</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Zip</th>
                                        <th>Note</th>
                                        <th>Mailing Address</th>
                                        <th>Site Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        current.map(user => (
                                            <tr key={user._id} className='text-base text-center text-gray-700 text-nowrap'>
                                                <td>
                                                    <div className='w-full flex items-center justify-center gap-2 px-2'>
                                                        <FaEdit
                                                            className='text-lg cursor-pointer'
                                                            onClick={() => handleEditClick(user)} />
                                                        <MdDeleteOutline
                                                            className='text-xl text-red-600 cursor-pointer'
                                                            onClick={() => handleDeleteClick(user._id)} />
                                                    </div>
                                                </td>
                                                <td>{user.code}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.pic}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.street}</td>
                                                <td>{user.city}</td>
                                                <td>{user.state}</td>
                                                <td>{user.zip}</td>
                                                <td>{user.note}</td>
                                                <td>{user.mailAddress}</td>
                                                <td>{user.siteAddress}</td>
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
    );
};

export default ForVendor;
