import React, { useEffect, useState } from 'react';
import { FiMinusCircle, FiSearch } from 'react-icons/fi';
import { IoMdAdd, IoMdAddCircleOutline } from 'react-icons/io';
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog } from '@material-tailwind/react';
import { MdClose, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineMoreVert } from 'react-icons/md';
import { backendServer } from '../../utils/info';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import * as XLSX from 'xlsx';

const SalesOrder = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');

    const [formData, setFormData] = useState({ name: '', desc: '', owner: name, ownerId: userId, client: '' });
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
            const response = await axios.get(`${backendServer}/api/getemployeenames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchClientsNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getclientnames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchSalesData = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/sales`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
        setFormData({ name: '', desc: '', owner: name, ownerId: userId, client: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name.length === 0 && formData.owner.length === 0 && formData.client.length === 0) {
            toast.error("Can't submit empty fields!");
            setOpen(false);
        }
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
            const response = await axios.get(`${backendServer}/api/project/${_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrProject(response.data);
            setUserList(response.data.invitedUsers);
        } catch (error) {

        }
    }

    const handleInviteMenu = async (_id) => {
        setInviteMenu(state => !state);

        await getUserListHandler(_id);
    }

    const updateInviteUser = async (name) => {
        try {
            const response = await axios.put(`${backendServer}/api/addinviteduser/${currProject._id}`, { name: name });
            toast.success(response.data.message);
            await getUserListHandler(currProject._id);
            fetchSalesData();
        } catch (error) {
            toast.error(error.message);
            await getUserListHandler(currProject._id);
        }
    }

    const removeInvitedUser = async (name) => {
        try {
            const response = await axios.put(`${backendServer}/api/removeinviteduser/${currProject._id}`, { name: name });
            toast.success(response.data.message);
            await getUserListHandler(currProject._id);
            fetchSalesData();
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

    const handleDeleteProject = async (_id) => {
        try {
            const response = await axios.delete(`${backendServer}/api/project/${_id}`);
            toast.success(response.data.message);
            fetchSalesData();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sales = allSales.filter(sale => sale.invitedUsers.includes(name));

    const filteredSales = sales.filter(sale =>
        sale.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [products, setProducts] = useState([]);

    const flattenData = (data) => {
        return data.map(item => ({
            Title: item.title,
            Item_Code: item.productDetails.code,
            Description: item.desc,
            Measuring_unit: item.productDetails.unit,
            Length: item.productDetails.len ? item.productDetails.len.toString() : '',
            Width: item.productDetails.wid ? item.productDetails.wid.toString() : '',
            Diameter: item.productDetails.dia ? item.productDetails.dia.toString() : '',
            Color: item.productDetails.color,
            Material: item.productDetails.material,
            Insert: item.productDetails.insert,
            Finish: item.productDetails.finish,
            Item_status: item.status,
        }));
    };

    const handleDownload = async (id, name) => {
        try {
            const response = await axios.get(`${backendServer}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.products);
            const prods = response.data.products.filter(prod => prod.type === "Product");

            const flattenedData = flattenData(prods);

            const worksheet = XLSX.utils.json_to_sheet(flattenedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            XLSX.writeFile(workbook, `Summary_${name}.xlsx`);
        } catch (error) {
            console.log(error);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

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
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Project Management</div>
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
                        <div className="w-full flex items-center justify-start gap-2">
                            <label htmlFor="name">Project Name:</label>
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
                            <label htmlFor="desc">Project Description:</label>
                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        </div>
                        <input
                            value={formData.desc}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="desc" id="desc" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-base">
                        <label htmlFor="client">For Client:</label>
                        <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                        <select
                            value={formData.client}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="client" id="client">
                            <option value="" disabled>Select an option</option>
                            {clients.map((client) => (
                                <option key={client.id} value={`${client.code}-${client.name}`}>{client.code}-{client.name}</option>
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
                    <div className="w-full flex flex-col items-center">
                        <table className='w-full border-collapse mt-4'>
                            <thead>
                                <tr className='text-gray-700 text-lg text-nowrap'>
                                    <th>#</th>
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
                                    currentSales.map((pdt, index) => {
                                        return (
                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                <td>{indexOfFirstItem + index + 1}</td>
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
                                                                className={`w-full text-left font-normal text-nowrap ${pdt.owner === name ? 'block' : 'hidden'}`}>Initiate</button>

                                                            <div className={`w-full h-[2px] bg-gray-300 ${pdt.owner === name ? 'block' : 'hidden'}`}></div>

                                                            <button onClick={() => handleInviteMenu(pdt._id)}
                                                                disabled={pdt.progress === "Not Started" || pdt.progress === "Request for Approval" || pdt.progress === "Approved" || pdt.progress === "Rejected" || pdt.owner != name}
                                                                className={`w-full text-left font-normal text-nowrap ${pdt.owner === name ? 'block' : 'hidden'}`}>Invite User</button>

                                                            <div className={`w-full h-[2px] bg-gray-300 ${pdt.owner === name ? 'block' : 'hidden'}`}></div>

                                                            <button onClick={() => progressButtonClick(pdt._id, "Request for Approval")}
                                                                disabled={pdt.progress === "Not Started" || pdt.progress === "Request for Approval" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                                className={`w-full text-left font-normal text-nowrap ${pdt.owner === name ? 'block' : 'hidden'}`}>Request for Approval</button>

                                                            <div className={`w-full h-[2px] bg-gray-300 ${pdt.owner === name ? 'block' : 'hidden'}`}></div>

                                                            <button onClick={() => progressButtonClick(pdt._id, "Approved")}
                                                                disabled={pdt.progress === "Not Started" || pdt.progress === "In progress" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                                className={`w-full text-left font-normal text-nowrap ${pdt.owner === name ? 'block' : 'hidden'}`}>Approve</button>

                                                            <div className={`w-full h-[2px] bg-gray-300 ${pdt.owner === name ? 'block' : 'hidden'}`}></div>

                                                            <button onClick={() => progressButtonClick(pdt._id, "Rejected")}
                                                                disabled={pdt.progress === "Not Started" || pdt.progress === "In progress" || pdt.progress === "Approved" || pdt.progress === "Rejected"}
                                                                className={`w-full text-left font-normal text-nowrap ${pdt.owner === name ? 'block' : 'hidden'}`}>Reject</button>

                                                            <div className={`w-full h-[2px] bg-gray-300 ${pdt.owner === name ? 'block' : 'hidden'}`}></div>

                                                            <button onClick={() => handleDownload(pdt._id, pdt.name)}
                                                                disabled={pdt.progress === "Not Started"}
                                                                className='w-full text-left font-normal text-nowrap'>Download Summary</button>

                                                            <div className={`w-full h-[2px] bg-gray-300 ${pdt.owner === name ? 'block' : 'hidden'}`}></div>

                                                            <button onClick={() => handleDeleteProject(pdt._id)} disabled={pdt.progress != "Not Started"}
                                                                className={`w-full text-left font-normal text-nowrap text-red-600 ${pdt.owner === name ? 'block' : 'hidden'}`}>Delete project</button>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {
                                                        pdt.progress === "Not Started" ?
                                                            <div className=''>{pdt._id}</div> :
                                                            <div className='cursor-pointer text-blue-900' onClick={() => navigate(`/project/${pdt._id}`)}>
                                                                {pdt._id}
                                                            </div>
                                                    }
                                                </td>
                                                <td>{pdt.name}</td>
                                                <td>{pdt.desc}</td>
                                                <td>{pdt.owner}</td>
                                                <td>{pdt.client.split('-')[1]}</td>
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
                                                            <div>{user} (Owner)</div> :
                                                            <div className="w-full flex items-center justify-between">
                                                                <div>{user}</div>
                                                                <FiMinusCircle onClick={() => removeInvitedUser(user)}
                                                                    className='cursor-pointer text-base' />
                                                            </div>
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
