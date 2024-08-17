import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { IoPersonAdd } from 'react-icons/io5';
import CircularProgress from '@mui/material/CircularProgress';
import { FaEdit } from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight  } from 'react-icons/md';
import { backendServer } from '../../utils/info';
import { FiSearch } from 'react-icons/fi';

const ForRoleRegistration = () => {
    const [Roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentroleId, setCurrentroleId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');


    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', code: '' });
        setEditMode(false);
        setCurrentroleId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data.roles);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleEditClick = (role) => {
        setFormData({ name: role.name, code: role.code });
        setCurrentroleId(role._id);
        setEditMode(true);
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.name.length === 0 || formData.code.length === 0) {
            toast.error("Can't submit empty code and name!"); setOpen(false);
        }

        if (formData.name.length > 0 && formData.code.length > 0) {
            try {
                const response = editMode
                    ? await axios.put(`${backendServer}/api/roles/${currentroleId}`, formData)
                    : await axios.post(`${backendServer}/api/rolereg`, formData);
                toast.success(response.data.message);
                fetchRoles();
                resetForm();
                setOpen(false);
            } catch (error) {
                toast.error(error.response.data.message);
                resetForm();
                setOpen(false);
            }
        }
    };

    const handleDeleteClick = async (roleId) => {
        try {
            const response = await axios.delete(`${backendServer}/api/roles/${roleId}`);
            toast.success(response.data.message);
            fetchRoles();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const filteredRoles = Roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = filteredRoles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

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
                            <label htmlFor="name">Name:</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        </div>
                        <input
                            value={formData.name}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="name" id="name" />
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button className='w-full bg-[#7F55DE] p-2 text-white text-base font-medium rounded-lg'>
                            {editMode ? 'Update' : 'save'}
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
                filteredRoles.length === 0 ?
                    <div className="w-full flex items-center justify-start text-lg font-medium">
                        No records found!
                    </div> :
                    <div className="w-full flex flex-col items-center">
                        <table className='border-collapse w-full'>
                            <thead>
                                <tr className='text-gray-700 text-lg'>
                                    <th className='w-20'>Actions</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    current.map(role => (
                                        <tr key={role._id} className='text-base text-center text-gray-700'>
                                            <td className='p-2'>
                                                <div className='w-full flex items-center justify-center space-x-2'>
                                                    <FaEdit
                                                        className='text-base cursor-pointer'
                                                        onClick={() => handleEditClick(role)} />
                                                    <MdDeleteOutline
                                                        className='text-base text-red-600 cursor-pointer'
                                                        onClick={() => handleDeleteClick(role._id)} />
                                                </div>
                                            </td>
                                            <td>{role.code}</td>
                                            <td>{role.name}</td>
                                        </tr>
                                    ))
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

export default ForRoleRegistration;
