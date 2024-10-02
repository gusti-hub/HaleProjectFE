import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendServer } from '../../utils/info'
import CircularProgress from '@mui/material/CircularProgress';
import { MdEditDocument } from 'react-icons/md';
import DragNDrop from '../../components/DragNDrop';
import { Dialog } from '@material-tailwind/react';
import toast from 'react-hot-toast';

const ViewExpense = ({ id, status }) => {

    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('name');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [doc, setDoc] = useState({});

    const [saveLoader, setSaveLoader] = useState(false);

    const [formData, setFormData] = useState({
        prj: '',
        frmDate: '',
        toDate: '',
        type: '',
        amount: '',
        totalAmount: '',
        comment: '',
        imageurl: ''
    });

    const fetchExpense = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/expense/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDoc(response.data);
            setFormData({
                prj: response.data.prj,
                frmDate: response.data.frmDate,
                toDate: response.data.toDate,
                type: response.data.type,
                amount: response.data.amount,
                totalAmount: response.data.totalAmount,
                comment: response.data.comment,
                imageurl: response.data.imageUrl ? response.data.imageUrl : ''
            });
            calculateDaysDiff(response.data.frmDate, response.data.toDate);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchSales();
        fetchExpense();
    }, []);

    const [isEdit, setIsEdit] = useState(false);

    const handleCancel = async () => {
        setIsEdit(false);
        await fetchExpense();
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => { setOpen(!open) };

    const handleUpload = async () => {
        if (!selectedFile) return formData.imageurl;

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

    const handleDeletePhoto = async (url) => {
        if (!url) {
            toast.error("No image url found!");
        } else {
            setSaveLoader(true);
            try {
                await axios.put(`${backendServer}/api/delete-image`, { fileUrl: url });
                toast.success("Receipt updated!")
                setSaveLoader(false);
            } catch (error) {
                toast.error(error.response.data.message);
                setSaveLoader(false);
            }
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
                    if (formData.imageurl) {

                        await handleDeletePhoto(formData.imageurl);

                        setSaveLoader(true);

                        const uploadedUrl = await handleUpload();
                        if (uploadedUrl) {
                            uploadedImageUrl = uploadedUrl;
                        } else {
                            setSaveLoader(false);
                            return;
                        }
                    } else {
                        const uploadedUrl = await handleUpload();
                        if (uploadedUrl) {
                            uploadedImageUrl = uploadedUrl;
                        } else {
                            setSaveLoader(false);
                            return;
                        }
                    }
                }

                const response = await axios.put(`${backendServer}/api/update-expense/${id}`, {
                    prj: formData.prj,
                    frmDate: formData.frmDate,
                    toDate: formData.toDate,
                    type: formData.type,
                    amount: Number(formData.amount),
                    totalAmount: Number(daysDiff * formData.amount),
                    comment: formData.comment,
                    imageUrl: uploadedImageUrl
                });

                toast.success(response.data.message);
                setSelectedFile(null);
                setSaveLoader(false);
                setIsEdit(false);
                fetchExpense();
            } catch (error) {
                toast.error(error.response.data.message);
                setSaveLoader(false);
            }
        }
    };

    return (
        <div className="w-full flex items-center justify-start">
            {
                loading ?
                    <div className='w-full flex items-center justify-center mt-24'>
                        <CircularProgress />
                    </div> :
                    error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium mt-24">
                            Error: {error}
                        </div> :
                        <div className="w-full flex flex-col items-center justify-start p-6">
                            {
                                status === 'Draft on Approval' && <div className={`w-full flex items-center ${isEdit ? 'justify-end' : 'justify-start'}`}>
                                    {
                                        !isEdit && <button onClick={() => setIsEdit(true)}
                                            className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-800 py-1.5 px-5">
                                            <MdEditDocument className='text-xl' />
                                            <div className='text-nowrap'>Edit Expense</div>
                                        </button>
                                    }
                                    {
                                        isEdit && <div className="flex items-center justify-center gap-4">
                                            <button onClick={handleCancel}
                                                className={`bg-gray-200 hover:bg-gray-300 py-1.5 px-4 cursor-pointer'`}>Cancel</button>
                                            {
                                                saveLoader ? <div className="flex items-center justify-center px-6"><CircularProgress /></div>
                                                    : <button disabled={loading || error} onClick={handleSave}
                                                        className={`bg-[#7F55DE] py-1.5 px-5 text-white ${loading || error ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Update</button>
                                            }
                                        </div>
                                    }
                                </div>
                            }

                            <div className="w-full flex items-start justify-center p-4 gap-6 mt-2">

                                {
                                    isEdit ?
                                        <div className="w-[50%] flex flex-col items-center gap-6 text-sm">
                                            <div className="w-full text-left font-semibold">Upload receipt <span className='text-gray-500'>(Optional)</span>:</div>
                                            <DragNDrop selectedFile={selectedFile} handleSetSelectedFile={handleSetSelectedFile} />
                                            <div className="w-full flex items-center justify-start gap-1.5 text-xs">
                                                <div className="font-semibold">Uploaded receipt:</div>
                                                {
                                                    formData.imageurl ? <div onClick={handleOpen} className="text-blue-700 font-semibold cursor-pointer">View</div>
                                                        : <div className="text-xs text-gray-800">No uploaded receipt found!</div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div className='w-[50%] flex flex-col items-center justify-start gap-4'>
                                            <div className="w-full text-left font-semibold">Uploaded receipt:</div>
                                            {
                                                formData.imageurl ? <img className='w-full' src={formData.imageurl} /> :
                                                    <div className="w-full text-left text-xs text-gray-800">No uploaded receipt found!</div>
                                            }
                                        </div>
                                }

                                <Dialog
                                    size="md"
                                    open={open}
                                    handler={handleOpen}
                                    className="bg-transparent shadow-none w-full flex items-center justify-center bg-white p-4"
                                >
                                    <img className='w-full' src={formData.imageurl} alt="" />
                                </Dialog>

                                <div className="w-full flex items-start justify-between">
                                    <div className='flex flex-col items-start gap-4'>

                                        <div className="w-full flex flex-col items-start text-sm">
                                            <div className="w-full flex items-start justify-start gap-0.5">
                                                <label htmlFor="prj">Project Code:</label>
                                                <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                            </div>
                                            <select value={formData.prj} onChange={handleInputChange} disabled={!isEdit}
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
                                                <input value={formData.frmDate} onChange={handleInputChange} disabled={!isEdit}
                                                    className='-mt-1 outline-none p-1 border border-solid border-gray-300'
                                                    type="date" name="frmDate" />
                                            </div>
                                            <div className="flex flex-col items-start text-sm">
                                                <div className="flex items-start justify-start gap-0.5">
                                                    <label htmlFor="toDate">To:</label>
                                                    <sup className='mt-1 text-lg text-red-600 font-medium'>*</sup>
                                                </div>
                                                <input value={formData.toDate} onChange={handleInputChange} disabled={!formData.frmDate || !isEdit}
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
                                                <select value={formData.type} onChange={handleInputChange} disabled={!isEdit}
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
                                                <input value={formData.amount} onChange={handleInputChange} disabled={!formData.type || !isEdit}
                                                    className='-mt-1 outline-none p-1 border border-solid border-gray-300' min={0}
                                                    type="number" name="amount" />
                                            </div>
                                        </div>

                                        <div className="w-full flex flex-col items-start text-sm mt-4 gap-2">
                                            <label htmlFor="comment">Comment:</label>
                                            <textarea value={formData.comment} onChange={handleInputChange} disabled={!isEdit}
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
                        </div>
            }
        </div>
    );
};

export default ViewExpense;
