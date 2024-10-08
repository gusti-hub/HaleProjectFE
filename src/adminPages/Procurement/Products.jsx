import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack, IoCloseSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineClose, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineMoreVert } from 'react-icons/md';
import { Dialog } from '@material-tailwind/react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
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
import Product from '../../../models/products';

//PO

const PO = ({ fetchAllProductsMain, projectDetails }) => {

    const token = localStorage.getItem('token');
    const address = useParams();

    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        poId: '', projectId: address.id, vendor: '', rfq: '', delivery: '', receive: '', totalPrice: ''
    });

    const resetForm = () => {
        setFormData({
            poId: '', projectId: address.id, vendor: '', rfq: '', delivery: '', receive: '', totalPrice: ''
        })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);
    const [loadPdts, setLoadPdts] = useState(true);

    const [error, setError] = useState(null);
    const [error1, setError1] = useState(null);
    const [errPdts, setErrPdts] = useState(null);

    const [pos, setPos] = useState([]);

    const [addPO, setAddPO] = useState(false);

    const [vendors, setVendors] = useState([]);
    const [rfqs, setRfqs] = useState([]);

    const [pdts, setPdts] = useState([]);
    const [isClicked, setClicked] = useState(false);
    const [totalPrice, setTotalPrice] = useState(null);

    const handleAddPO = () => {
        resetForm();
        setAddPO(curr => !curr);
        setTotalPrice(null);
        setClicked(false);
        setFieldError(null);
    }

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const current = pos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pos.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchPODetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendServer}/api/poDetails/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPos(response.data.allPOs.filter(po => po.isBackOrder === false));
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    }

    const fetchVendorsNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getvendornames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVendors(response.data);
            setLoading1(false);
        } catch (err) {
            setError1(err.response.data.message);
            setLoading1(false);
        }
    };

    const [rfqLoader, setRfqLoader] = useState(false);

    const fetchRFQDetails = async () => {
        setRfqLoader(true);
        try {
            const response = await axios.get(`${backendServer}/api/rfqDetails/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRfqs(response.data.allRFQs);
            setLoading1(false);
            setRfqLoader(false);
        } catch (error) {
            setLoading1(false);
            setError1(error.response.data.message);
            setRfqLoader(false);
        }
    }

    const vendorRFQs = rfqs.filter(rfq => rfq.vendor === formData.vendor && rfq.status === 'Received RFQ');

    const receivedRFQs = rfqs.filter(rfq => rfq.status === 'Received RFQ');

    const handleTotalPrice = (pdts) => {
        let totalUSD = 0;
        let totalIDR = 0;

        setTotalPrice(null);

        pdts.forEach(pdt => {
            const price = pdt.qty * pdt.price;

            if (pdt.curr === 'USD') {
                totalUSD += price;
            } else if (pdt.curr === 'IDR') {
                totalIDR += price;
            }
        });

        if (totalUSD > 0) {
            const formattedTotalUSD = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(totalUSD);
            setTotalPrice(formattedTotalUSD);
        } else if (totalIDR > 0) {
            const formattedTotalIDR = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(totalIDR);
            setTotalPrice(formattedTotalIDR);
        } else {
            setTotalPrice(null);
        }
    };

    const fetcthRFQProducts = async (rfqId) => {
        try {
            const response = await axios.get(`${backendServer}/api/rfqProducts/${address.id}/${rfqId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPdts(response.data.response);
            handleTotalPrice(response.data.response);
            setLoadPdts(false);
            setPoMenuLoader(false);
        } catch (error) {
            setErrPdts(error.response.data.message);
            setLoadPdts(false);
            setPoMenuLoader(false);
        }
    }

    const handleContinue = (rfqId) => {
        setLoadPdts(true);
        fetcthRFQProducts(rfqId);
        setClicked(true);
    };

    const handleRFQInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        handleContinue(value);
    };

    const [saveLoader, setSaveLoader] = useState(false);

    const [fieldError, setFieldError] = useState(null);

    const handleSavePO = async (e) => {
        e.preventDefault();

        setSaveLoader(true);

        if (formData.vendor.length != 0 && formData.rfq.length != 0 && formData.delivery.length != 0 && formData.receive.length != 0 && totalPrice) {
            try {
                const pdtsIds = pdts.map(pdt => ({ productId: String(pdt._id) }));

                const response = await axios.post(`${backendServer}/api/add-po`, {
                    poId: `PO-00${pos.length + 1}`,
                    projectId: address.id,
                    vendor: formData.vendor,
                    rfq: formData.rfq,
                    delivery: formData.delivery,
                    receive: formData.receive,
                    totalPrice: totalPrice,
                    products: pdtsIds
                });

                fetchAllProductsMain();
                fetchPODetails();
                handleAddPO();
                setSaveLoader(false);
                toast.success(response.data.message);
            } catch (error) {
                toast.error(error.response.data.message);
                setSaveLoader(false);
            }
        } else {
            toast.error("Fill all the mandatory fields!");
            setFieldError("Fill all the mandatory (*) fields!");
            setSaveLoader(false);
        }
    };

    const [menuOpen, setMenuOpen] = useState('');

    const openMenu = (_id) => {
        if (menuOpen === _id) {
            setMenuOpen(null);
        } else {
            setMenuOpen(_id);
        }
    };

    useEffect(() => {
        fetchPODetails();
        fetchVendorsNames();
        fetchRFQDetails();
    }, []);

    const [viewPO, setViewPO] = useState(false);

    const [poDetails, setPODetails] = useState({
        poId: '', vendor: ''
    })

    const [poMenuLoader, setPoMenuLoader] = useState(false);

    const viewPODetails = (poId, rfqId, vendor) => {
        setLoadPdts(true);
        setPoMenuLoader(true);
        setViewPO(curr => !curr);
        setPODetails({
            poId: poId, vendor: vendor
        });
        fetcthRFQProducts(rfqId);
    }

    const approvePO = async (_id) => {
        setPoMenuLoader(true);
        try {
            const response = await axios.put(`${backendServer}/api/updatePOStatus/${_id}`);
            fetchPODetails();
            toast.success(response.data.message);
            setPoMenuLoader(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setPoMenuLoader(false);
        }
    }

    // Download PO

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
            Image_URL: item.imageUrl || '',
            Qty: item.qty ? item.qty.toString() : '',
            Price: item.price ? item.price.toString() : '',
            Total: (item.qty * item.price).toString()
        }));
    };

    const handleDownload = async (id, name) => {
        setPoMenuLoader(true);
        try {
            const response = await axios.get(`${backendServer}/api/getPOPdts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = flattenData(response.data);
            const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape

            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            const margin = 10; // Margin from the edge of the page
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            const addFooter = () => {
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(128, 128, 128);
                doc.text("Henderson", pageWidth / 2, pageHeight - margin, { align: 'center' });
            };

            for (let i = 0; i < data.length; i++) {
                const item = data[i];

                // Add header
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 255);
                doc.setFont('helvetica', 'bold');
                doc.text("HALE by HENDERSON", pageWidth / 2, margin + 10, { align: 'center' }); // Adjusted for landscape

                // Add title
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                doc.text(item.Title.toUpperCase(), pageWidth / 2, margin + 25, { align: 'center' });

                // Add specification sheet text
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(128, 128, 128);
                doc.text("SPECIFICATION SHEET", pageWidth / 2, margin + 35, { align: 'center' });

                // Draw line
                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(1);
                doc.line(margin, margin + 40, pageWidth - margin, margin + 40); // Adjusted for landscape

                // Image
                const maxWidth = 70; // Maximum width of the image
                const maxHeight = 50; // Maximum height of the image
                if (item.Image_URL) {
                    const img = new Image();
                    img.src = item.Image_URL;
                    img.crossOrigin = 'anonymous';

                    await new Promise((resolve) => {
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            const aspectRatio = img.width / img.height;

                            let imgWidth = maxWidth;
                            let imgHeight = maxWidth / aspectRatio;

                            if (imgHeight > maxHeight) {
                                imgHeight = maxHeight;
                                imgWidth = maxHeight * aspectRatio;
                            }

                            canvas.width = imgWidth * 2; // Increase the canvas size to maintain resolution
                            canvas.height = imgHeight * 2; // Increase the canvas size to maintain resolution
                            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                            const imgData = canvas.toDataURL('image/png');
                            doc.addImage(imgData, 'PNG', margin, margin + 50, imgWidth, imgHeight);
                            resolve();
                        };

                        img.onerror = () => {
                            resolve(); // Resolve even if image fails to load to avoid hanging
                        };
                    });
                }

                // x offsets for the columns
                const xDesc = margin + maxWidth; // Position for DESCRIPTION
                const xSpecs = xDesc + 50; // Position for SPECS
                const xPrice = xSpecs + 50; // Position for UNIT COST
                const xTotal = xPrice + 50;

                // DESCRIPTION
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text("DESCRIPTION", xDesc, margin + 50);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(item.Description || "N/A", xDesc, margin + 60);

                // SPECS
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text("SPECS", xSpecs, margin + 50);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Quantity: ${item.Qty}`, xSpecs, margin + 60);
                doc.text(`Measuring Unit: ${item.Measuring_unit}`, xSpecs, margin + 70);
                doc.text(`Length: ${item.Length}`, xSpecs, margin + 75);
                doc.text(`Width: ${item.Width}`, xSpecs, margin + 80);
                doc.text(`Diameter: ${item.Diameter}`, xSpecs, margin + 85);
                doc.text(`Color: ${item.Color}`, xSpecs, margin + 90);
                doc.text(`Material: ${item.Material}`, xSpecs, margin + 95);

                // UNIT COST
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text("UNIT COST", xPrice, margin + 50);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`${formatter.format(item.Price)}`, xPrice, margin + 60);

                // TOTAL COST
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text("TOTAL COST", xTotal, margin + 50);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`${formatter.format(item.Total)}`, xTotal, margin + 60);

                // Add footer
                addFooter();

                // Add a new page if not the last item
                if (i < data.length - 1) {
                    doc.addPage();
                    addFooter(); // Add footer on the new page as well
                }
            }

            doc.save(`PO_Details_${name}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setPoMenuLoader(false);
        }
    };


    if (rfqs.length === 0 || receivedRFQs.length === 0) {
        return (
            <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg gap-4">
                {
                    rfqLoader ? <CircularProgress /> :
                        <div className="w-full text-left font-medium text-black">No Received RFQ found!</div>
                }
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg gap-4">

            {
                loading ?
                    <div className='w-full flex items-center justify-center my-4'>
                        <CircularProgress />
                    </div>
                    : error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                            Error: {error}
                        </div>
                        :
                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="w-full flex items-center justify-start">
                            {(projectDetails.progress == GlobalVariable.Progress.ProjectImplementation) &&  
                                <button onClick={() => setAddPO(state => !state)}
                                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                    ADD NEW PO
                                </button>
                            }
                            </div>
                            <div className="w-full flex items-center justify-center text-black">
                                {
                                    pos.length === 0 ?
                                        <div className="w-full text-left font-medium">
                                            No PO detail found!
                                        </div> :
                                        <table className='w-full border-collapse'>
                                            <thead className='text-nowrap'>
                                                <tr className='text-gray-700 text-lg'>
                                                    <th>Action</th>
                                                    <th>PO Number</th>
                                                    <th>PO Date</th>
                                                    <th>Estimation Delivery</th>
                                                    <th>Estimation Received</th>
                                                    <th>Vendor Name</th>
                                                    <th>Total Price</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    current.map(po => {
                                                        return (
                                                            <tr>
                                                                <td>
                                                                    <div className='flex items-center justify-center relative'>
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
                                                                                className="w-[10rem] flex flex-col items-center p-2 fixed bg-white ml-[12rem] mt-[5rem]">

                                                                                {
                                                                                    poMenuLoader ? <div className="w-full text-center my-3.5"> <CircularProgress /> </div> :
                                                                                        <div className="w-full flex flex-col items-center justify-start gap-2">
                                                                                            {
                                                                                                po.status != 'Approved' &&
                                                                                                <button onClick={() => approvePO(po._id)}
                                                                                                    className='w-full text-left'>Approve PO</button>
                                                                                            }

                                                                                            {
                                                                                                po.status != 'Approved' && <div className="w-full h-[2px] bg-gray-300"></div>
                                                                                            }

                                                                                            <button onClick={() => viewPODetails(po.poId, po.rfq, po.vendor)}
                                                                                                className='w-full text-left'>View PO</button>

                                                                                            <div className="w-full h-[2px] bg-gray-300"></div>

                                                                                            <button onClick={() => handleDownload(po._id, po.poId)}
                                                                                                className='w-full text-left'>Download PO</button>
                                                                                        </div>
                                                                                }

                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td>{po.poId}</td>
                                                                <td>{po.createdAt.split('T')[0]}</td>
                                                                <td>{po.delivery}</td>
                                                                <td>{po.receive}</td>
                                                                <td>{po.vendor}</td>
                                                                <td>{po.totalPrice}</td>
                                                                <td className={`${po.status === 'Approved' ? 'font-medium text-green-700' : 'font-normal'}`}>
                                                                    {po.status}
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
            }

            {
                pos.length != 0 &&
                <div className='w-full flex items-center justify-end gap-2'>

                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center cursor-pointer">
                        <MdOutlineKeyboardArrowLeft className='text-xl' />
                    </button>

                    <div className='text-gray-800 text-sm'>
                        Page {currentPage} of {totalPages}
                    </div>

                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center cursor-pointer">
                        <MdOutlineKeyboardArrowRight className='text-xl' />
                    </button>

                </div>
            }

            <Dialog
                size={isClicked ? `xl` : `md`}
                open={addPO}
                handler={handleAddPO}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                {
                    loading1 ?
                        <div className='w-full flex items-center justify-center my-4'>
                            <CircularProgress />
                        </div>
                        : error1 ?
                            <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                                Error: {error1}
                            </div> :
                            <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg gap-4">
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
                                        <label htmlFor="rfq">RFQ:</label>
                                        <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                        {
                                            !formData.vendor || vendorRFQs.length === 0 ?
                                                <div className='text-sm text-red-600 italic'>No RFQ details found! <span className='text-black'>(Select vendor to continue.)</span></div> :
                                                <select
                                                    value={formData.rfq}
                                                    onChange={handleRFQInputChange}
                                                    className='p-1 outline-none' name="rfq">
                                                    <option value="" disabled>Select an option</option>
                                                    {vendorRFQs && vendorRFQs.map((rfq) => (
                                                        <option key={rfq.id} value={rfq.rfqId}>{rfq.rfqId}</option>
                                                    ))}
                                                </select>

                                        }
                                    </div>
                                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                        <label htmlFor="delivery">Estimation Delivery:</label>
                                        <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                        <input
                                            value={formData.delivery}
                                            onChange={handleInputChange}
                                            className='p-1 outline-none'
                                            type="date" name="delivery" min={today} />
                                    </div>
                                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                        <label htmlFor="receive">Estimation Received:</label>
                                        <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                        <input
                                            value={formData.receive}
                                            onChange={handleInputChange}
                                            className='p-1 outline-none'
                                            type="date" name="receive" min={today} />
                                    </div>
                                </form>
                                {
                                    (formData.rfq && vendorRFQs.length != 0) && <div className="w-full flex flex-col items-center gap-4">
                                        {
                                            isClicked && <div className="w-full flex items-center justify-center">
                                                {
                                                    loadPdts ?
                                                        <div className='w-full flex items-center justify-center my-4'>
                                                            <CircularProgress />
                                                        </div> :
                                                        errPdts ?
                                                            <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                                                                Error: {errPdts}
                                                            </div> :
                                                            <div className="w-full flex flex-col items-center justify-start gap-4">
                                                                <div className="w-full flex items-start justify-start max-h-[20rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                                                    {
                                                                        pdts.length === 0 ? <div className="w-full text-left">No product found!</div>
                                                                            :
                                                                            <table className='w-full border-collapse mt-4'>
                                                                                <thead>
                                                                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                                                                        <th>Product Name</th>
                                                                                        <th>Image</th>
                                                                                        <th>Specification</th>
                                                                                        <th>Quantity</th>
                                                                                        <th>Price</th>
                                                                                        <th>Total Price</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {
                                                                                        pdts.map(pdt => {
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
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    <td>{pdt.qty}</td>
                                                                                                    <td>
                                                                                                        {
                                                                                                            pdt.curr === 'IDR' ?
                                                                                                                new Intl.NumberFormat('id-ID', {
                                                                                                                    style: 'currency',
                                                                                                                    currency: 'IDR',
                                                                                                                }).format(pdt.price) :
                                                                                                                new Intl.NumberFormat('en-US', {
                                                                                                                    style: 'currency',
                                                                                                                    currency: 'USD',
                                                                                                                }).format(pdt.price)
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        {
                                                                                                            pdt.curr === 'IDR' ?
                                                                                                                new Intl.NumberFormat('id-ID', {
                                                                                                                    style: 'currency',
                                                                                                                    currency: 'IDR',
                                                                                                                }).format(pdt.qty * pdt.price) :
                                                                                                                new Intl.NumberFormat('en-US', {
                                                                                                                    style: 'currency',
                                                                                                                    currency: 'USD',
                                                                                                                }).format(pdt.qty * pdt.price)
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
                                                                <div className="w-full flex items-center justify-end text-black text-lg font-medium">
                                                                    Total amount: {totalPrice}
                                                                </div>
                                                                {
                                                                    fieldError && <div className="w-full flex items-center justify-start -my-3">
                                                                        <div className='text-xs text-red-600 italic font-medium'>{fieldError}</div>
                                                                    </div>
                                                                }
                                                                <div className="w-full flex items-center justify-end">
                                                                    {
                                                                        saveLoader ?
                                                                            <div className='flex items-center justify-center m-4'>
                                                                                <CircularProgress />
                                                                            </div>
                                                                            :
                                                                            <button onClick={handleSavePO}
                                                                                className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                                                Save PO
                                                                            </button>
                                                                    }
                                                                </div>
                                                            </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                }
            </Dialog >

            <Dialog
                size='xl'
                open={viewPO}
                handler={() => setViewPO(curr => !curr)}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg gap-4">
                    {
                        loadPdts ?
                            <div className='w-full flex items-center justify-center my-4'>
                                <CircularProgress />
                            </div>
                            : errPdts ?
                                <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                                    Error: {errPdts}
                                </div>
                                :
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="w-full flex flex-col items-center text-black">
                                        <div className="w-full text-left font-semibold">PO Id: <span className='font-normal'>{poDetails.poId}</span></div>
                                        <div className="w-full text-left font-semibold">Vendor: <span className='font-normal'>{poDetails.vendor}</span></div>
                                    </div>
                                    <div className="w-full flex items-start justify-start max-h-[30rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                        <table className='w-full border-collapse mt-4'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>Product Name</th>
                                                    <th>Image</th>
                                                    <th>Specification</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Total Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    pdts.map(pdt => {
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
                                                                    </div>
                                                                </td>
                                                                <td>{pdt.qty}</td>
                                                                <td>
                                                                    {
                                                                        pdt.curr === 'IDR' ?
                                                                            new Intl.NumberFormat('id-ID', {
                                                                                style: 'currency',
                                                                                currency: 'IDR',
                                                                            }).format(pdt.price) :
                                                                            new Intl.NumberFormat('en-US', {
                                                                                style: 'currency',
                                                                                currency: 'USD',
                                                                            }).format(pdt.price)
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        pdt.curr === 'IDR' ?
                                                                            new Intl.NumberFormat('id-ID', {
                                                                                style: 'currency',
                                                                                currency: 'IDR',
                                                                            }).format(pdt.qty * pdt.price) :
                                                                            new Intl.NumberFormat('en-US', {
                                                                                style: 'currency',
                                                                                currency: 'USD',
                                                                            }).format(pdt.qty * pdt.price)
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="w-full flex items-center justify-end text-black text-lg font-medium">
                                        Total amount: {totalPrice}
                                    </div>
                                </div>
                    }
                </div>
            </Dialog>
        </div >
    )
}




//RFQ

const RFQ = ({ fetchAllProductsMain, projectDetails }) => {

    const token = localStorage.getItem('token');
    const address = useParams();

    const today = new Date().toISOString().split('T')[0];

    const [selectedProducts, setSelectedProducts] = useState([]);

    const [addPdt, setAddPdt] = useState(false);
    const handleAddPdt = () => { setAddPdt(curr => !curr) };

    const [formData, setFormData] = useState(
        {
            rfqId: '',
            projectId: address.id,
            vendor: '',
            curr: 'USD',
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
        setLoading1(true);
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

    const [rfqs, setRfqs] = useState([]);

    const [zeroQty, setZeroQty] = useState(false);

    const [saveLoader, setSaveLoader] = useState(false);

    const [add, setAdd] = useState(false);

    const handleAddNew = () => {
        setFormData(
            {
                rfqId: '',
                projectId: address.id,
                vendor: '',
                curr: 'USD',
                deadline: ''
            }
        );
        setZeroQty(false);
        setSelectedProducts([]);
        setAdd(curr => !curr);
        setAddPdt(false);
    };

    const handleSaveRFQ = async () => {

        if (!formData.vendor || !formData.curr || !formData.deadline) {
            toast.error("Fill all the mandatory fields!");
            return;
        }
        else {
            const productQties = selectedProducts.map(product => ({
                productId: product._id,
                qty: product.qty
            }));

            const invalidProducts = productQties.filter(item => item.qty <= 0);

            if (invalidProducts.length > 0) {
                setZeroQty(true);
                toast.error("Please provide quantities greater than zero for all selected products!");
                return;
            }
            else {
                try {
                    setSaveLoader(true);

                    const response = await axios.post(`${backendServer}/api/add-rfq`, {
                        rfqId: `RFQ-00${rfqs.length + 1}`,
                        projectId: address.id,
                        vendor: formData.vendor,
                        curr: formData.curr,
                        deadline: formData.deadline,
                        products: productQties
                    });

                    fetchRFQDetails();
                    fetchAllProductsMain();
                    setAdd(false);
                    setSaveLoader(false);
                    toast.success(response.data.message);
                } catch (error) {
                    toast.error(error.response?.data?.message || "An error occurred while saving the RFQ.");
                }
            }
        }
    };


    const fetchRFQDetails = async () => {
        setLoading2(true);
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

    const [rfqDetails, setRFQDetails] = useState({
        id: '', vendor: ''
    })

    const [rfqMenuLoader, setRfqMenuLoader] = useState(false);

    const fetchAddedRFQPdts = async (_id) => {
        setRfqMenuLoader(true);
        try {
            const response = await axios.get(`${backendServer}/api/getRFQPdts/${_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReqRFQPdts(response.data.products);
            setRfqCurr(response.data.curr);
            setRfqCurrPdts(response.data.rfqPdts);
            setRFQDetails({
                id: response.data.rfqId,
                vendor: response.data.vendor
            })
            setRrLoading(false);
            setRfqMenuLoader(false);
        } catch (error) {
            setRrError(error.response.data.message);
            setRrLoading(false);
            setRfqMenuLoader(false);
        }
    };

    const handleRrOpen = (_id) => {
        setViewRFQ(false);
        setPrices({});
        setReqRFQPdts([]);
        setRFQDetails({
            id: '', vendor: ''
        });
        setRrOpen(curr => !curr);
        fetchAddedRFQPdts(_id);
        setCurrentRFQId(_id);
        setZeroPrice(false);
    };

    const handleViewRFQ = (_id) => {
        setViewRFQ(true);
        setRrLoading(true);
        setRfqCurr(null);
        setRfqCurrPdts([]);
        setRFQDetails({
            id: '', vendor: ''
        });
        setRrOpen(curr => !curr);
        fetchAddedRFQPdts(_id);
        setCurrentRFQId(_id);
        setZeroPrice(false);
    };

    const [prices, setPrices] = useState({});

    const handlePriceChange = (e, id) => {
        const val = e.target.value;
        setPrices(prevPrices => ({
            ...prevPrices,
            [id]: val
        }));
    };

    const [zeroPrice, setZeroPrice] = useState(false);

    const [recSaveLoader, setRecSaveLoader] = useState(false);

    const handleReceiveRFQ = async () => {
        setRecSaveLoader(true);
        try {
            const productPrices = reqRFQPdts.map(product => ({
                productId: product._id,
                price: prices[product._id]
            })).filter(item => item.price > 0);

            const allPricesValid = productPrices.every(item => item.price > 0);

            if (!allPricesValid || productPrices.length === 0) {
                setZeroPrice(true);
                toast.error('All product prices must be greater than 0.');
                setRecSaveLoader(false);
                return;
            }

            await axios.put(`${backendServer}/api/updatePdtPrice/${currentRFQId}`, productPrices);

            fetchAllProductsMain();
            fetchRFQDetails();
            setRrOpen(false);
            setCurrentRFQId(null);
            toast.success('Prices updated successfully!');
            setRecSaveLoader(false);
        } catch (error) {
            toast.error('Failed to update prices. Please try again.');
            console.error(error);
            setRecSaveLoader(false);
        }
    };

    // Download RFQ

    const flattenData = (data) => {
        return data.map(item => ({
            RFQ_No: item.orgRFQId,
            RFQ_Deadline: item.orgDeadline,
            Vendor: item.orgVendor,
            Currency_unit: item.orgCurrUnit,
            RFQ_Status: item.orgPOStatus,
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
            Quantity: item.qty ? item.qty.toString() : '',
            Item_price: item.price ? item.price.toString() : '',
            Image_URL: item.imageUrl || '',
        }));
    };

    const handleDownload = async (id, name) => {
        setRfqMenuLoader(true);
        try {
            const response = await axios.get(`${backendServer}/api/getDwdRFQPdts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = flattenData(response.data);

            const doc = new jsPDF();

            for (let i = 0; i < data.length; i++) {
                const item = data[i];

                doc.setFontSize(8);
                doc.setTextColor(0, 0, 255);
                doc.setFont('helvetica', 'bold');
                doc.text("HALE by HENDERSON", 105, 10, { align: 'center' });

                doc.setTextColor(0, 0, 0);
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                doc.text(item.Title.toUpperCase(), 105, 25, { align: 'center' });

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(128, 128, 128);
                doc.text("SPECIFICATION SHEET", 105, 35, { align: 'center' });

                doc.setDrawColor(0, 0, 0);
                doc.setLineWidth(1);
                doc.line(10, 40, 200, 40);

                if (item.Image_URL) {
                    const img = new Image();
                    img.src = item.Image_URL;
                    img.crossOrigin = 'anonymous';

                    await new Promise((resolve) => {
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);

                            const imgData = canvas.toDataURL('image/png');
                            const maxWidth = 120;
                            const aspectRatio = img.width / img.height;
                            const width = maxWidth;
                            const height = maxWidth / aspectRatio;

                            doc.addImage(imgData, 'PNG', 45, 50, width, height);
                            resolve();
                        };

                        img.onerror = () => {
                            resolve();
                        };
                    });
                }

                const yPosAfterImage = 200;
                doc.setLineWidth(0.5);
                doc.line(10, yPosAfterImage + 10, 200, yPosAfterImage + 10);

                const yPos = yPosAfterImage + 20;

                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'bold');
                doc.text("DESCRIPTION", 15, yPos);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(item.Description || "N/A", 15, yPos + 10);

                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text("SPECS", 120, yPos);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Measuring Unit: ${item.Measuring_unit}`, 120, yPos + 10);
                doc.text(`Length: ${item.Length}`, 120, yPos + 15);
                doc.text(`Width: ${item.Width}`, 120, yPos + 20);
                doc.text(`Diameter: ${item.Diameter}`, 120, yPos + 25);
                doc.text(`Color: ${item.Color}`, 120, yPos + 30);
                doc.text(`Material: ${item.Material}`, 120, yPos + 35);

                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(128, 128, 128);
                doc.text("Henderson", 105, 290, { align: 'center' });


                if (i < data.length - 1) {
                    doc.addPage();
                }
            }

            doc.save(`RFQ_Details_${name}.pdf`);
            setRfqMenuLoader(false);
        } catch (error) {
            console.log(error);
            setRfqMenuLoader(false);
        }
    };


    return (
        <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg gap-4">
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
                        <div className="w-full flex flex-col items-center justify-start gap-4">
                            <div className="w-full flex items-center justify-start">
                            {(projectDetails.progress != GlobalVariable.Progress.NotStarted) && (projectDetails.progress != GlobalVariable.Progress.ProjectCompleted) && 
                                <button onClick={handleAddNew}
                                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                    ADD NEW RFQ
                                </button>
                            }
                            </div>
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
                                                            <tr key={rfq._id}>
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
                                                                            menuOpen === rfq._id &&
                                                                            <div style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px" }}
                                                                                className="w-[10rem] flex flex-col items-center p-2 fixed bg-white ml-[12rem] mt-16">
                                                                                {
                                                                                    rfqMenuLoader ? <div className="w-full text-center my-4"><CircularProgress /></div> :
                                                                                        <div className="w-full flex flex-col items-center gap-2">
                                                                                            {
                                                                                                rfq.status === "Received RFQ" ?
                                                                                                    <button onClick={() => handleViewRFQ(rfq._id)}
                                                                                                        className='w-full text-left'>View RFQ</button>
                                                                                                    :
                                                                                                    <button onClick={() => handleRrOpen(rfq._id)}
                                                                                                        className='w-full text-left'>Receive RFQ</button>
                                                                                            }

                                                                                            <div className="w-full h-[2px] bg-gray-300"></div>

                                                                                            <button onClick={() => handleDownload(rfq._id, rfq.rfqId)}
                                                                                                className='w-full text-left'>Download RFQ</button>
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td>{rfq.rfqId}</td>
                                                                <td>{rfq.deadline}</td>
                                                                <td>{rfq.vendor}</td>
                                                                {
                                                                    rfq.status === 'Received RFQ' ?
                                                                        <td className='text-green-600 font-medium'>{rfq.status}</td> : <td>{rfq.status}</td>
                                                                }
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
            {
                rfqs.length != 0 &&
                <div className='w-full flex items-center justify-end gap-2'>

                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center cursor-pointer">
                        <MdOutlineKeyboardArrowLeft className='text-xl' />
                    </button>

                    <div className='text-gray-800 text-sm'>
                        Page {currentPage} of {totalPages}
                    </div>

                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center cursor-pointer">
                        <MdOutlineKeyboardArrowRight className='text-xl' />
                    </button>

                </div>
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
                                            <div className="w-full flex flex-col items-center">
                                                <div className="w-full text-left font-semibold">RFQ Id: <span className='font-normal'>{rfqDetails.id}</span></div>
                                                <div className="w-full text-left font-semibold">Vendor: <span className='font-normal'>{rfqDetails.vendor}</span></div>
                                            </div>
                                        }
                                        <table className='w-full border-collapse mt-2'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>Product Code</th>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Image</th>
                                                    <th>Specification</th>
                                                    <th>Price per Unit (USD)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    reqRFQPdts.map(pdt => {
                                                        return (
                                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                <td>{pdt.code}</td>
                                                                <td>{pdt.title}</td>
                                                                <td>{pdt.qty}</td>
                                                                <td>
                                                                    <div style={{ display: 'grid', placeItems: 'center', height: '200px' }}>
                                                                        <img
                                                                            src={pdt.imageUrl}
                                                                            alt="Product Image"
                                                                            style={{ maxWidth: '200px', maxHeight: '200px', height: 'auto', width: 'auto' }}
                                                                        />
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
                                                                <td>
                                                                <div className="w-full flex flex-col items-center text-center gap-2">
                                                                    <input value={prices[pdt._id] || ''} onChange={(e) => handlePriceChange(e, pdt._id)}
                                                                        placeholder={`${rfqCurr}`}
                                                                        className={`w-full p-1.5 outline-none ${prices[pdt._id] <= 0 ? 'border border-solid border-red-600' : 'border-none'}`}
                                                                        type="number" min="1" name=""  style={{ textAlign: 'center' }}  />
                                                                </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })

                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {
                                        zeroPrice && <div className="w-full text-left text-xs text-red-600 italic -my-2">All product prices must be greater than 0.</div>
                                    }
                                    {
                                        !viewRFQ &&
                                        <div className="w-full flex items-center justify-end my-1">
                                            {
                                                recSaveLoader ? <CircularProgress /> :
                                                    <button onClick={handleReceiveRFQ}
                                                        className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                                        Receive RFQ
                                                    </button>
                                            }
                                        </div>
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
                style={{ width: '60%', maxWidth: '90%', minWidth: '300px' }}
            >
                {
                    addPdt ?
                        <div className="w-full flex flex-col items-center p-4 bg-white rounded-lg text-black gap-2">
                            <div className="w-full flex items-center justify-end">
                                <MdOutlineClose onClick={() => setAddPdt(false)} className='text-xl cursor-pointer' />
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
                                                    <table className='w-full border-collapse'>
                                                        <thead className='text-nowrap'>
                                                            <tr className='text-gray-700 text-lg'>
                                                                <th>Action</th>
                                                                <th>Product Code</th>
                                                                <th>Product Name</th>
                                                                <th>Quantity</th>
                                                                <th>Image</th>
                                                                <th>Specification</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                onlyProducts.map(pdt => {
                                                                    return (
                                                                        <tr>
                                                                            <td>
                                                                                <input type="checkbox"
                                                                                checked={selectedProducts.some(p => p._id === pdt._id)}
                                                                                onChange={() => handleCheckboxChange(pdt)} />

                                                                            </td>
                                                                            <td >{pdt.code}</td>
                                                                            <td >{pdt.title}</td>
                                                                            <td >{pdt.qty}</td>
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

                            }
                            <div className="w-full flex items-center justify-end my-1">
                                <button onClick={handleSave}
                                    className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white'>
                                    Save
                                </button>
                            </div>
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
                                        vendors.length === 0 ? <div className="w-full text-left">No registered vendor found!</div> :
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
                                                {/* <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
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
                                            </div> */}
                                                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                                    <label htmlFor="deadline">Deadline:</label>
                                                    <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                                                    <input
                                                        value={formData.deadline}
                                                        onChange={handleInputChange}
                                                        className='p-1 outline-none'
                                                        type="date" name="deadline" id="deadline" min={today} />
                                                </div>
                                            </form>
                            }
                            {
                                vendors.length != 0 && <div className="w-full flex items-center justify-end">
                                    <button onClick={handleAddPdt}
                                        className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white my-1'>
                                        {selectedProducts.length === 0 ? "Add Product" : "Edit Selected Product(s)"}
                                    </button>
                                </div>
                            }

                            {
                                selectedProducts.length === 0 ? <div className="w-full text-left font-medium">No product is added!</div>
                                    :
                                    <div className="w-full flex items-start justify-center max-h-[15rem] overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                                        <table className='w-full border-collapse mt-2'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>Product Code</th>
                                                    <th>Product Name</th>                                                    
                                                    <th>Quantity</th>
                                                    <th>Image</th>
                                                    <th>Specification</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    selectedProducts.map(pdt => {
                                                        return (
                                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                <td>{pdt.code}</td>
                                                                <td>{pdt.title}</td>
                                                                <td>{pdt.qty}</td>
                                                                <td style={{ 
                                                                                display: 'flex', 
                                                                                justifyContent: 'center', 
                                                                                alignItems: 'center', 
                                                                                padding: '10px', // Optional: Add padding for spacing
                                                                                height: '200px' // Ensure height is sufficient to fit the image
                                                                            }}>
                                                                <img src={pdt.imageUrl} alt="Product Image" style={{ maxWidth: '200px', maxHeight: '200px', height: 'auto', width: 'auto' }} />
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
                                    </div>
                            }
                            {zeroQty && <div className="w-full text-left text-xs italic text-red-600">Quantity must be greater than zero.</div>}
                            {
                                selectedProducts.length != 0 &&
                                <div className="w-full flex items-center justify-end">
                                    {
                                        saveLoader ?
                                            <div className='flex items-center justify-center m-4'>
                                                <CircularProgress />
                                            </div>
                                            :
                                            <button onClick={handleSaveRFQ}
                                                className='flex items-center justify-center gap-3 px-5 py-1.5 rounded-lg bg-[#7F55DE] text-white mt-2'>
                                                Save RFQ
                                            </button>
                                    }
                                </div>
                            }
                        </div>
                }
            </Dialog>
        </div>
    );
}


//Procurement

const Products = () => {

    const navigate = useNavigate();
    const address = useParams();

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    const fetchAllProducts = async () => {
        setLoading(true);
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

    const fetchProjectDetails = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/project/${address.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const project = response.data;
            setProjectDetails(project);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    const [projectDetails, setProjectDetails] = useState([]);

    useEffect(() => {
        fetchAllProducts();
        fetchProjectDetails();
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

    const [po, setPo] = useState(false);

    const handlePO = () => {
        setPo(state => !state);
    }

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full min-h-screen flex flex-col items-center justify-start rounded-lg">
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
                                {
                                    onlyProducts.length != 0 && <div className="w-full flex items-center justify-start gap-6">
                                        <button onClick={handleRFQ}
                                            className='px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>RFQ</button>
                                        <button onClick={handlePO}
                                            className='px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>PO</button>
                                    </div>
                                }
                                {
                                    onlyProducts.length === 0 ?
                                        <div className="w-full flex items-center justify-start text-lg font-medium">
                                            No products found!
                                        </div> :
                                        <div className="w-full flex flex-col items-center">
                                            <table className='w-full border-collapse mt-6'>
                                                <thead>
                                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                                        <th>Product Code</th>
                                                        <th>Product Name</th>
                                                        <th>Item Status</th>
                                                        <th>Latest RFQ Number</th>
                                                        <th>Latest RFQ Sent Date</th>
                                                        <th>Latest RFQ Receive Date</th>
                                                        <th>PO Number</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        current.map(pdt => {
                                                            return (
                                                                <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                    <td>{pdt.code}</td>
                                                                    <td>{pdt.title}</td>
                                                                    {
                                                                        pdt.status === "Pending" ? <td className='font-medium text-gray-600'>Approval pending</td> :
                                                                            pdt.status === "Approved" ? <td className='font-medium text-green-600'>Approved</td> :
                                                                                pdt.status === "Rejected" ? <td className='font-medium text-red-600'>Rejected</td> : ''
                                                                    }
                                                                    <td>{pdt.rfqNumber}</td>
                                                                    <td>{pdt.rfqSentDate}</td>
                                                                    <td>{pdt.rfqReceiveDate}</td>
                                                                    <td>{pdt.poNumber}</td>
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

                                                <div className='text-gray-800 text-sm'>
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
                <RFQ 
                    fetchAllProductsMain={fetchAllProducts} 
                    projectDetails={projectDetails}
                />
            </Dialog>

            <Dialog
                size="xl"
                open={po}
                handler={handlePO}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <PO 
                    fetchAllProductsMain={fetchAllProducts}
                    projectDetails={projectDetails} 
                />
            </Dialog>
        </div>
    );
};

export default Products;
