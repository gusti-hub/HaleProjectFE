import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineClose, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineMoreVert } from 'react-icons/md';
import { Dialog } from '@material-tailwind/react';
import toast from 'react-hot-toast';

const RFQ = ({ fetchAllProductsMain }) => {

    const token = localStorage.getItem('token');
    const address = useParams();

    const [add, setAdd] = useState(false);
    const handleAddNew = () => { setAdd(curr => !curr) };

    const [addPdt, setAddPdt] = useState(false);
    const handleAddPdt = () => { setAddPdt(curr => !curr) };

    const [formData, setFormData] = useState(
        {
            projectId: address.id,
            vendor: '',
            curr: '',
            deadline: ''
        }
    )
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [error, setError] = useState(null);

    const [viewRFQ, setViewRFQ] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const [qty, setQty] = useState({});

    const handleQtyChange = (e, id) => {
        const value = e.target.value;
        setQty(prevQty => ({
            ...prevQty,
            [id]: value
        }));
    };


    const fetchVendorsNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getvendornames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVendors(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response.data.message);
            setLoading(false);
        }
    };

    const [products, setProducts] = useState([]);

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/products/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.products);
            setLoading1(false);
        } catch (error) {
            setLoading1(false);
            setError(error.response.data.message);
        }
    }

    const onlyProducts = products.filter(product => product.type === "Product");

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

    const handleSave = () => {
        setAddPdt(false);
    };

    const updateQty = async (_id, qty) => {
        if (qty > 0) {
            try {
                const response = await axios.put(`${backendServer}/api/updateQty/${_id}`, { qty });
                return response.data;
            } catch (error) {
                throw new Error(error.response ? error.response.data.message : error.message);
            }
        } else {
            toast.error("Quantity must be greater than zero");
        }
    };

    const handleSaveRFQ = async () => {
        if (formData.vendor && formData.curr && formData.deadline) {
            try {
                const productQuantities = selectedProducts.map(product => ({
                    productId: product._id,
                    qty: qty[product._id]
                })).filter(item => item.qty > 0);

                for (const product of productQuantities) {
                    await updateQty(product.productId, product.qty);
                }

                const response = await axios.post(`${backendServer}/api/add-rfq`, {
                    projectId: address.id,
                    vendor: formData.vendor,
                    curr: formData.curr,
                    deadline: formData.deadline,
                    products: productQuantities
                });

                fetchRFQDetails();
                fetchAllProductsMain();
                setAdd(false);
                toast.success(response.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        } else {
            toast.error("Fill all the mandatory fields!");
        }
    };


    const [rfqs, setRfqs] = useState([]);

    const fetchRFQDetails = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/rfqDetails/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRfqs(response.data.allRFQs);
            setLoading2(false);
        } catch (error) {
            setLoading2(false);
            setError(error.response.data.message);
        }
    }

    const [menuOpen, setMenuOpen] = useState('');

    const openMenu = (_id) => {
        if (menuOpen === _id) {
            setMenuOpen(null);
        } else {
            setMenuOpen(_id);
        }
    };

    useEffect(() => {
        fetchRFQDetails();
        fetchVendorsNames();
        fetchAllProducts();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = rfqs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(rfqs.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [rrOpen, setRrOpen] = useState(false);
    const [reqRFQPdts, setReqRFQPdts] = useState([]);
    const [rrLoading, setRrLoading] = useState(true);
    const [rrError, setRrError] = useState(null);
    const [rfqCurr, setRfqCurr] = useState(null);
    const [rfqCurrPdts, setRfqCurrPdts] = useState([]);

    const [currentRFQId, setCurrentRFQId] = useState(null);

    const fetchAddedRFQPdts = async (_id) => {
        try {
            const response = await axios.get(`${backendServer}/api/getRFQPdts/${_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReqRFQPdts(response.data.products);
            setRfqCurr(response.data.curr);
            setRfqCurrPdts(response.data.rfqPdts);
            setRrLoading(false);
        } catch (error) {
            setRrError(error.response.data.message);
            setRrLoading(false);
        }
    };

    const handleRrOpen = (_id) => {
        setViewRFQ(false);
        setPrices({});
        setReqRFQPdts([]);
        setRrOpen(curr => !curr);
        fetchAddedRFQPdts(_id);
        setCurrentRFQId(_id);
    };

    const handleViewRFQ = (_id) => {
        setViewRFQ(true);
        setRfqCurr(null);
        setRfqCurrPdts([]);
        setRrOpen(curr => !curr);
        fetchAddedRFQPdts(_id);
        setCurrentRFQId(_id);
    };

    const [prices, setPrices] = useState({});

    const handlePriceChange = (e, id) => {
        const val = e.target.value;
        setPrices(prevPrices => ({
            ...prevPrices,
            [id]: val
        }));
    };

    const handleReceiveRFQ = async () => {
        try {
            const productPrices = reqRFQPdts.map(product => ({
                productId: product._id,
                price: prices[product._id]
            })).filter(item => item.price > 0);

            const allPricesValid = productPrices.every(item => item.price > 0);

            if (!allPricesValid || productPrices.length === 0) {
                toast.error('All product prices must be greater than 0.');
                return;
            }

            await axios.put(`${backendServer}/api/updatePdtPrice/${currentRFQId}`, productPrices);

            fetchAllProductsMain();
            fetchRFQDetails();
            setRrOpen(false);
            setCurrentRFQId(null);
            toast.success('Prices updated successfully!');
        } catch (error) {
            toast.error('Failed to update prices. Please try again.');
            console.error(error);
        }
    };


    return (
        <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg gap-4">
            <div className="w-full flex items-center justify-start">
                <button onClick={handleAddNew}
                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                    ADD NEW RFQ
                </button>
            </div>
            {
                loading2 ?
                    <div className='w-full flex items-center justify-center my-4'>
                        <CircularProgress />
                    </div>
                    : error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                            Error: {error}
                        </div>
                        :
                        <div className="w-full flex items-center justify-center text-black">
                            {
                                rfqs.length === 0 ?
                                    <div className="w-full text-left font-medium">
                                        No RFQ detail found!
                                    </div> :
                                    <table className='w-full border-collapse'>
                                        <thead className='text-nowrap'>
                                            <tr className='text-gray-700 text-lg'>
                                                <th>Action</th>
                                                <th>RFQ Number</th>
                                                <th>Deadline</th>
                                                <th>Vendor Name</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                current.map(rfq => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                <div className='flex items-center justify-center relative'>
                                                                    {
                                                                        menuOpen != rfq._id ?
                                                                            <MdOutlineMoreVert
                                                                                onClick={() => openMenu(rfq._id)}
                                                                                className='cursor-pointer text-xl' />
                                                                            :
                                                                            <IoCloseSharp
                                                                                onClick={() => openMenu(rfq._id)}
                                                                                className='cursor-pointer text-xl' />
                                                                    }
                                                                    {
                                                                        menuOpen === rfq._id ?
                                                                            <div style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}
                                                                                className="w-[10rem] flex flex-col items-center p-2 fixed bg-white ml-[12rem] mt-16 gap-2">
                                                                                {
                                                                                    rfq.status === "Received RFQ" ?
                                                                                        <button onClick={() => handleViewRFQ(rfq._id)}
                                                                                            className='w-full text-left'>View RFQ</button>
                                                                                        :
                                                                                        <button onClick={() => handleRrOpen(rfq._id)}
                                                                                            className='w-full text-left'>Receive RFQ</button>
                                                                                }

                                                                                <div className="w-full h-[2px] bg-gray-300"></div>

                                                                                <button className='w-full text-left'>Download RFQ</button>

                                                                            </div> : ''
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td>{rfq._id}</td>
                                                            <td>{rfq.deadline}</td>
                                                            <td>{rfq.vendor}</td>
                                                            <td>{rfq.status}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                            }
                        </div>

            }
            {
                rfqs.length != 0 ?
                    <div className='w-full flex items-center justify-end gap-2'>

                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center cursor-pointer">
                            <MdOutlineKeyboardArrowLeft className='text-xl' />
                        </button>

                        <div className='text-gray-700'>
                            Page {currentPage} of {totalPages}
                        </div>

                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center cursor-pointer">
                            <MdOutlineKeyboardArrowRight className='text-xl' />
                        </button>

                    </div> : ''
            }

            {/* Receive RFQ Section */}
            <Dialog
                size="lg"
                open={rrOpen}
                handler={() => setRrOpen(curr => !curr)}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg text-black">
                    {
                        rrLoading || reqRFQPdts.length === 0 ?
                            <div className='w-full flex items-center justify-center my-4'>
                                <CircularProgress />
                            </div>
                            : rrError ?
                                <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                                    Error: {rrError}
                                </div>
                                :
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="w-full flex flex-col items-center gap-4 max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                        {
                                            reqRFQPdts.map(pdt => {
                                                return (
                                                    <div key={pdt._id} className="w-full flex items-start justify-center bg-[#F8F9FD] p-2 rounded-lg gap-4">
                                                        <div className="w-full flex flex-col items-center gap-2 border-r-2 border-solid border-gray-500">
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
                                                        {
                                                            viewRFQ ?
                                                                <div className="w-full flex flex-col items-center gap-2">
                                                                    <div className="w-full text-left font-semibold">Price</div>
                                                                    {
                                                                        rfqCurrPdts.filter(rfqPdt => rfqPdt.productId === pdt._id).map(rfqPdt => {
                                                                            return ( <div className="w-full">{rfqPdt.price} {rfqCurr}</div> )
                                                                        })
                                                                    }
                                                                </div>
                                                                :
                                                                <div className="w-full flex flex-col items-center gap-2">
                                                                    <div className="w-full text-left font-semibold">Price</div>
                                                                    <input value={prices[pdt._id] || ''} onChange={(e) => handlePriceChange(e, pdt._id)}
                                                                        placeholder={`In ${rfqCurr}`}
                                                                        className='w-full p-1.5 outline-none'
                                                                        type="number" min="1" name="" />
                                                                </div>
                                                        }
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        !viewRFQ ?
                                            <div className="w-full flex items-center justify-end my-1">
                                                <button onClick={handleReceiveRFQ}
                                                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                    Receive RFQ
                                                </button>
                                            </div> : ''
                                    }
                                </div>
                    }
                </div>
            </Dialog>

            {/* Add Product Section */}
            <Dialog
                size="md"
                open={add}
                handler={handleAddNew}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                {
                    addPdt ?
                        <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg text-black gap-2">
                            <div className="w-full flex items-center justify-end">
                                <MdOutlineClose onClick={() => setAddPdt(false)} className='text-xl cursor-pointer' />
                            </div>
                            <div className="w-full flex items-center justify-end my-1">
                                <button onClick={handleSave}
                                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                    Save
                                </button>
                            </div>
                            {
                                loading1 ?
                                    <div className='w-full flex items-center justify-center my-2'>
                                        <CircularProgress />
                                    </div>
                                    : error ?
                                        <div className="w-full flex items-center justify-center text-red-600 font-medium">
                                            Error: {error}
                                        </div>
                                        :
                                        <div className="w-full flex flex-col items-center gap-4 max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                            {
                                                onlyProducts.length === 0 ?
                                                    <div className="w-full text-left text-lg font-medium">
                                                        No product found!
                                                    </div>
                                                    :
                                                    onlyProducts.map(pdt => {
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

                            }
                        </div>
                        : <div className="w-full flex flex-col items-center p-6 bg-white rounded-lg text-black gap-2">
                            <div className="w-full text-left text-lg font-medium">New RFQ</div>
                            <div className="w-full h-[2px] bg-gray-400"></div>
                            {
                                loading ?
                                    <div className='w-full flex items-center justify-center my-2'>
                                        <CircularProgress />
                                    </div> :
                                    error ?
                                        <div className="w-full flex items-center justify-center text-red-600 font-medium">
                                            Error: {error}
                                        </div>
                                        :
                                        <form className='w-full flex flex-col items-center'>
                                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                                <label htmlFor="vendor">Vendor:</label>
                                                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                                <select
                                                    value={formData.vendor}
                                                    onChange={handleInputChange}
                                                    className='p-1 outline-none' name="vendor">
                                                    <option value="" disabled>Select an option</option>
                                                    {vendors.map((vendor) => (
                                                        <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                                <label htmlFor="curr">Currency:</label>
                                                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                                <select
                                                    value={formData.curr}
                                                    onChange={handleInputChange}
                                                    className='p-1 outline-none' name="curr">
                                                    <option value="" disabled>Select an option</option>
                                                    <option value="USD">USD</option>
                                                    <option value="IDR">IDR</option>
                                                </select>
                                            </div>
                                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                                <label htmlFor="deadline">Deadline:</label>
                                                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                                <input
                                                    value={formData.deadline}
                                                    onChange={handleInputChange}
                                                    className='p-1 outline-none'
                                                    type="date" name="deadline" id="deadline" />
                                            </div>
                                        </form>
                            }
                            <div className="w-full flex items-center justify-end">
                                <button onClick={handleAddPdt}
                                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white my-1'>
                                    { selectedProducts.length === 0 ? "Add Product" : "Edit Selected Product(s)"}
                                </button>
                            </div>

                            {
                                selectedProducts.length === 0 ? <div className="w-full text-left font-medium">No product is added!</div>
                                    :
                                    <div className="w-full flex items-center justify-start">
                                        <table className='w-full border-collapse mt-2'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>Product Name</th>
                                                    <th>Description</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedProducts.map(pdt => {
                                                        return (
                                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                <td>{pdt.title}</td>
                                                                <td>{pdt.desc}</td>
                                                                <td>
                                                                    <div className="flex items-center justify-center">
                                                                        <input
                                                                            value={qty[pdt._id] || ''}
                                                                            onChange={(e) => handleQtyChange(e, pdt._id)}
                                                                            className='w-[4rem] p-2 py-1 outline-none bg-[#F8F9FD]'
                                                                            placeholder='0'
                                                                            min="0"
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
                            {
                                selectedProducts.length != 0 ?
                                    <div className="w-full flex items-center justify-start">
                                        <button onClick={handleSaveRFQ}
                                            className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white mt-2'>
                                            Save RFQ
                                        </button>
                                    </div> : ''
                            }
                        </div>
                }
            </Dialog>
        </div>
    );
}




const Products = () => {

    const navigate = useNavigate();
    const address = useParams();

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    const fetchAllProducts = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/products/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
        }
    }

    const onlyProducts = products.filter(product => product.type === "Product");

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = onlyProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(onlyProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [rfq, setRfq] = useState(false);

    const handleRFQ = () => {
        setRfq(state => !state);
    };

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
                {
                    loading ?
                        <div className='w-full flex items-center justify-center p-4'>
                            <CircularProgress />
                        </div> :
                        error ?
                            <div className="w-full flex items-center justify-center text-red-600 font-medium p-4">
                                Error: {error}
                            </div> :
                            <div className="w-full flex flex-col items-center justify-start p-8">
                                <div className="w-full flex items-center justify-start gap-6">
                                    <button onClick={handleRFQ}
                                        className='px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>RFQ</button>
                                    <button className='px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>PO</button>
                                </div>
                                {
                                    onlyProducts.length === 0 ?
                                        <div className="w-full flex items-center justify-start text-lg font-medium mt-6">
                                            No products found!
                                        </div> :
                                        <div className="w-full flex flex-col items-center">
                                            <table className='w-full border-collapse mt-6'>
                                                <thead>
                                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                                        <th>Product ID</th>
                                                        <th>Product Name</th>
                                                        <th>Item Status</th>
                                                        <th>RFQ Number</th>
                                                        <th>RFQ Sent Date</th>
                                                        <th>RFQ Receive Date</th>
                                                        <th>PO Number</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        current.map(pdt => {
                                                            return (
                                                                <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                    <td>{pdt.productDetails.code}</td>
                                                                    <td>{pdt.title}</td>
                                                                    {
                                                                        pdt.status === "Pending" ?
                                                                            <td>Approval pending</td> : ''
                                                                    }
                                                                    <td>{pdt.rfqNumber}</td>
                                                                    <td>{pdt.rfqSentDate}</td>
                                                                    <td>{pdt.rfqReceiveDate}</td>
                                                                    <td></td>
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
            <Dialog
                size="lg"
                open={rfq}
                handler={handleRFQ}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <RFQ fetchAllProductsMain={fetchAllProducts} />
            </Dialog>
        </div>
    );
};

export default Products;
