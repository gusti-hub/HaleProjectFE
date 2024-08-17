import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { IoPersonAdd } from 'react-icons/io5';
import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import { IoMdAddCircle } from 'react-icons/io';
import toast from 'react-hot-toast';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';

const ForEmployee = () => {
    const token = localStorage.getItem('token');

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', title: '', role_id: '', role_name: '', role_code: '' });
    const [isChecked, setIsChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', title: '', role_id: '', role_name: '', role_code: '' });
        setIsEditing(false);
        setEditingUserId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if(name == 'role_name'){
            const  role = roles.find(item => item.name == value)
            if (role){
                setFormData({ ...formData, role_id: role._id, role_code: role.code, [name]: value });
            }else{
                setFormData({ ...formData, role_id: '', role_code: '', role_name: '' });
            }            
        }
        else{
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setFormData({ ...formData, role: event.target.value });
    };

    const handleCustomOptionChange = (event) => {
        setCustomOption(event.target.value);
    };

    const handleAddCustomOption = () => {
        if (customOption.trim() !== '') {
            const newOption = { id: customOption, name: customOption };
            setOptions(prevOptions => [...prevOptions, newOption]);
            setSelectedOption(customOption);
            setFormData({ ...formData, role: customOption });
            setCustomOption('');
        }
    };

    const fetchOptions = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/roleOptions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (Array.isArray(response.data)) {
                setOptions(response.data);
            } else {
                throw new Error('Response data is not an array');
            }
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/employees`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data.roles);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name.length === 0 || formData.email.length === 0 || formData.role_name.length === 0) {
            toast.error("Can't submit empty form or check password!"); setOpen(false);
        }

        if (formData.name.length > 0 && formData.email.length > 0 && (isEditing || formData.password.length >= 8) && formData.role_name.length > 0) {
            try {
                const response = isEditing
                    ? await axios.put(`${backendServer}/api/employee/${editingUserId}`, formData)
                    : await axios.post(`${backendServer}/api/empreg`, formData);
                toast.success(response.data.message);
                resetForm();
                setOpen(false);
                fetchUsers();
            } catch (error) {
                toast.error(error.response.data.message);
                resetForm();
                setOpen(false);
                fetchUsers();
            }
        }
    };

    const handleEditClick = (user) => {
        setFormData({ ...user, password: '' });
        setIsEditing(true);
        setEditingUserId(user._id);
        setOpen(true);
    };

    const handleDeleteClick = async (userId) => {
        try {
            const response = await axios.delete(`${backendServer}/api/employee/${userId}`);
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
    );

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
                            <label htmlFor="password">Password: {isEditing ? '(Leave blank to keep current password)' : '(Minimum of 8 characters)'}</label>
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
                        <div className="w-full flex items-center justify-start gap-2">
                            <label htmlFor="code">Role:</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        </div>
                        <select
                            value={formData.role_name}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            name="role_name"
                            id="role_id"
                        >
                            <option value="">Select role...</option>
                            {roles.map(option => (
                                <option key={option._id} value={option.role_name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button onClick={handleSubmit}
                            type="button" className='w-full bg-[#7F55DE] p-2 text-white text-base font-medium rounded-lg'>
                            {isEditing ? 'Update' : 'Register'}
                        </button>
                    </div>
                </form>
            </Dialog>
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                    <FiSearch className='text-xl text-gray-600 ml-2' />
                    <input
                        className='outline-none p-2 mr-1 text-gray-600'
                        type="search" placeholder='Search by name'
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
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
                    <div className="w-full flex flex-col items-center">
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr className='text-gray-700 text-lg'>
                                    <th>Actions</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Title</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    current.map(user => {
                                        return (
                                            <tr key={user._id} className='text-base text-center text-gray-700'>
                                                <td>
                                                    <div className='w-full flex items-center justify-center gap-4'>
                                                        <FaEdit onClick={() => handleEditClick(user)}
                                                            className='text-lg cursor-pointer' />
                                                        <MdDeleteOutline onClick={() => handleDeleteClick(user._id)}
                                                            className='text-xl text-red-600 cursor-pointer' />
                                                    </div>
                                                </td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.title}</td>
                                                <td>{user.role}</td>
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

                            <div className='text-gray-700'>
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

export default ForEmployee;
