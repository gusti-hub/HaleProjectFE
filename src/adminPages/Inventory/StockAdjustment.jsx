import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog } from '@material-tailwind/react';
import { backendServer } from '../../utils/info';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaEye } from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import ViewHardware from '../../components/view/hardware';
import ViewArtwork from '../../components/view/artwork';
import ViewCasegood from '../../components/view/casegood';
import ViewAcessory from '../../components/view/accessory';
import ViewArearug from '../../components/view/arearug';
import ViewEquipment from '../../components/view/equipment';
import ViewFabric from '../../components/view/fabric';
import ViewHardwired from '../../components/view/lightfixture';
import ViewDecorativeLighting from '../../components/view/decoretivelighting';
import ViewMirror from '../../components/view/mirror';
import ViewMiscellaneous from '../../components/view/miscellaneous';
import ViewTable from '../../components/view/table';
import ViewSeating from '../../components/view/seating';
import ViewWallpaper from '../../components/view/wallpaper';
import ViewUpholstery from '../../components/view/upholstery';
import ViewWindowTreatment from '../../components/view/windowtreatment';
import GlobalVariable from '../../utils/GlobalVariable';

const StockAdjustment = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [reason, setReason] = useState('');

    const handleInputChange = (e) => {
        setReason(e.target.value);
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [addModal, setAddModal] = useState(false);

    const handleAddModal = () => {
        setAddModal(curr => !curr);
        setAddPdtError(null);
        setSelectedProducts([]);
        setQty({});
        setIsAddPdt(false);
        setInvalidError(null);
        setReason('');
    };

    const [isAddPdt, setIsAddPdt] = useState(false);

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

    const [stockDocs, setStockDocs] = useState([]);

    const fetchStockAdjDocs = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getStockAdjDocs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStockDocs(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
        }
    }

    const fetchPdts = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getInvPdts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAddPdts(response.data.filter(pdt => pdt.type === 'Product'));
            setAddPdtLoader(false);
        } catch (error) {
            setAddPdtError(error.response.data.message);
            setAddPdtLoader(false);
        }
    };

    const handleAddPdt = () => {
        setIsAddPdt(true);
        fetchPdts();
    };

    const [qty, setQty] = useState({});

    const handleQtyChange = (e, id, totQty) => {
        const value = parseInt(e.target.value, 10);

        if (value < 0) {
            setQty(prevQty => ({
                ...prevQty,
                [id]: value
            }));
        } else {
            setQty(prevQty => ({
                ...prevQty,
                [id]: value
            }));
        }
    };

    const [saveLoader, setSaveLoader] = useState(false);

    const [invalidError, setInvalidError] = useState(null);

    const createProductsArray = (products) => {
        return products.map(product => ({
            pdtid: product._id,
            qty: Number(qty[product._id] !== undefined ? qty[product._id] : product.totQty)
        }));
    };

    const handleSaveDoc = async () => {

        setSaveLoader(true);

        const pdtArray = createProductsArray(selectedProducts);

        const invalidArray = pdtArray.filter(pdt => isNaN(pdt.qty) === true);

        if (invalidArray.length > 0) {
            setSaveLoader(false);
            setInvalidError("Can't submit empty quantity field!");
        } else {
            try {
                const response = await axios.put(`${backendServer}/api/update-invQty`, {
                    docNum: `SA-00${stockDocs.length + 1}`,
                    reason: reason,
                    products: pdtArray
                });

                toast.success(response.data.message);
                fetchStockAdjDocs();
                setSaveLoader(false);
                handleAddModal();
            } catch (error) {
                toast.error(error.response.data.message);
                setSaveLoader(false);
                handleAddModal();
            }
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredDocs = stockDocs.filter(doc =>
        doc.docNum.toLowerCase().includes(searchQuery.toLowerCase())
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
    const [currDoc, setCurrDoc] = useState('');

    const handleViewModal = async (_id, num) => {
        setViewModal(curr => !curr);
        setViewError(null);
        setViewLoader(false);
        setCurrDoc(num);
        await fetchViewPdts(_id);
    };

    const fetchViewPdts = async (id) => {
        setViewLoader(true);

        try {
            const response = await axios.get(`${backendServer}/api/viewSADoc/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setViewPdts(response.data);
            setViewLoader(false);
        } catch (error) {
            setViewError(error.response.data.message);
            setViewLoader(false);
        }
    };

    useEffect(() => {
        fetchStockAdjDocs();
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
                    <div className="w-full text-left text-gray-900 text-2xl font-medium">Stock Adjustment</div>
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
                                        stockDocs.length != 0 &&
                                        <div className="w-full flex items-center justify-end">
                                            <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                                                <FiSearch className='text-xl text-gray-600 ml-2' />
                                                <input value={searchQuery} onChange={handleSearchChange}
                                                    className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                                                    type="search" placeholder='Search by document ID'
                                                />
                                            </div>
                                        </div>
                                    }

                                    {
                                        filteredDocs.length === 0 ?
                                            <div className="w-full flex items-center justify-start text-lg font-medium">
                                                No document found!
                                            </div> :
                                            <div className="w-full flex flex-col items-center">
                                                <table className='w-full border-collapse'>
                                                    <thead>
                                                        <tr className='text-gray-700 text-lg text-nowrap'>
                                                            <th>View Document</th>
                                                            <th>Document Number</th>
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
                                                                                <FaEye onClick={() => handleViewModal(doc._id, doc.docNum)} className='text-xl cursor-pointer' />
                                                                            </div>
                                                                        </td>
                                                                        <td>{doc.docNum}</td>
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
                                            <div className="w-full text-left"><span className='font-semibold'>Document Number: </span>{currDoc}</div>
                                            <div className="w-full flex items-start justify-start max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                                <table className='w-full border-collapse'>
                                                    <thead>
                                                        <tr className='text-gray-700 text-lg text-nowrap'>
                                                            <th>Product Name</th>
                                                            <th>Image</th>
                                                            <th>Specification</th>
                                                            <th>Quantity</th>
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
                                                                        <td>{pdt.qty}</td>
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

                    <Dialog
                        size={isAddPdt || selectedProducts.length === 0 ? 'md' : 'lg'}
                        open={addModal}
                        handler={handleAddModal}
                        className="bg-transparent shadow-none w-full flex items-center justify-center"
                        style={{ width: '60%', maxWidth: '90%', minWidth: '300px', height: '60%' }}
                    >
                        <div className="w-full flex items-center justify-center bg-white text-black p-3 rounded-lg">
                            {
                                isAddPdt ?
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
                                                        <table className='w-full border-collapse mt-2'>
                                                            <thead>
                                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                                    <th>Action</th>
                                                                    <th>Product Code</th>
                                                                    <th>Product Name</th>                                                                                                                                
                                                                    <th>Image</th>
                                                                    <th>Specification</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    addPdts.map(pdt => {
                                                                        return (
                                                                            <tr>
                                                                                <td>
                                                                                    <input type="checkbox"
                                                                                    checked={selectedProducts.some(p => p._id === pdt._id)}
                                                                                    onChange={() => handleCheckboxChange(pdt)} />

                                                                                </td>
                                                                                <td>{pdt.code}</td>
                                                                                <td>{pdt.title}</td>
                                                                                <td>
                                                                                    <div className="flex items-center justify-center">
                                                                                        <img className='w-[10rem]' src={pdt.imageUrl} alt="" />
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                <div className="w-full flex items-center justify-start gap-2">
                                                                                    <div className='font-medium'>SKU:</div>
                                                                                    <div>{pdt.sku}</div>
                                                                                </div>                                                        
                                                                                <div className="w-full flex items-center justify-start gap-2">
                                                                                    <div className='font-medium'>Quantity:</div>
                                                                                    <div>{pdt.qty}</div>
                                                                                </div>
                                                                                    {pdt.furnishing === 'Accessory' ? (
                                                                                        <ViewAcessory
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Area Rug' ? (
                                                                                        <ViewArearug
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Equipment' ? (
                                                                                        <ViewEquipment
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Hardware' ? (
                                                                                        <ViewHardware
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Artwork' ? (
                                                                                        <ViewArtwork
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Casegood' ? (
                                                                                        <ViewCasegood
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Fabric' ? (
                                                                                        <ViewFabric
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Light Fixture (hardwired)' ? (
                                                                                        <ViewHardwired
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Decorative Lighting' ? (
                                                                                        <ViewDecorativeLighting
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Mirror' ? (
                                                                                        <ViewMirror
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Miscellaneous' ? (
                                                                                        <ViewMiscellaneous
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Table' ? (
                                                                                        <ViewTable
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Seating' ? (
                                                                                        <ViewSeating
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Wallpaper' ? (
                                                                                        <ViewWallpaper
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Upholstery' ? (
                                                                                        <ViewUpholstery
                                                                                            pdt={pdt}
                                                                                        />
                                                                                    )   : pdt.furnishing === 'Window Treatment' ? (
                                                                                        <ViewWindowTreatment
                                                                                            pdt={pdt}
                                                                                        />                      
                                                                                    )   
                                                                                    
                                                                                    
                                                                                    : <></>
                                                                                    }
                                                                            </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    }
                                                </div>
                                            </div>
                                    :
                                    <div className="w-full flex flex-col items-center gap-4">
                                        <div className="w-full flex items-start justify-start gap-2 text-base">
                                            <label className='font-semibold' htmlFor="reason">Reason:</label>
                                            <textarea
                                                value={reason}
                                                onChange={handleInputChange}
                                                className='w-full border-2 border-solid border-gray-300 outline-none rounded-md p-2'
                                                name="reason" id="reason" rows="3" placeholder='Type here...'></textarea>
                                        </div>
                                        <div className="w-full flex items-center justify-end">
                                            <button onClick={handleAddPdt} className='px-5 py-2 rounded-md bg-[#7F55DE] text-white'>
                                                {selectedProducts.length === 0 ? 'Add' : 'Edit'} Product(s)
                                            </button>
                                        </div>
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
                                                                    <th>Inventory Quantity</th>
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
                                                                                    <div className="w-full flex items-center justify-start gap-2">
                                                                                    <div className='font-medium'>SKU:</div>
                                                                                        <div>{pdt.sku}</div>
                                                                                    </div>                                                        
                                                                                        {pdt.furnishing === 'Accessory' ? (
                                                                                            <ViewAcessory
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Area Rug' ? (
                                                                                            <ViewArearug
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Equipment' ? (
                                                                                            <ViewEquipment
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Hardware' ? (
                                                                                            <ViewHardware
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Artwork' ? (
                                                                                            <ViewArtwork
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Casegood' ? (
                                                                                            <ViewCasegood
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Fabric' ? (
                                                                                            <ViewFabric
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Light Fixture (hardwired)' ? (
                                                                                            <ViewHardwired
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Decorative Lighting' ? (
                                                                                            <ViewDecorativeLighting
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Mirror' ? (
                                                                                            <ViewMirror
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Miscellaneous' ? (
                                                                                            <ViewMiscellaneous
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Table' ? (
                                                                                            <ViewTable
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Seating' ? (
                                                                                            <ViewSeating
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Wallpaper' ? (
                                                                                            <ViewWallpaper
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Upholstery' ? (
                                                                                            <ViewUpholstery
                                                                                                pdt={pdt}
                                                                                            />
                                                                                        )   : pdt.furnishing === 'Window Treatment' ? (
                                                                                            <ViewWindowTreatment
                                                                                                pdt={pdt}
                                                                                            />                      
                                                                                        )   
                                                                                        
                                                                                        
                                                                                        : <></>
                                                                                        }
                                                                                </td>
                                                                                <td>
                                                                                    <div className="flex items-center justify-center">
                                                                                        <input
                                                                                            value={qty[pdt._id] !== undefined ? qty[pdt._id] : pdt.totQty}
                                                                                            onChange={(e) => handleQtyChange(e, pdt._id, pdt.totQty)}
                                                                                            className={`w-[4rem] p-2 py-1 outline-none bg-[#F8F9FD] 
                                                                                ${qty[pdt._id] < 0 ? 'border border-solid border-red-600' : 'border-none'}`}
                                                                                            placeholder='0'
                                                                                            min={0}
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
                                        {
                                            invalidError && <div className="w-full text-left text-xs text-red-600 italic mt-2">{invalidError}</div>
                                        }
                                        {
                                            selectedProducts.length != 0 && <div className="w-full flex items-center justify-end mt-2">
                                                {
                                                    saveLoader ? <CircularProgress /> :
                                                        <button onClick={handleSaveDoc} className='px-5 py-2 rounded-md bg-[#7F55DE] text-white text-nowrap'>
                                                            Save Doc
                                                        </button>
                                                }
                                            </div>
                                        }
                                    </div>
                            }
                        </div>
                    </Dialog>
                </div>
            </div >
        </div >
    );
};

export default StockAdjustment;
