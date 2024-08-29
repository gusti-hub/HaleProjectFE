import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';

const Out = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        prj: '',
        reason: ''
    });

    const resetForm = () => {
        setFormData({
            prj: '',
            reason: ''
        });
    };

    const [outDocs, setOutDocs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handlePrjInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setSelectedProducts([]);
    };

    const [addModal, setAddModal] = useState(false);

    const [modalLoader, setModalLoader] = useState(true);
    const [modalError, setModalError] = useState(null);

    const [sales, setSales] = useState([]);

    const handleAddModal = () => {
        setAddModal(curr => !curr);
        setModalLoader(true);
        setModalError(null);
        setAddPdtError(null);
        setSelectedProducts([]);
        setIsAddPdt(false);
        resetForm();
        fetchSalesNames();
        setZeroQty(false);
        setQty({});
    };

    const fetchSalesNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/sales-name`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSales(response.data);
            setModalLoader(false);
        } catch (error) {
            setModalError(error.response.data.message);
            setModalLoader(false);
        }
    };

    const [addPdtLoader, setAddPdtLoader] = useState(true);
    const [addPdtError, setAddPdtError] = useState(null);

    const [addPdts, setAddPdts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleCheckboxChange = (product) => {
        setSelectedProducts((prevSelectedProducts) => {
            if (prevSelectedProducts.some(p => p._id === product._id)) {
                return prevSelectedProducts.filter((p) => p._id !== product._id);
            } else {
                return [...prevSelectedProducts, product];
            }
        });
    };

    const [qty, setQty] = useState({});

    const handleQtyChange = (e, id, totQty) => {
        const value = e.target.value;
        if (value >= 0 && value <= totQty) {
            setQty(prevQty => ({
                ...prevQty,
                [id]: value
            }));
        } else if (value < 0) {
            setQty(prevQty => ({
                ...prevQty,
                [id]: '0'
            }))
        } else {
            setQty(prevQty => ({
                ...prevQty,
                [id]: totQty
            }));
        }
    };

    const fetchProjPdts = async (_id) => {
        try {
            const response = await axios.get(`${backendServer}/api/findProducts-out/${_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAddPdts(response.data.filter(pdt => pdt.type === 'Product' && pdt.totQty != 0));
            setAddPdtLoader(false);
        } catch (error) {
            setAddPdtError(error.response.data.message);
            setAddPdtLoader(false);
        }
    };

    const fetchOutDocs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendServer}/api/outDocs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOutDocs(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const [isAddPdt, setIsAddPdt] = useState(false);

    const handleAddPdts = (prjId) => {
        setIsAddPdt(true);
        setAddPdtLoader(true);
        fetchProjPdts(prjId);
        setZeroQty(false);
    };

    const createProductsArray = (products) => {
        return products.map(product => ({
            pdtid: product._id,
            qty: Number(qty[product._id])
        }));
    };

    const [zeroQty, setZeroQty] = useState(false);

    const [saveLoader, setSaveLoader] = useState(false);

    const handleSaveOutDoc = async () => {

        setSaveLoader(true);

        try {
            const array = createProductsArray(selectedProducts);

            const inavlidArray = array.filter(pdt => pdt.qty <= 0 || isNaN(pdt.qty));

            if (inavlidArray.length > 0) {
                setZeroQty(true);
                setSaveLoader(false);
            } else {
                const response = await axios.put(`${backendServer}/api/updateOutDoc`, {
                    array,
                    docNum: `OUT-00${outDocs.length + 1}`,
                    projectId: formData.prj,
                    reason: formData.reason,
                    products: array
                });
                toast.success(response.data.message);
                fetchOutDocs();
                handleAddModal();
                setSaveLoader(false);
            }
        } catch (error) {
            toast.error("Can't update the inventory. Try again later.")
            handleAddModal();
            setSaveLoader(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredDocs = outDocs.filter(doc =>
        doc.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDocs = filteredDocs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [viewModal, setViewModal] = useState(false);
    const [viewLoader, setViewLoader] = useState(false);
    const [viewError, setViewError] = useState(null);
    const [viewPdts, setViewPdts] = useState([]);
    const [viewDocDetails, setViewDocDetails] = useState({
        docNum: '',
        projectName: ''
    });

    const fetchViewDoc = async (_id) => {
        setViewLoader(true);

        try {
            const response = await axios.get(`${backendServer}/api/viewOutDoc/${_id}`);
            setViewPdts(response.data);
            setViewLoader(false);
        } catch (error) {
            setViewError(error.response.data.message);
            setViewLoader(false);
        }
    };

    const handleViewModal = async (_id, num, prj) => {
        setViewModal(curr => !curr);
        setViewError(null);
        setViewLoader(false);
        setViewDocDetails({
            docNum: num,
            projectName: prj
        });
        await fetchViewDoc(_id);
    };

    useEffect(() => {
        fetchOutDocs();
    }, []);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full min-h-screen flex flex-col items-center justify-start border-[0.75rem] border-solid border-[#DCD8FF] rounded-lg">
                <div className="w-full flex items-center justify-start p-6 bg-[#F8F9FD] gap-6">
                    <div onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-[50%] bg-[#7F55DE] p-2 cursor-pointer">
                        <IoArrowBack className='text-white text-2xl' />
                    </div>
                    <img className={`w-[6rem]`} src="../images/logoBlue.png" alt="Logo" />
                </div>

                <div className="w-full flex flex-col items-center p-8 gap-4">
                    <div className="w-full text-left text-gray-900 text-2xl font-medium">Inventory (OUT)</div>
                    <div className="w-full h-[2px] bg-gray-300"></div>

                    {
                        loading ?
                            <div className='w-full flex items-center justify-center my-4'> <CircularProgress /> </div> :
                            error ?
                                <div className="w-full flex items-center justify-center text-red-600 font-medium my-4"> Error: {error} </div> :
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="w-full flex items-center justify-start">
                                        <button onClick={handleAddModal} className='w-20 px-5 py-2 rounded-md bg-[#7F55DE] text-white text-lg'>ADD</button>
                                    </div>
                                    {
                                        outDocs.length != 0 &&
                                        <div className="w-full flex items-center justify-end">
                                            <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                                                <FiSearch className='text-xl text-gray-600 ml-2' />
                                                <input value={searchQuery} onChange={handleSearchChange}
                                                    className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                                                    type="search" placeholder='Search by Project Name'
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        filteredDocs.length === 0 ?
                                            <div className="w-full flex items-center justify-start text-lg font-medium">
                                                No OUT document found!
                                            </div> :
                                            <div className="w-full flex flex-col items-center">
                                                <table className='w-full border-collapse'>
                                                    <thead>
                                                        <tr className='text-gray-700 text-lg text-nowrap'>
                                                            <th>View Document</th>
                                                            <th>Document Number</th>
                                                            <th>Project Name</th>
                                                            <th>Reason</th>
                                                            <th>Date Created</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentDocs.map((doc) => {
                                                                return (
                                                                    <tr key={doc._id} className='text-base text-center text-gray-700'>
                                                                        <td>
                                                                            <div className="flex items-center justify-center">
                                                                                <FaEye onClick={() => handleViewModal(doc._id, doc.docNum, doc.projectName)} className='text-xl cursor-pointer' />
                                                                            </div>
                                                                        </td>
                                                                        <td>{doc.docNum}</td>
                                                                        <td>{doc.projectName}</td>
                                                                        <td>{doc.reason}</td>
                                                                        <td>{doc.createdAt.split('T')[0]}</td>
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

                    }


                    {/* View Doc */}
                    <Dialog
                        size='lg'
                        open={viewModal}
                        handler={handleViewModal}
                        className="bg-transparent shadow-none w-full flex items-center justify-center"
                    >
                        <div className="w-full flex items-center justify-center bg-white text-black p-3 rounded-lg">
                            {
                                viewLoader ?
                                    <div className='w-full flex items-center justify-center my-4'> <CircularProgress /> </div> :
                                    viewError ?
                                        <div className="w-full flex items-center justify-center text-red-600 font-medium my-4"> Error: {viewError} </div> :
                                        <div className="w-full flex flex-col items-center gap-4">
                                            <div className="w-full flex flex-col items-center gap-1">
                                                <div className="w-full text-left"><span className='font-semibold'>Document Number: </span>{viewDocDetails.docNum}</div>
                                                <div className="w-full text-left"><span className='font-semibold'>Project Name: </span>{viewDocDetails.projectName}</div>
                                            </div>
                                            <div className="w-full flex items-start justify-start max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                                <table className='w-full border-collapse mt-4'>
                                                    <thead>
                                                        <tr className='text-gray-700 text-lg text-nowrap'>
                                                            <th>Product Name</th>
                                                            <th>Image</th>
                                                            <th>Specification</th>
                                                            <th>Out Quantity</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            viewPdts.map(pdt => {
                                                                return (
                                                                    <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                        <td>{pdt.title}</td>
                                                                        <td>
                                                                            <div className="flex items-center justify-center">
                                                                                <img className='w-[10rem]' src={pdt.imageUrl} alt="" />
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div className="flex flex-col items-start">
                                                                                {pdt.productDetails.len ? <div><span className='font-semibold'>L:</span> {pdt.productDetails.len} {pdt.productDetails.unit}</div> : ''}
                                                                                {pdt.productDetails.wid ? <div><span className='font-semibold'>W:</span> {pdt.productDetails.wid} {pdt.productDetails.unit}</div> : ''}
                                                                                {pdt.productDetails.dia ? <div><span className='font-semibold'>Dia:</span> {pdt.productDetails.dia} {pdt.productDetails.unit}</div> : ''}
                                                                            </div>
                                                                        </td>
                                                                        <td>{pdt.outQty}</td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                            }
                        </div>
                    </Dialog>


                    {/* Add Doc */}
                    <Dialog
                        size={isAddPdt ? 'md' : 'lg'}
                        open={addModal}
                        handler={handleAddModal}
                        className="bg-transparent shadow-none w-full flex items-center justify-center"
                    >
                        {
                            isAddPdt ?
                                <div className="w-full flex items-center justify-center bg-white text-black p-3 rounded-lg">
                                    {
                                        addPdtLoader ?
                                            <div className='w-full flex items-center justify-center my-4'> <CircularProgress /> </div> :
                                            addPdtError ?
                                                <div className="w-full flex items-center justify-center text-red-600 font-medium my-4"> Error: {addPdtError} </div> :
                                                <div className="w-full flex flex-col items-center gap-4">
                                                    <div className="w-full flex items-center justify-end">
                                                        <button onClick={() => setIsAddPdt(false)}
                                                            className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                            {addPdts.length != 0 ? 'Save' : 'Close'}
                                                        </button>
                                                    </div>
                                                    <div className="w-full flex flex-col items-center gap-4 max-h-[30rem] overflow-y-scroll scroll-smooth text-black" style={{ scrollbarWidth: 'thin' }}>
                                                        {
                                                            addPdts.length === 0 ?
                                                                <div className="w-full text-left text-lg font-medium">
                                                                    No product found!
                                                                </div>
                                                                :
                                                                addPdts.map(pdt => {
                                                                    return (
                                                                        <div key={pdt._id} className="w-full flex items-center justify-center gap-2">
                                                                            <input type="checkbox"
                                                                                checked={selectedProducts.some(p => p._id === pdt._id)}
                                                                                onChange={() => handleCheckboxChange(pdt)} />
                                                                            <div className="w-full flex items-start justify-center bg-[#F8F9FD] p-2 rounded-lg">
                                                                                <div className="w-full flex flex-col items-center gap-2">
                                                                                    <div className="w-full text-left font-semibold">{pdt.title} ({pdt.productDetails.code})</div>
                                                                                    <div className="w-full flex items-center justify-center">
                                                                                        <img className='max-w-[10rem]' src={pdt.imageUrl} alt="" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="w-full flex flex-col items-start justify-start gap-1">
                                                                                    {pdt.productDetails.len ? <div><span className='font-semibold'>L:</span> {pdt.productDetails.len} {pdt.productDetails.unit}</div> : ''}
                                                                                    {pdt.productDetails.wid ? <div><span className='font-semibold'>W:</span> {pdt.productDetails.wid} {pdt.productDetails.unit}</div> : ''}
                                                                                    {pdt.productDetails.dia ? <div><span className='font-semibold'>Dia:</span> {pdt.productDetails.dia} {pdt.productDetails.unit}</div> : ''}
                                                                                    {
                                                                                        pdt.productDetails.color ?
                                                                                            <div className="w-full flex items-center justify-start gap-2">
                                                                                                <div className='font-semibold'>Color:</div>
                                                                                                <div className="flex items-center justify-center gap-2">
                                                                                                    <div className={`w-7 h-5 rounded-sm`} style={{ backgroundColor: pdt.productDetails.color }}></div>
                                                                                                    <div>{pdt.productDetails.color}</div>
                                                                                                </div>
                                                                                            </div> : ''
                                                                                    }
                                                                                    {pdt.productDetails.material ? <div><span className='font-semibold'>Material:</span> {pdt.productDetails.material}</div> : ''}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                        }
                                                    </div>
                                                </div>
                                    }
                                </div>
                                :
                                <div className="w-full flex items-center justify-center bg-white text-black p-3 rounded-lg">
                                    {
                                        modalLoader ?
                                            <div className='w-full flex items-center justify-center my-4'> <CircularProgress /> </div> :
                                            modalError ?
                                                <div className="w-full flex items-center justify-center text-red-600 font-medium my-4"> Error: {modalError} </div> :
                                                <div className="w-full flex flex-col items-center gap-4">
                                                    <form className="w-full flex flex-col items-center text-black gap-2">
                                                        <div className="w-full flex items-center justify-start gap-2 text-base">
                                                            <label className='font-semibold' htmlFor="prj">Project:</label>
                                                            <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                                            <select
                                                                value={formData.prj}
                                                                onChange={handlePrjInputChange}
                                                                className='p-1 outline-none' name="prj" id="prj">
                                                                <option value="" disabled>Select an option</option>
                                                                {sales.map((sale) => (
                                                                    <option key={sale._id} value={sale._id}>{sale.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-full flex items-start justify-start gap-2 text-base">
                                                            <label className='font-semibold' htmlFor="reason">Reason:</label>
                                                            <textarea
                                                                value={formData.reason}
                                                                onChange={handleInputChange}
                                                                className='w-full border-2 border-solid border-gray-300 outline-none rounded-md p-2'
                                                                name="reason" id="reason" rows="3" placeholder='Type here...'></textarea>
                                                        </div>
                                                    </form>
                                                    {
                                                        formData.prj && <div className="w-full flex items-center justify-end">
                                                            <button onClick={() => handleAddPdts(formData.prj)} className='px-5 py-2 rounded-md bg-[#7F55DE] text-white'>
                                                                {selectedProducts.length === 0 ? 'Add' : 'Edit'} Product(s)
                                                            </button>
                                                        </div>
                                                    }
                                                    {
                                                        formData.prj &&
                                                        <div className="w-full flex items-center justify-center">
                                                            {
                                                                selectedProducts.length === 0 ?
                                                                    <div className="w-full text-left font-medium">No product is added!</div>
                                                                    :
                                                                    <div className="w-full flex items-start justify-center max-h-[20rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                                                        <table className='w-full border-collapse mt-2'>
                                                                            <thead>
                                                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                                                    <th>Product Name</th>
                                                                                    <th>Image</th>
                                                                                    <th>Specification</th>
                                                                                    <th>Available Quantity</th>
                                                                                    <th>Out Quantity</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {
                                                                                    selectedProducts.map(pdt => {
                                                                                        return (
                                                                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                                                <td>{pdt.title}</td>
                                                                                                <td>
                                                                                                    <div className="w-full flex items-center justify-center">
                                                                                                        <img className='max-w-[10rem]' src={pdt.imageUrl} alt="" />
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>
                                                                                                    <div className="w-full flex flex-col items-start justify-start gap-1">
                                                                                                        {pdt.productDetails.len ? <div><span className='font-semibold'>L:</span> {pdt.productDetails.len} {pdt.productDetails.unit}</div> : ''}
                                                                                                        {pdt.productDetails.wid ? <div><span className='font-semibold'>W:</span> {pdt.productDetails.wid} {pdt.productDetails.unit}</div> : ''}
                                                                                                        {pdt.productDetails.dia ? <div><span className='font-semibold'>Dia:</span> {pdt.productDetails.dia} {pdt.productDetails.unit}</div> : ''}
                                                                                                    </div>
                                                                                                </td>
                                                                                                <td>{pdt.totQty}</td>
                                                                                                <td>
                                                                                                    <div className="flex items-center justify-center">
                                                                                                        <input
                                                                                                            value={qty[pdt._id] || ''}
                                                                                                            onChange={(e) => handleQtyChange(e, pdt._id, pdt.totQty)}
                                                                                                            className={`w-[4rem] p-2 py-1 outline-none bg-[#F8F9FD] 
                                                                                ${qty[pdt._id] <= 0 ? 'border border-solid border-red-600' : 'border-none'}`}
                                                                                                            placeholder='1'
                                                                                                            min={1}
                                                                                                            type="number"
                                                                                                            name="qty"
                                                                                                        />
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                            }
                                                        </div>
                                                    }

                                                    {
                                                        zeroQty && <div className="w-full text-left text-xs text-red-600 italic mt-2">
                                                            Cannot update: Quantity cannot be less than or equals to zero or null!
                                                        </div>
                                                    }

                                                    {
                                                        selectedProducts.length != 0 && <div className="w-full flex items-center justify-end mt-2">
                                                            {
                                                                saveLoader ? <CircularProgress /> :
                                                                    <button onClick={handleSaveOutDoc} className='px-5 py-2 rounded-md bg-[#7F55DE] text-white text-nowrap'>
                                                                        Save Doc
                                                                    </button>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                    }
                                </div>
                        }
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Out;
