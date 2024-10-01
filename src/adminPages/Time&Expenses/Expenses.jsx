import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import toast from 'react-hot-toast';
import DragNDrop from '../../components/DragNDrop';
import { FaCamera } from 'react-icons/fa';
import { Dialog } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';

const Expenses = () => {

    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('name');

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [saveLoader, setSaveLoader] = useState(false);

    const [formData, setFormData] = useState({
        prj: '',
        frmDate: '',
        toDate: '',
        type: '',
        amount: '',
        totalAmount: '',
        comment: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);

    const handleSetSelectedFile = (file) => {
        setSelectedFile(file);
    };

    const [daysDiff, setDaysDiff] = useState(0);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        if (name === "frmDate" || name === "toDate") {
            const updatedFormData = { ...formData, [name]: value };
            const { frmDate, toDate } = updatedFormData;

            if (frmDate && toDate && new Date(toDate) < new Date(frmDate)) {
                toast.error('The "To" date cannot be earlier than the "From" date.');
                setFormData((prevData) => ({ ...prevData, toDate: '' }));
                setDaysDiff(0);
            } else {
                if (frmDate && toDate) {
                    calculateDaysDiff(frmDate, toDate);
                }
            }
        }
    };

    const calculateDaysDiff = (frmDate, toDate) => {
        const startDate = new Date(frmDate);
        const endDate = new Date(toDate);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const timeDiff = endDate - startDate;
        const days = timeDiff / (1000 * 60 * 60 * 24);

        setDaysDiff(days);
    };

    const resetForm = () => {
        setFormData({
            prj: '',
            frmDate: '',
            toDate: '',
            type: '',
            amount: '',
            totalAmount: '',
            comment: ''
        });
        setDaysDiff(0);
        setError(null);
        setSelectedFile(null);
        setSaveLoader(false);
    };

    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/sales`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSales(response.data.salesData.filter(sale => sale.invitedUsers.includes(loggedInUser)));
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const [teDocsLen, setTEDocsLen] = useState(0);

    const fetchTEDocs = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/te-docs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTEDocsLen(response.data.length);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
        fetchTEDocs();
    }, []);

    const handleUpload = async () => {
        if (!selectedFile) return imageUrl;

        const uploadData = new FormData();
        uploadData.append('image', selectedFile);

        try {
            const response = await axios.post(`${backendServer}/api/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
            return null;
        }
    };

    const handleSave = async () => {

        setSaveLoader(true);

        if (!formData.prj || !formData.frmDate || !formData.toDate || !formData.type || !formData.amount) {
            toast.error("Please fill all the mandatory details.");
            setSaveLoader(false);
        } else {
            try {
                let uploadedImageUrl = '';

                if (selectedFile) {
                    const uploadedUrl = await handleUpload();
                    if (uploadedUrl) {
                        uploadedImageUrl = uploadedUrl;
                    } else {
                        setSaveLoader(false);
                        return;
                    }
                }

                const response = await axios.post(`${backendServer}/api/add-expense`, {
                    prj: formData.prj,
                    frmDate: formData.frmDate,
                    toDate: formData.toDate,
                    type: formData.type,
                    amount: Number(formData.amount),
                    totalAmount: Number(daysDiff * formData.amount),
                    comment: formData.comment,
                    imageUrl: uploadedImageUrl,
                    docid: `TE-00${teDocsLen + 1}` , 
                    user: loggedInUser
                });

                toast.success(response.data.message);
                resetForm();
                setSaveLoader(false);
                navigate("/admin-panel");
                handleMenuID(10);
            } catch (error) {
                toast.error(error.response.data.message);
                setSaveLoader(false);
            }
        }
    };

	const handleCancel = () => {
		navigate("/admin-panel");
		handleMenuID(10);
	};

    return (
        <div className="w-full flex flex-col items-center justify-start gap-2 p-4 pb-0">
            <div className="w-full flex items-center justify-between px-4 pb-4" style={{ boxShadow: "0px 6px 4px -3px rgba(201,195,201,1)" }}>
                <div className="text-gray-900 text-2xl font-medium">Expenses</div>
                <div className="flex items-center justify-center gap-4">
                    <button onClick={handleCancel}
                        className={`bg-gray-200 hover:bg-gray-300 py-1.5 px-4 cursor-pointer'`}>Cancel</button>
                    {
                        saveLoader ? <div className="flex items-center justify-center px-4"><CircularProgress /></div> :
                            <button disabled={loading || error} onClick={handleSave}
                                className={`bg-[#7F55DE] py-1.5 px-5 text-white ${loading || error ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Save</button>
                    }
                </div>
            </div>

            {

                loading ? <div className='w-full flex items-center justify-center mt-16'><CircularProgress /></div> :
                    error ? <div className="w-full flex items-center justify-center text-red-600 font-medium mt-16">Error: {error}</div> :
                        <div className="w-full flex items-start justify-center p-4 gap-6 mt-2">

                            <div className="w-[50%] flex flex-col items-center gap-6 text-sm">
                                <div className="w-full text-left font-semibold">Upload receipt <span className='text-gray-500'>(Optional)</span>:</div>
                                <DragNDrop selectedFile={selectedFile} handleSetSelectedFile={handleSetSelectedFile} />
                            </div>

                            <div className="w-full flex items-start justify-between">
                                <div className='flex flex-col items-start gap-4'>

                                    <div className="w-full flex flex-col items-start text-sm">
                                        <div className="w-full flex items-start justify-start gap-0.5">
                                            <label htmlFor="prj">Project Code:</label>
                                            <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                        </div>
                                        <select value={formData.prj} onChange={handleInputChange}
                                            name="prj" className='w-[30rem] outline-none p-2 border border-solid border-gray-300 -mt-1'>
                                            <option value="" disabled>Select an option</option>
                                            {sales.map((sale) => (
                                                <option key={sale._id} value={`${sale.code}-${sale.name}`}>{sale.code}-{sale.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full flex items-center justify-start gap-6">
                                        <div className="flex flex-col items-start text-sm">
                                            <div className="flex items-start justify-start gap-0.5">
                                                <label htmlFor="frmDate">From:</label>
                                                <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                            </div>
                                            <input value={formData.frmDate} onChange={handleInputChange}
                                                className='-mt-1 outline-none p-1 border border-solid border-gray-300'
                                                type="date" name="frmDate" />
                                        </div>
                                        <div className="flex flex-col items-start text-sm">
                                            <div className="flex items-start justify-start gap-0.5">
                                                <label htmlFor="toDate">To:</label>
                                                <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                            </div>
                                            <input value={formData.toDate} onChange={handleInputChange} disabled={!formData.frmDate}
                                                className='-mt-1 outline-none p-1 border border-solid border-gray-300'
                                                type="date" name="toDate" />
                                        </div>
                                        <div className="flex flex-col items-start text-sm gap-2.5">
                                            <div>Number of days:</div>
                                            <div className='w-[8rem] p-1 border border-solid border-gray-300'>{daysDiff}</div>
                                        </div>
                                    </div>

                                    <div className="w-full h-[2px] bg-gray-200 my-2"></div>

                                    <div className="flex items-center justify-start gap-8">
                                        <div className="flex flex-col items-start text-sm">
                                            <div className="w-full flex items-start justify-start gap-0.5">
                                                <label htmlFor="type">Allowance Type:</label>
                                                <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                            </div>
                                            <select value={formData.type} onChange={handleInputChange}
                                                name="type" className='w-[15rem] outline-none p-2 border border-solid border-gray-300 -mt-1'>
                                                <option value="" disabled>Select an option</option>
                                                <option value="travel">Travel Allowance</option>
                                                <option value="shift">Shift Allowance</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col items-start text-sm">
                                            <div className="w-full flex items-start justify-start gap-0.5">
                                                <label htmlFor="amount">Allowance amount ($):</label>
                                                <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                            </div>
                                            <input value={formData.amount} onChange={handleInputChange} disabled={!formData.type}
                                                className='-mt-1 outline-none p-1 border border-solid border-gray-300' min={0}
                                                type="number" name="amount" />
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col items-start text-sm mt-4 gap-2">
                                        <label htmlFor="comment">Comment:</label>
                                        <textarea value={formData.comment} onChange={handleInputChange}
                                            className='w-full outline-none p-1 border border-solid border-gray-300'
                                            name="comment" rows="2"></textarea>
                                    </div>

                                </div>

                                <div className="flex items-end justify-center gap-4">
                                    <div className="text-sm">Final Amount:</div>
                                    <div className='w-[10rem] text-end text-base font-medium text-gray-700 bg-gray-100 py-1 px-2 border border-solid border-gray-300'>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(daysDiff * Number(formData.amount))}
                                    </div>
                                </div>

                            </div>

                        </div>
            }

        </div>
    );
};

export default Expenses;
