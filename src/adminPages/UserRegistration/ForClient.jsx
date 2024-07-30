import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoPersonAdd } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { backendServer } from '../../utils/info';
import { FiSearch } from 'react-icons/fi';

const ForClient = () => {
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', email: '', password: '', title: '', address: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '', email: '', password: '', title: '', address: '' });
        setIsChecked(false);
        setEditMode(false);
        setCurrentUserId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const handleEditClick = (user) => {
        setFormData({ name: user.name, code: user.code, email: user.email, password: '', title: user.title, address: user.address });
        setCurrentUserId(user._id);
        setEditMode(true);
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name.length === 0 || formData.code.length === 0 || formData.email.length === 0) {
            toast.error("Can't submit empty form or check password!"); setOpen(false);
        }

        if (formData.name.length > 0 && formData.code.length > 0 && formData.email.length > 0 && (editMode || formData.password.length >= 8)) {
            try {
                const response = editMode
                    ? await axios.put(`${backendServer}/api/clients/${currentUserId}`, formData)
                    : await axios.post(`${backendServer}/api/clientreg`, formData);
                toast.success(response.data.message);
                fetchUsers();
                resetForm();
                setOpen(false);
            } catch (error) {
                toast.error(error.response.data.message);
                resetForm();
                setOpen(false);
            }
        }
    };

    const handleDeleteClick = async (userId) => {
        try {
            const response = await axios.delete(`${backendServer}/api/clients/${userId}`);
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
        <div className="w-full flex flex-col items-center justify-start bg-white p-4 rounded-lg gap-8">
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <form onSubmit={handleSubmit}
                    className='w-full flex flex-col items-center justify-start gap-4 bg-white p-4 text-black rounded-lg'>
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
                    <div className="w-full flex flex-col items-start gap-1 text-base">
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
                        <div className="w-full flex items-center justify-start gap-2">
                            <label htmlFor="password">Password: {editMode ? '(Leave blank to keep current password)' : '(Minimum of 8 characters)'}</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        </div>
                        {
                            isChecked ?
                                <input
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='w-full border-b-2 border-solid border-black p-2 outline-none'
                                    type="text" placeholder='Type here...' name="password" id="password" />
                                :
                                <input
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='w-full border-b-2 border-solid border-black p-2 outline-none'
                                    type="password" placeholder='Type here...' name="password" id="password" />
                        }
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            name="showPassword" id="showPassword" />
                        <div className='text-sm'>Show password</div>
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="title">Title:</label>
                        <input
                            value={formData.title}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="title" id="title" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="address">Address:</label>
                        <input
                            value={formData.address}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="address" id="address" />
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button className='w-full bg-[#7F55DE] p-2 text-white text-base font-medium rounded-lg'>
                            {editMode ? 'Update' : 'Register'}
                        </button>
                    </div>
                </form>
            </Dialog>

            <div className="w-full flex items-center justify-between">
                <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                    <FiSearch className='text-xl text-gray-600 ml-2' />
                    <input
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className='outline-none p-2 mr-1 text-gray-600'
                        type="search" placeholder='Search by name' />
                </div>
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
                    <table className='border-collapse w-full'>
                        <thead>
                            <tr className='text-gray-700 text-lg'>
                                <th>Actions</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Title</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredUsers.map(user => (
                                    <tr key={user._id} className='text-base text-center text-gray-700'>
                                        <td>
                                            <div className='w-full flex items-center justify-center gap-4'>
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
                                        <td>{user.title}</td>
                                        <td>{user.address}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    );
};

export default ForClient;
