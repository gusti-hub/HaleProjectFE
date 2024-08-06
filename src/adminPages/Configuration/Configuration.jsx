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

const Configuration = () => {
    const [ConfigurationType, setConfigurationType] = useState([]);
    const [configuration, setConfiguration] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ type: '', code: '', name: '' });
    const [editMode, setEditMode] = useState(false);
    const [currentconfigurationId, setCurrentconfigurationId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem('token');


    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ type: '', code: '', name: '' });
        setEditMode(false);
        setCurrentconfigurationId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchConfigurationType = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/configuration/type`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConfigurationType(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchConfiguration = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/configuration`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConfiguration(response.data.configuration);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditClick = (configuration) => {
        setFormData({ type: configuration.type, code: configuration.code, name: configuration.name });
        setCurrentconfigurationId(configuration._id);
        setEditMode(true);
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (formData.type.length === 0 || formData.code.length === 0 || formData.name.length === 0) {
            toast.error("Can't submit empty configuration type, code, name!"); setOpen(false);
        }
        if (formData.type.length > 0 && formData.code.length > 0 && formData.name.length > 0) {
            try {
                const response = editMode
                    ? await axios.put(`${backendServer}/api/configuration/${currentconfigurationId}`, formData, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    : await axios.post(`${backendServer}/api/configuration`, formData, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                toast.success(response.data.message);
                fetchConfiguration();
                resetForm();
                setOpen(false);
            } catch (error) {
                toast.error(error.response.data.message);
                resetForm();
                setOpen(false);
            }
        }
    };

    const handleDeleteClick = async (id) => {
        try {
            const response = await axios.delete(`${backendServer}/api/configuration/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success(response.data.message);
            fetchConfiguration();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchConfiguration();
        fetchConfigurationType();
    }, []);

    const filteredConfiguration = configuration.filter(configuration =>
        configuration.type.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Configuration</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
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
                                <label htmlFor="code">Configuration Type:</label>
                                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                            </div>
                            <select
                                value={formData.type}
                                onChange={handleInputChange}
                                className='w-full border-b-2 border-solid border-black p-2 outline-none'
                                name="type"
                                id="id"
                            >
                                <option value="">Select configuration...</option>
                                {ConfigurationType.map(option => (
                                    <option key={option.id} value={option.name}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div> 
                        <div className="w-full flex flex-col items-start gap-1 text-base">
                            <div className="w-full flex items-center justify-start gap-2">
                                <label htmlFor="code">Configuration Code:</label>
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
                                <label htmlFor="name">Configuration Name:</label>
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
                            type="search" placeholder='Search by type' />
                    </div>
                    <button onClick={handleOpen}
                        className='flex items-center justify-center gap-3 px-5 py-2 rounded-lg bg-[#7F55DE] text-white text-lg'>
                        <IoPersonAdd className='text-base' />
                        <div>ADD</div>
                    </button>
                </div>

                {
                    filteredConfiguration.length === 0 ?
                        <div className="w-full flex items-center justify-start text-lg font-medium">
                            No records found!
                        </div> :
                        <table className='border-collapse w-full'>
                            <thead>
                                <tr className='text-gray-700 text-lg'>
                                    <th className='w-20'>Actions</th>
                                    <th>Type</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredConfiguration.map(configuration => (
                                        <tr key={configuration._id} className='text-base text-center text-gray-700'>
                                            <td className='p-2'>
                                                <div className='w-full flex items-center justify-center space-x-2'>
                                                    <FaEdit
                                                        className='text-base cursor-pointer'
                                                        onClick={() => handleEditClick(configuration)} />
                                                    <MdDeleteOutline
                                                        className='text-base text-red-600 cursor-pointer'
                                                        onClick={() => handleDeleteClick(configuration._id)} />
                                                </div>
                                            </td>
                                            <td>{configuration.type}</td>
                                            <td>{configuration.code}</td>
                                            <td>{configuration.name}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                }
            </div>
        </div>
    );
};

export default Configuration;
