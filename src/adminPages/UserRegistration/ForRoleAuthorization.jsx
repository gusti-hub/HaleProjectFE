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

const ForRoleAuthorization = () => {
    const [AuthorizationRoles, setAuthorizationRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ role_name: '', role_id: '', role_code: '', action_name: '', action_id: ''  });
    const [editMode, setEditMode] = useState(false);
    const [currentroleId, setCurrentroleId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');


    const handleOpen = () => {
        setOpen(!open);
        if (!open) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ role_name: '', role_id: '', role_code: '', action_name: '', action_id: '' });
        setEditMode(false);
        setCurrentroleId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if(name == 'action_name'){
            setFormData({ ...formData, action_id: actions.find(item => item.name == value).id, [name]: value });
        }

        if(name == 'role_name'){
            setFormData({ ...formData, role_id: roles.find(item => item.name == value)._id, role_code: roles.find(item => item.name == value).code, [name]: value });
        }
    };

    const fetchAuthorizationRoles = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/authorizationRole`);
            setAuthorizationRoles(response.data.authorizationRoles);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/roles`);
            setRoles(response.data.roles);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchActions = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/actions`);
            setActions(response.data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleEditClick = (role) => {
        setFormData({ role_name: role.role_name, role_id: role.role_id, role_code: role.role_code , action_name: role.action_name, action_id: role.action_id});
        setCurrentroleId(role._id);
        setEditMode(true);
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.role_name.length === 0 || formData.action_name.length === 0) {
            toast.error("Can't submit empty role and action!"); setOpen(false);
        }
        if (formData.role_name.length > 0 && formData.action_name.length > 0) {
            try {
                const response = editMode
                    ? await axios.put(`${backendServer}/api/authorizationRole/${currentroleId}`, formData)
                    : await axios.post(`${backendServer}/api/authorizationRole`, formData);
                toast.success(response.data.message);
                fetchAuthorizationRoles();
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
            const response = await axios.delete(`${backendServer}/api/authorizationRole/${id}`);
            toast.success(response.data.message);
            fetchAuthorizationRoles();
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchAuthorizationRoles();
        fetchRoles();
        fetchActions();
    }, []);

    const filteredAuthorizationRoles = AuthorizationRoles.filter(role =>
        role.role_name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                    <div className="w-full flex items-center justify-start gap-2">
                        <label htmlFor="action">Action:</label>
                        <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                    </div>
                        <select
                            value={formData.action_name}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            name="action_name"
                            id="action_id"
                        >
                            <option value="">Select action...</option>
                            {actions.map(option => (
                                <option key={option.id} value={option.name}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
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
                        type="search" placeholder='Search by Role' />
                </div>
                <button onClick={handleOpen}
                    className='flex items-center justify-center gap-3 px-5 py-2 rounded-lg bg-[#7F55DE] text-white text-lg'>
                    <IoPersonAdd className='text-base' />
                    <div>ADD</div>
                </button>
            </div>

            {
                filteredAuthorizationRoles.length === 0 ?
                    <div className="w-full flex items-center justify-start text-lg font-medium">
                        No records found!
                    </div> :
                    <table className='border-collapse w-full'>
                        <thead>
                            <tr className='text-gray-700 text-lg'>
                                <th className='w-20'>Actions</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredAuthorizationRoles.map(role => (
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
                                        <td>{role.role_name}</td>
                                        <td>{role.action_name}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </div>
    );
};

export default ForRoleAuthorization;
