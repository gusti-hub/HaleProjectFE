import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineMoreVert } from 'react-icons/md';
import { Dialog } from '@material-tailwind/react';
import toast from 'react-hot-toast';

const In = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allPOs, setAllPOs] = useState([]);

    const [allDocs, setAllDocs] = useState([]);

    const [menuOpen, setMenuOpen] = useState('');

    const openMenu = (_id) => {
        if (menuOpen === _id) {
            setMenuOpen(null);
        } else {
            setMenuOpen(_id);
        }
    };

    const fetchAllDocs = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getAllDocs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllDocs(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    }

    const fetchAllPOs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendServer}/api/getAllPOs`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllPOs(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredSales = allPOs.filter(po =>
        po.poId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPOs = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [recModal, setRecModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);

    const [recLoader, setRecLoader] = useState(true);
    const [recError, setRecError] = useState(null);

    const [currPO, setCurrPO] = useState({});
    const [pdtArray, setPdtArray] = useState([]);

    const [currPOView, setCurrPOView] = useState({});
    const [viewPdtArray, setViewPdtArray] = useState([]);

    const [qty, setQty] = useState({});

    const [zeroError, setZeroError] = useState(false);

    const [isBackOrder, setIsBackOrder] = useState(false);

    const handleRecModal = () => { setRecLoader(true); setRecError(null); setRecModal(curr => !curr); resetRecModal(); setCnfWindow(false); };

    const handleViewModal = () => { setRecLoader(true); setRecError(null); setViewModal(curr => !curr); resetViewModal(); };

    const resetRecModal = () => {
        setCurrPO({});
        setPdtArray([]);
        setQty({});
        setZeroError(false);
    };

    const resetViewModal = () => {
        setCurrPOView({});
    };

    const handleQtyChange = (e, id, qty) => {
        const value = e.target.value;
        const maxQty = qty;

        if (value >= 0 && value <= maxQty) {
            setQty(prevQty => ({
                ...prevQty,
                [id]: {
                    qty: value,
                    demQty: qty
                }
            }));
        } else if (value > maxQty) {
            console.warn(`Quantity cannot exceed available stock of ${maxQty}`);
            setQty(prevQty => ({
                ...prevQty,
                [id]: {
                    qty: maxQty,
                    demQty: qty
                }
            }));
        }
    };

    const fetchPOProducts = async (id) => {
        try {
            const response = await axios.get(`${backendServer}/api/invPO/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrPO(response.data.poDetails);
            setPdtArray(response.data.response);
            setRecLoader(false);
        } catch (error) {
            setRecError(error.response.data.message);
            setRecLoader(false);
        }
    }

    const fetchViewModalData = async (id, docNumber) => {
        try {
            const response = await axios.get(`${backendServer}/api/viewDoc/${id}/${docNumber}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrPOView(response.data.currPO);
            setViewPdtArray(response.data.doc);
            setRecLoader(false);
        } catch (error) {
            setRecError(error.response.data.message);
            setRecLoader(false);
        }
    }

    const fetchBackOrderPOProducts = async (id) => {
        try {
            const response = await axios.get(`${backendServer}/api/invBackOrderPO/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrPO(response.data.poDetails);
            setPdtArray(response.data.response);
            setRecLoader(false);
        } catch (error) {
            setRecError(error.response.data.message);
            setRecLoader(false);
        }
    }

    const recDoc = (id) => {
        setIsBackOrder(false);
        handleRecModal();
        fetchPOProducts(id);
    }

    const viewDoc = (id, docNumber) => {
        handleViewModal();
        fetchViewModalData(id, docNumber);
    };

    const recBackOrderDoc = (id) => {
        setIsBackOrder(true);
        handleRecModal();
        fetchBackOrderPOProducts(id);
    };

    const updateProductsArray = (products) => {
        return products.map(product => ({
            ...product,
            recQty: qty[product.productId].qty || 0,
            demQty: qty[product.productId].demQty
        }));
    };

    const backOrderProductsArray = (products) => {
        return products.map(product => ({
            ...product,
            recQty: 0,
            demQty: product.demQty - product.recQty
        }));
    };

    const createBackOrder = async (poId, pdts) => {
        try {
            const backOrderProducts = backOrderProductsArray(pdts);

            const response = await axios.post(`${backendServer}/api/createBackOrder/${poId}`, {
                backOrderProducts: backOrderProducts,
                docNum: `${isBackOrder ? `IN-00${allDocs.length + 1}` : `IN-00${allDocs.length + 2}`}`
            });

            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const [saveLoader, setSaveLoader] = useState(false);

    const handleReceiveDoc = async () => {

        setSaveLoader(true);

        try {
            const updatedProducts = updateProductsArray(currPO.currPdts);

            const response = isBackOrder ?
                await axios.put(`${backendServer}/api/update-recBackOrder-qty/${currPO._id}`,
                    {
                        products: updatedProducts,
                        status: "Done"
                    })
                :
                await axios.put(`${backendServer}/api/update-rec-qty/${currPO._id}`,
                    {
                        docNumber: `IN-00${allDocs.length + 1}`,
                        products: updatedProducts,
                        status: "Done"
                    });

            toast.success(response.data.message);
            fetchAllPOs();
            fetchAllDocs();
            handleRecModal();
            setSaveLoader(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setSaveLoader(false);
        }

        setCnfWindow(false);

    };

    const handleReceiveBackDoc = async () => {

        setSaveLoader(true);

        try {
            const updatedProducts = updateProductsArray(currPO.currPdts);

            const response = isBackOrder ?
                await axios.put(`${backendServer}/api/update-recBackOrder-qty/${currPO._id}`,
                    {
                        products: updatedProducts,
                        status: "Done"
                    })
                :
                await axios.put(`${backendServer}/api/update-rec-qty/${currPO._id}`,
                    {
                        docNumber: `IN-00${allDocs.length + 1}`,
                        products: updatedProducts,
                        status: "Done"
                    });


            await createBackOrder(response.data.docDetails.poId, response.data.docDetails.pdts);


            toast.success(response.data.message);
            fetchAllPOs();
            fetchAllDocs();
            handleRecModal();
            setSaveLoader(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setSaveLoader(false);
        }

        setCnfWindow(false);

    };

    const [cnfWindow, setCnfWindow] = useState(false);

    const handleSave = async () => {
        const updatedProducts = updateProductsArray(currPO.currPdts);

        const backOrderProduct = updatedProducts.filter(pdt => pdt.demQty - pdt.recQty > 0);

        const invalidProduct = updatedProducts.filter(product => product.recQty <= 0);

        if (invalidProduct.length > 0) {
            setZeroError(true);
            toast.error("Cannot update: Quantity cannot be less than or equals to zero!");
        } else {
            if (backOrderProduct.length > 0) {
                setCnfWindow(true);
            } else {
                await handleReceiveDoc(updatedProducts);
            }
        }
    }

    useEffect(() => {
        fetchAllPOs();
        fetchAllDocs();
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
                    <div className="w-full text-left text-gray-900 text-2xl font-medium">Inventory (IN)</div>
                    <div className="w-full h-[2px] bg-gray-300"></div>
                    {
                        loading ?
                            <div className='w-full flex items-center justify-center my-4'>
                                <CircularProgress />
                            </div> :
                            error ?
                                <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                                    Error: {error}
                                </div> :
                                <div className="w-full flex flex-col items-center gap-4">
                                    {
                                        allPOs.length != 0 &&
                                        <div className="w-full flex items-center justify-end">
                                            <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                                                <FiSearch className='text-xl text-gray-600 ml-2' />
                                                <input value={searchQuery} onChange={handleSearchChange}
                                                    className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                                                    type="search" placeholder='Search by PO Id'
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        filteredSales.length === 0 ?
                                            <div className="w-full flex items-center justify-start text-lg font-medium">
                                                No PO found!
                                            </div> :
                                            <div className="w-full flex flex-col items-center">
                                                <table className='w-full border-collapse'>
                                                    <thead>
                                                        <tr className='text-gray-700 text-lg text-nowrap'>
                                                            <th>Action</th>
                                                            <th>Document Number</th>
                                                            <th>PO Number</th>
                                                            <th>PO Date</th>
                                                            <th>Estimation Delivery</th>
                                                            <th>Received Date</th>
                                                            <th>Vendor Name</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            currentPOs.map((po, index) => {
                                                                return (
                                                                    <tr key={po._id} className='text-base text-center text-gray-700'>
                                                                        <td>
                                                                            <div className="w-full flex items-start justify-center gap-2 relative">
                                                                                {
                                                                                    menuOpen != po._id ?
                                                                                        <MdOutlineMoreVert
                                                                                            onClick={() => openMenu(po._id)}
                                                                                            className='cursor-pointer text-xl' />
                                                                                        :
                                                                                        <IoCloseSharp
                                                                                            onClick={() => openMenu(po._id)}
                                                                                            className='cursor-pointer text-xl' />
                                                                                }
                                                                                {
                                                                                    menuOpen === po._id &&
                                                                                    <div style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}
                                                                                        className="w-[10rem] flex flex-col items-center p-2 fixed bg-white ml-[12rem] mt-2 gap-2">

                                                                                        {
                                                                                            po.inStatus === 'Done' ?
                                                                                                <button onClick={() => viewDoc(po._id, po.docNumber)}
                                                                                                    className='w-full text-left'>View Document</button> :
                                                                                                po.inStatus === 'Back Order' ?
                                                                                                    <button onClick={() => recBackOrderDoc(po._id)}
                                                                                                        className='w-full text-left'>Receive Back Order</button>
                                                                                                    :
                                                                                                    <button onClick={() => recDoc(po._id)}
                                                                                                        className='w-full text-left'>Receive Product</button>
                                                                                        }

                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                        <td>{
                                                                            po.isBackOrder ? <div className='text-orange-800'>{po.docNumber}</div> : <div>{po.docNumber}</div>
                                                                        }</td>
                                                                        <td>{po.poId}</td>
                                                                        <td>{po.createdAt.split('T')[0]}</td>
                                                                        <td>{po.delivery}</td>
                                                                        <td>{po.recDate}</td>
                                                                        <td>{po.vendor}</td>
                                                                        <td>
                                                                            {
                                                                                po.inStatus === 'Done' ? <div className="font-medium text-green-700">{po.inStatus}</div> :
                                                                                    po.inStatus === 'Back Order' ? <div className="font-medium text-orange-700">{po.inStatus}</div> :
                                                                                        <div className="font-medium text-gray-700">{po.inStatus}</div>
                                                                            }
                                                                        </td>
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
                </div>

                {/* Receive Modal */}
                <Dialog
                    size={`${cnfWindow ? 'xs' : 'lg'}`}
                    open={recModal}
                    handler={handleRecModal}
                    className="bg-transparent shadow-none w-full flex items-center justify-center"
                >
                    {
                        cnfWindow ?
                            <div className="w-full flex items-center justify-center bg-white text-black p-3 rounded-lg">
                                {
                                    saveLoader ? <div className="w-full text-center my-6"><CircularProgress /></div> :
                                        <div className="w-[70%] flex flex-col items-center gap-3">
                                            <div className="w-full text-center text-lg">
                                                Do you want to create Back Order?
                                            </div>
                                            <div className="w-full flex items-center justify-center gap-4">
                                                <button onClick={handleReceiveBackDoc}
                                                    className='flex items-center justify-center px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                    Yes
                                                </button>
                                                <button onClick={handleReceiveDoc}
                                                    className='flex items-center justify-center px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                    No
                                                </button>
                                            </div>
                                        </div>
                                }
                            </div>
                            :
                            <div className="w-full flex items-center justify-center bg-white p-3 rounded-lg">
                                {
                                    recLoader ?
                                        <div className='w-full flex items-center justify-center my-4'> <CircularProgress /> </div> :
                                        recError ?
                                            <div className="w-full flex items-center justify-center text-red-600 font-medium my-4"> Error: {recError} </div> :
                                            <div className="w-full flex flex-col items-center">
                                                <div className="w-full text-left font-semibold text-black mb-1">PO Number: <span className="font-normal">{currPO.currPO}</span></div>
                                                <div className="w-full text-left font-semibold text-black">Vendor: <span className="font-normal">{currPO.vendor}</span></div>
                                                <div className="w-full flex flex-col items-center gap-4">
                                                    <div className="w-full flex items-start justify-start max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                                        {
                                                            pdtArray.length === 0 ? <div className="w-full text-left mt-4">No product found!</div>
                                                                :
                                                                <table className='w-full border-collapse mt-4'>
                                                                    <thead>
                                                                        <tr className='text-gray-700 text-lg text-nowrap'>
                                                                            <th>Product Name</th>
                                                                            <th>Image</th>
                                                                            <th>Specification</th>
                                                                            <th>Quantity Demand</th>
                                                                            <th>Quantity Received</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            pdtArray.map(pdt => {
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
                                                                                        <td>
                                                                                            <div className="flex items-center justify-center">
                                                                                                <input
                                                                                                    value={qty[pdt._id]?.qty || ''}
                                                                                                    onChange={(e) => handleQtyChange(e, pdt._id, pdt.qty)}
                                                                                                    className={`w-[4rem] p-2 py-1 outline-none bg-[#F8F9FD] 
                                                                                ${qty[pdt._id]?.qty <= 0 || qty[pdt._id]?.qty > pdt.qty ? 'border border-solid border-red-600' : 'border-none'}`}
                                                                                                    placeholder='1'
                                                                                                    min={1}
                                                                                                    max={pdt.qty}
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
                                                        }
                                                    </div>
                                                    {
                                                        zeroError && <div className="w-full text-left text-xs text-red-600 italic mt-2">Cannot update: Quantity cannot be less than or equals to zero!</div>
                                                    }
                                                    <div className="w-full flex items-center justify-end my-1">
                                                        {
                                                            saveLoader ? <CircularProgress /> :
                                                                <button onClick={handleSave}
                                                                    className='flex items-center justify-center px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                                    Save
                                                                </button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                }
                            </div>
                    }
                </Dialog>

                {/* View Modal */}
                <Dialog
                    size="lg"
                    open={viewModal}
                    handler={handleViewModal}
                    className="bg-transparent shadow-none w-full flex items-center justify-center"
                >
                    <div className="w-full flex items-center justify-center bg-white p-3 rounded-lg">
                        {
                            recLoader ?
                                <div className='w-full flex items-center justify-center my-4'> <CircularProgress /> </div> :
                                recError ?
                                    <div className="w-full flex items-center justify-center text-red-600 font-medium my-4"> Error: {recError} </div> :
                                    <div className="w-full flex flex-col items-center">
                                        <div className="w-full text-left font-semibold text-black mb-1">PO Number: <span className="font-normal">{currPOView.poNum}</span></div>
                                        <div className="w-full text-left font-semibold text-black">Vendor: <span className="font-normal">{currPOView.vendor}</span></div>
                                        <div className="w-full flex items-start justify-start max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                            {
                                                viewPdtArray.length === 0 ? <div className="w-full text-left mt-4">No product found!</div>
                                                    :
                                                    <table className='w-full border-collapse mt-4'>
                                                        <thead>
                                                            <tr className='text-gray-700 text-lg text-nowrap'>
                                                                <th>Product Name</th>
                                                                <th>Image</th>
                                                                <th>Specification</th>
                                                                <th>Quantity Demand</th>
                                                                <th>Quantity Received</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                viewPdtArray.map(pdt => {
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
                                                                            <td>{pdt.demQty}</td>
                                                                            <td>{pdt.recQty}</td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                            }
                                        </div>
                                    </div>
                        }
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default In;
