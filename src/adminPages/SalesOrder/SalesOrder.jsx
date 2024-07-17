import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoMdAdd, IoMdAddCircleOutline } from 'react-icons/io';
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog } from '@material-tailwind/react';
import { MdClose, MdOutlineMoreVert } from 'react-icons/md';
import { backendServer } from '../../utils/info';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';

const SalesOrder = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', desc: '', owner: '', client: '' });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [clients, setClients] = useState([]);
    const [allSales, setAllSales] = useState([]);
    const [menuOpen, setMenuOpen] = useState('');
    const [inviteMenu, setInviteMenu] = useState(false);
    const [currProject, setCurrProject] = useState({});
    const [userList, setUserList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const fetchEmployeesNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getemployeenames`);
            setEmployees(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchClientsNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getclientnames`);
            setClients(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchSalesData = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/sales`);
            setAllSales(response.data.salesData);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeesNames();
        fetchClientsNames();
        fetchSalesData();
    }, []);

    const handleOpen = () => {
        setOpen((cur) => !cur);
        if (!cur) {
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', desc: '', owner: '', client: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.name.length > 0 && formData.owner.length > 0 && formData.client.length > 0) {
                const response = await axios.post(`${backendServer}/api/productreg`, formData);
                toast.success(response.data.message);
                resetForm();
                fetchSalesData();
                setOpen(false);
            }
        } catch (err) {
            toast.error(err.response.data.message)
            setError(err.message);
            fetchSalesData();
        }
    };

    const openMenu = (_id) => {
        if (menuOpen === _id) {
            setMenuOpen(null);
        } else {
            setMenuOpen(_id);
        }
    };

    const getUserListHandler = async (_id) => {
        try {
            const response = await axios.get(`${backendServer}/api/project/${_id}`);
            setCurrProject(response.data);
            setUserList(response.data.invitedUsers);
            console.log(userList);
        } catch (error) {

        }
    }

    const handleInviteMenu = async (_id) => {
        setInviteMenu(state => !state);

        await getUserListHandler(_id);
    }

    const updateInviteUser = async (name) => {
        try {
            const response = await axios.put(`${backendServer}/api//addinviteduser/${currProject._id}`, { name: name });
            toast.success(response.data.message);
            await getUserListHandler(currProject._id);
        } catch (error) {
            toast.error(error.message);
            await getUserListHandler(currProject._id);
        }
    }

    //button actions
    const progressButtonClick = async (_id, status) => {
        try {
            const response = await axios.put(`${backendServer}/api/setprogress/${_id}`, { progress: status });
            toast.success(response.data.message);
            fetchSalesData();
            setMenuOpen(null);
        } catch (error) {
            toast.error(error.response.data.message);
            console.log(error);
            setMenuOpen(null);
        }
    }

    const filteredSales = allSales.filter(sale =>
        sale.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Sales Order</div>
            <div className="w-full h-[2px] bg-gray-300"></div>

            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <form onSubmit={handleSubmit}
                    className='w-full flex flex-col items-center justify-start gap-4 bg-white p-4 text-black rounded-lg'>
                    <div className="w-full flex items-center justify-end">
                        <MdClose onClick={() => setOpen(false)}
                            className='cursor-pointer text-xl' />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="name">Project Name:</label>
                        <input
                            value={formData.name}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="name" id="name" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="desc">Project Description:</label>
                        <input
                            value={formData.desc}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="desc" id="desc" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-base">
                        <label htmlFor="owner">Project Owner:</label>
                        <select
                            value={formData.owner}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="owner" id="owner">
                            <option value="" disabled>Select an option</option>
                            {employees.map((employee) => (
                                <option key={employee.id} value={employee.name}>{employee.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-base">
                        <label htmlFor="client">For Client:</label>
                        <select
                            value={formData.client}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="client" id="client">
                            <option value="" disabled>Select an option</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.name}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full flex items-center justify-center">
                        <button onClick={handleSubmit}
                            type="button" className='w-full bg-[#7F55DE] p-2 text-white text-base font-medium rounded-lg'>
                            Create project
                        </button>
                    </div>
                </form>
            </Dialog>
            <div className="w-full flex items-center justify-between">
                <button onClick={handleOpen}
                    className='flex items-center justify-center gap-3 px-5 py-2 rounded-lg bg-[#7F55DE] text-white text-lg'>
                    <IoMdAdd className='text-xl' />
                    <div>Create</div>
                </button>
                <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                    <FiSearch className='text-xl text-gray-600 ml-2' />
                    <input value={searchQuery} onChange={handleSearchChange}
                        className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                        type="search" placeholder='Search by name'
                    />
                </div>
            </div>
            {
                filteredSales.length === 0 ?
                    <div className="w-full flex items-center justify-start text-lg font-medium mt-4">
                        No records found!
                    </div> :
                    <table className='w-full border-collapse mt-4'>
                        <thead>
                            <tr className='text-gray-700 text-lg text-nowrap'>
                                <th>Action</th>
                                <th>Project Id</th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Project Owner</th>
                                <th>Client Name</th>
                                <th>Progress</th>
                                <th>Date Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredSales.map(pdt => {
                                    return (
                                        <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                            <td>
                                                <div className="w-full flex items-start justify-center gap-2 relative">
                                                    {
                                                        menuOpen != pdt._id ?
                                                            <MdOutlineMoreVert
                                                                onClick={() => openMenu(pdt._id)}
                                                                className='cursor-pointer text-xl' />
                                                            :
                                                            <IoCloseSharp
                                                                onClick={() => openMenu(pdt._id)}
                                                                className='cursor-pointer text-xl' />
                                                    }
                                                    <div style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}
                                                        className={`${menuOpen === pdt._id ? 'block' : 'hidden'} w-[12rem] flex flex-col items-start justify-start gap-1 p-2 fixed bg-white ml-[14rem] -mt-[0.5rem]`}>

                                                        <button onClick={() => progressButtonClick(pdt._id, "In progress")}
                                                            disabled={pdt.progress === "In progress" || pdt.progress === "Request for Approval" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                            className='font-normal text-nowrap'>Initiate</button>

                                                        <div className="w-full h-[2px] bg-gray-300"></div>

                                                        <button onClick={() => handleInviteMenu(pdt._id)}
                                                            disabled={pdt.progress === "Not Started" || pdt.progress === "Request for Approval" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                            className='font-normal text-nowrap'>Invite User</button>

                                                        <div className="w-full h-[2px] bg-gray-300"></div>

                                                        <button onClick={() => progressButtonClick(pdt._id, "Request for Approval")}
                                                            disabled={pdt.progress === "Not Started" || pdt.progress === "Request for Approval" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                            className='font-normal text-nowrap'>Request for Approval</button>

                                                        <div className="w-full h-[2px] bg-gray-300"></div>

                                                        <button onClick={() => progressButtonClick(pdt._id, "Approved")}
                                                            disabled={pdt.progress === "Not Started" || pdt.progress === "In progress" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                            className='font-normal text-nowrap'>Approve</button>

                                                        <div className="w-full h-[2px] bg-gray-300"></div>

                                                        <button onClick={() => progressButtonClick(pdt._id, "Rejected")}
                                                            disabled={pdt.progress === "Not Started" || pdt.progress === "In progress" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                            className='font-normal text-nowrap'>Reject</button>

                                                        <div className="w-full h-[2px] bg-gray-300"></div>

                                                        <button disabled={pdt.progress === "Not Started"}
                                                            className='font-normal text-nowrap'>Download Summary</button>

                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='cursor-pointer text-blue-900' onClick={() => navigate(`/project/${pdt._id}`)}>
                                                    {pdt._id}
                                                </div>
                                            </td>
                                            <td>{pdt.name}</td>
                                            <td>{pdt.desc}</td>
                                            <td>{pdt.owner}</td>
                                            <td>{pdt.client}</td>
                                            <td>
                                                {
                                                    pdt.progress === "Not Started" ?
                                                        <div className='p-1 bg-blue-gray-50 text-gray-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                        pdt.progress === "In progress" ?
                                                            <div className='p-1 bg-orange-50 text-orange-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                            pdt.progress === "Request for Approval" ?
                                                                <div className='p-1 bg-blue-50 text-blue-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                                pdt.progress === "Approved" ?
                                                                    <div className='p-1 bg-green-50 text-green-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                                    pdt.progress === "Rejected" ?
                                                                        <div className='p-1 bg-red-50 text-red-700 rounded-3xl font-medium'>{pdt.progress}</div> : ""
                                                }
                                            </td>
                                            <td>{pdt.createdAt.split('T')[0]}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
            }

            <Dialog
                size="sm"
                open={inviteMenu}
                handler={handleInviteMenu}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <div className="w-full flex items-center justify-center bg-white p-2 rounded-lg">
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr className='text-gray-700'>
                                <th>Listed Users</th>
                                <th>Invited Users</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="w-full flex flex-col items-start justify-start gap-1.5">
                                        {
                                            employees
                                                .filter(employee => !userList.includes(employee.name))
                                                .length === 0 ? (
                                                <div>All users are added!</div>
                                            ) : (
                                                employees
                                                    .filter(employee => !userList.includes(employee.name))
                                                    .map((employee) => {
                                                        return (
                                                            <div key={employee._id} className="w-full flex items-center justify-between">
                                                                <div>{employee.name}</div>
                                                                <IoMdAddCircleOutline onClick={() => updateInviteUser(employee.name)}
                                                                    className='cursor-pointer text-lg' />
                                                            </div>
                                                        )
                                                    })
                                            )
                                        }

                                    </div>
                                </td>
                                <td>
                                    <div className="w-full flex flex-col items-start justify-start">
                                        <div className="w-full flex flex-col items-start justify-start gap-1.5">
                                            {
                                                userList.map(user => {
                                                    return (
                                                        currProject.owner === user ?
                                                            <div>{user} (Owner)</div> : <div>{user}</div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Dialog>

        </div>
    );
};

export default SalesOrder;
