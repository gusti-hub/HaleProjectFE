import React, { useContext, useEffect, useState } from 'react';
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
import { AppContext } from '../../context/CommonContext';

const ForEmployee = () => {

    const token = localStorage.getItem('token');
    const loggedInUserID = localStorage.getItem('userId');

    const { fetchName } = useContext(AppContext);

    const [users, setUsers] = useState([]);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [customOption, setCustomOption] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', password: '', title: '', role: '' });
    const [isChecked, setIsChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialSelectedOption, setInitialSelectedOption] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpen = () => {
        setOpen((cur) => !cur);
        if (!cur) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', password: '', title: '', role: '' });
        setSelectedOption('');
        setIsEditing(false);
        setEditingUserId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (!value.includes(' ')) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
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
        setLoading(true);
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

    useEffect(() => {
        fetchUsers();
        fetchOptions();
    }, []);

    const [saveLoader, setSaveLoader] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveLoader(true);

        if (formData.name.length === 0 || formData.email.length === 0 || formData.role.length === 0) {
            toast.error("Can't submit empty form or check password!"); setOpen(false); setSaveLoader(false);
        }

        if (formData.name.length > 0 && formData.email.length > 0 && (isEditing || formData.password.length >= 8) && formData.role.length > 0) {
            try {
                const response = isEditing
                    ? await axios.put(`${backendServer}/api/employee/${editingUserId}`, formData)
                    : await axios.post(`${backendServer}/api/empreg`, formData);
                toast.success(response.data.message);

                if (isEditing) {
                    if (response.data.userId === loggedInUserID) {
                        localStorage.setItem('name', response.data.userName);
                        await fetchName();
                    };
                };

                resetForm();
                setOpen(false);
                fetchUsers();
                setSaveLoader(false);
            } catch (error) {
                toast.error(error.response.data.message);
                resetForm();
                setOpen(false);
                fetchUsers();
                setSaveLoader(false);
            }
        }
    };

    const handleEditClick = (user) => {
        setFormData({ ...user, password: '' });
        setSelectedOption(user.role);
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
                    <div className="w-full flex items-center justify-between">
                        <div className="w-full flex items-center justify-start gap-2 text-base">
                            <label htmlFor="role">Role:</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                            <select value={selectedOption} onChange={handleSelectChange}
                                className='p-1 outline-none' name="role" id="role">
                                <option value="" disabled>Select an option</option>
                                {options.map(option => (
                                    <option key={option.id} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex items-center justify-center gap-2'>
                            <input
                                className='w-[8rem] p-1 border-solid border-b-black border-b-2 outline-none'
                                type="text"
                                value={customOption}
                                onChange={handleCustomOptionChange}
                                placeholder="Add custom role"
                            />
                            <div onClick={handleAddCustomOption} className="flex items-center justify-center p-1 bg-[#7F55DE] rounded-md cursor-pointer">
                                <IoMdAddCircle className='text-white text-2xl' />
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        {
                            saveLoader ? <CircularProgress /> :
                                <button onClick={handleSubmit}
                                    type="button" className='w-full bg-[#7F55DE] p-2 text-white text-base font-medium rounded-lg'>
                                    {isEditing ? 'Update' : 'Register'}
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
                        No record found!
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
