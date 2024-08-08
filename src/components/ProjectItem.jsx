import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { backendServer } from '../utils/info';
import toast from 'react-hot-toast';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import GlobalVariable from '../utils/GlobalVariable';

const RefForm = ({ id, fetchDetails, handleClose, editItem, isEditMode }) => {
    const initialFormData = isEditMode ? editItem : { projectId: id, type: 'Reference', title: '', desc: '' };
    const [formData, setFormData] = useState(initialFormData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(isEditMode ? editItem.imageUrl : '');
    const [fileName, setFileName] = useState(isEditMode ? editItem.imageUrl.split('/').pop() : '');

    useEffect(() => {
        if (isEditMode) {
            setImageUrl(editItem.imageUrl);
            setFileName(editItem.imageUrl.split('/').pop());
        }
    }, [isEditMode, editItem]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const resetForm = () => {
        setFormData({ projectId: id, type: 'Reference', title: '', desc: '' });
        setSelectedFile(null);
        setImageUrl('');
        setFileName('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditMode ? (formData.title.length === 0 || formData.desc.length === 0) : (formData.title.length === 0 || formData.desc.length === 0 || !selectedFile)) {
            toast.error("Fill the mandatory fields!");
            handleClose();
        } else {
            try {
                const uploadedImageUrl = await handleUpload();

                if (!uploadedImageUrl) return;

                const finalFormData = { ...formData, imageUrl: uploadedImageUrl };

                if (isEditMode) {
                    const response = await axios.put(`${backendServer}/api/product/${formData._id}`, finalFormData);
                    toast.success(response.data.message);
                } else {
                    const response = await axios.post(`${backendServer}/api/newProduct`, finalFormData);
                    toast.success(response.data.message);
                }
                handleClose();
                fetchDetails();
                resetForm();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-start gap-2 text-black">
                <label htmlFor="title">Title:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input value={formData.title} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='title' placeholder='Type here...' />
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="desc">Description:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <textarea value={formData.desc} onChange={handleInputChange}
                    className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                    name="desc" rows="2" placeholder='Type here...'></textarea>
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="file">Attachment:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input className='w-fit' type="file" onChange={handleFileChange} name='file' />
            </div>
            {fileName && <div className="w-full text-left text-sm">Uploaded file: {fileName}</div>}
            <button type="submit" className='w-full p-1.5 rounded-lg bg-[#7F55DE] text-white font-medium'>
                {isEditMode ? 'Update Item' : 'Add Item'}
            </button>
        </form>
    );
};

const PdtForm = ({ id, fetchDetails, handleClose, editItem, isEditMode }) => {
    const token = localStorage.getItem('token');

    const initialFormData = isEditMode && editItem ? {
        projectId: id,
        type: 'Product',
        name: editItem.title || '',
        code: editItem.productDetails?.code || '',
        unit: editItem.productDetails?.unit || '',
        len: editItem.productDetails?.len || '',
        wid: editItem.productDetails?.wid || '',
        dia: editItem.productDetails?.dia || '',
        color: editItem.productDetails?.color || '',
        material: editItem.productDetails?.material || '',
        insert: editItem.productDetails?.insert || '',
        finish: editItem.productDetails?.finish || '',
        qty: editItem.productDetails?.qty || '',
        vendor: editItem.productDetails?.vendor || '',
        budget: editItem.productDetails?.budget || '',
        buyCost: editItem.productDetails?.buyCost || '',
        sellCost: editItem.productDetails?.sellCost || '',
        desc: editItem.desc || '',
        imageUrl: editItem.imageUrl || ''
    } : {
        projectId: id,
        type: 'Product',
        name: '',
        code: '',
        unit: '',
        len: null,
        wid: null,
        dia: null,
        color: '',
        material: '',
        insert: '',
        finish: '',
        qty: null,
        vendor: '',
        budget: null,
        buyCost: null,
        sellCost: null,
        desc: '',
        imageUrl: ''
    };
    const [FurnishingType, setFurnishingType] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState(isEditMode && editItem ? editItem.imageUrl.split('/').pop() : '');
    const [vendors, setVendors] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode && editItem) {
            setFormData({
                projectId: id,
                type: 'Product',
                name: editItem.title || '',
                code: editItem.productDetails?.code || '',
                unit: editItem.productDetails?.unit || '',
                len: editItem.productDetails?.len || '',
                wid: editItem.productDetails?.wid || '',
                dia: editItem.productDetails?.dia || '',
                color: editItem.productDetails?.color || '',
                material: editItem.productDetails?.material || '',
                insert: editItem.productDetails?.insert || '',
                finish: editItem.productDetails?.finish || '',
                qty: editItem.productDetails?.qty || '',
                vendor: editItem.productDetails?.vendor || '',
                budget: editItem.productDetails?.budget || '',
                buyCost: editItem.productDetails?.buyCost || '',
                sellCost: editItem.productDetails?.sellCost || '',
                desc: editItem.desc || '',
                imageUrl: editItem.imageUrl || ''
            });
            setFileName(editItem.imageUrl.split('/').pop());
        }
    }, [editItem, isEditMode, id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    };

    const handleUpload = async () => {
        if (!selectedFile) return formData.imageUrl;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditMode ? (formData.name.length === 0 || formData.code.length === 0 || formData.qty.length === 0) : (formData.name.length === 0 || formData.code.length === 0 || formData.qty.length === 0 || !selectedFile)) {
            toast.error("Fill the mandatory fields");
            handleClose();
        } else {
            try {
                const uploadedImageUrl = await handleUpload();

                if (uploadedImageUrl !== null) {
                    const finalFormData = { ...formData, imageUrl: uploadedImageUrl };

                    if (isEditMode) {
                        const response = await axios.put(`${backendServer}/api/newProductItem/${editItem._id}`, finalFormData);
                        toast.success(response.data.message);
                    } else {
                        const response = await axios.post(`${backendServer}/api/newProductItem`, finalFormData);
                        toast.success(response.data.message);
                    }
                    handleClose();
                    fetchDetails();
                    resetForm();
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            projectId: id,
            type: 'Product',
            name: '',
            code: '',
            unit: '',
            len: null,
            wid: null,
            dia: null,
            color: '',
            material: '',
            insert: '',
            finish: '',
            qty: null,
            vendor: '',
            budget: null,
            buyCost: null,
            sellCost: null,
            desc: '',
            imageUrl: ''
        });
        setSelectedFile(null);
        setFileName('');
    };

    const fetchVendorsNames = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/getvendornames`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVendors(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchFurnishingType = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/configuration/` + GlobalVariable.ConfigurationType.Furnishing, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFurnishingType(response.data.configuration);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchVendorsNames();
        fetchFurnishingType();
    }, []);

    if (error) return (
        <div className="w-full flex items-center justify-center text-red-600 font-medium">
            Error: {error}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-4'>
            <div className="w-full flex items-center justify-center gap-4">
                { <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="code">Furnishing:</label>
                    <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                    <select
                        value={formData.furnishing}
                        onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        name='furnishing'
                    >
                        <option value="" disabled>Select an option</option>
                        {FurnishingType.map((option) => (
                        <option key={option.code} value={option.name}>
                            {option.name}
                        </option>
                        ))}
                    </select>
                </div> }       
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="name">Item Name:</label>
                    <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                    <input value={formData.name} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='name' placeholder='Type here...' />
                </div>         
                {/* <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="code">Item Code:</label>
                    <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                    <input value={formData.code} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='code' placeholder='Type here...' />
                </div> */}
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="unit">Size Unit:</label>
                    <select
                        value={formData.unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>

            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="len">L:</label>
                    <input value={formData.len} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='len' placeholder='Length' />
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wid">W:</label>
                    <input value={formData.wid} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='wid' placeholder='Width' />
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="height">H:</label>
                    <input value={formData.height} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='height' placeholder='Height' />
                </div>                
            </div>
            <div className="w-full flex items-center justify-start gap-2">              
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="depth">D:</label>
                    <input value={formData.depth} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='depth' placeholder='Depth' />
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="seatheight">SH:</label>
                    <input value={formData.seatheight} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='seatheight' placeholder='Seat height' />
                </div>                                
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="dia">Dia:</label>
                    <input value={formData.dia} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='diameter' placeholder='Diameter' />
                </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="color">Color:</label>
                    <input value={formData.color} onChange={handleInputChange}
                        className='w-full outline-none p-[2px]'
                        type="color" name='color' />
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="material">Material:</label>
                    <input value={formData.material} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='material' placeholder='Type here...' />
                </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="insert">Insert:</label>
                    <input value={formData.insert} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='insert' placeholder='Type here...' />
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="finish">Finish:</label>
                    <input value={formData.finish} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='finish' placeholder='Type here...' />
                </div>
            </div>

            <div className="w-full flex items-start justify-start gap-2 text-black text-nowrap">
                <label htmlFor="qty">Quantity:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input value={formData.qty} onChange={handleInputChange}
                    className='w-full max-w-[40%] outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='qty' placeholder='Type here...' />
            </div>

            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="vendor">Vendor:</label>
                    <select
                        value={formData.vendor}
                        onChange={handleInputChange}
                        className='w-full p-1 outline-none' name="vendor">
                        <option value="" disabled>Select an option</option>
                        {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                        ))}
                    </select>
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="budget">Budget ($):</label>
                    <input value={formData.budget} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='budget' placeholder='Type here...' />
                </div>
            </div>

            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="buyCost">Buying cost ($):</label>
                    <input value={formData.buyCost} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='buyCost' placeholder='Type here...' />
                </div>
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="sellCost">Selling cost ($):</label>
                    <input value={formData.sellCost} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="number" name='sellCost' placeholder='Type here...' />
                </div>
            </div>

            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="desc">Description:</label>
                <textarea value={formData.desc} onChange={handleInputChange}
                    className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                    name="desc" rows="2" placeholder='Type here...'></textarea>
            </div>

            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="file">Attachment:</label>
                <sup className='-ml-2 mt-2 text-lg text-red-600 font-medium'>*</sup>
                <input type="file" onChange={handleFileChange} name='file' />
            </div>

            {fileName && <div className="w-full text-left text-sm">Uploaded file: {fileName}</div>}

            <button type="submit" className='w-full p-1.5 rounded-lg bg-[#7F55DE] text-white font-medium'>
                {isEditMode ? 'Update Item' : 'Add Item'}
            </button>
        </form>
    );
};

const ProjectItem = ({ name, id, isOpen, handleOpen, handleClose, addressID, fetchSections }) => {
    const loggedInUser = localStorage.getItem('name');

    const token = localStorage.getItem('token');

    const [type, setType] = useState('ref');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [comments, setComments] = useState({});
    const [editItem, setEditItem] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleChange = (e) => {
        setType(e.target.value);
    };

    const handleInputChange = (e, _id) => {
        const { name, value } = e.target;
        setComments(prevComments => ({
            ...prevComments,
            [_id]: {
                ...prevComments[_id],
                [name]: value
            }
        }));
    };

    const resetCommentForm = (_id) => {
        setComments(prevComments => ({
            ...prevComments,
            [_id]: {
                name: loggedInUser,
                body: ''
            }
        }));
    };

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/allProducts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoading(false);
            setProducts(response.data.allProducts);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const createNewComment = async (e, _id) => {
        e.preventDefault();
        if (comments[_id].body.length === 0) {
            toast.error("Can't submit empty comment!");
        }
        try {
            if (comments[_id].body.length > 0) {
                const response = await axios.put(`${backendServer}/api/product/${id}/${loggedInUser}/newComment/${_id}`, comments[_id]);
                toast.success(response.data.message);
                resetCommentForm(_id);
                fetchProductDetails();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setIsEditMode(true);
        handleOpen();
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.delete(`${backendServer}/api/product/${id}`);
            toast.success(response.data.message);
            fetchProductDetails();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const deleteSection = async (id) => {
        try {
            const response = await axios.delete(`${backendServer}/api/deleteSection/${id}`);
            toast.success(response.data.message);
            fetchSections();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, []);

    return (
        <div className="w-full flex items-center justify-center bg-[#F8F9FD] p-4">
            <div className="w-full flex flex-col items-center justify-start gap-3 p-4 bg-white">
                <div className="w-full flex items-center justify-between text-gray-900 text-[1.325rem] font-semibold">
                    <div>{name}</div>
                    <MdDeleteOutline onClick={() => deleteSection(id)} className='text-3xl text-red-600 cursor-pointer' />
                </div>
                <div className="w-full h-[2px] bg-gray-300"></div>
                <div className="w-full flex items-center justify-between">
                    <div className='text-black font-medium text-lg'>Project Items</div>
                    <button onClick={() => { setIsEditMode(false); handleOpen(); }}
                        type="button" className='w-fit bg-[#7F55DE] p-2 px-3 text-white text-base font-medium rounded-lg flex items-center justify-center gap-2'>
                        <IoMdAdd className='text-xl' />
                    </button>
                </div>
                <div className="w-full flex flex-col items-center justify-start border-2 border-solid border-gray-300 rounded-lg p-3 gap-3">
                    {
                        products.length === 0 ? (
                            <div className='w-full flex items-center justify-start text-black font-medium'>No product details found!</div>
                        ) : (
                            products.map(pdt => (
                                <div key={pdt._id} className="w-full flex flex-col items-center gap-3 border-2 border-solid border-gray-300 rounded-lg p-3">
                                    <div className="w-full flex items-center justify-end gap-1">
                                        <FaEdit onClick={() => handleEdit(pdt)} className='text-xl cursor-pointer' />
                                        <MdDeleteOutline onClick={() => handleDeleteItem(pdt._id)} className='text-2xl text-red-600 cursor-pointer' />
                                    </div>
                                    {
                                        pdt.type === 'Reference' ?
                                            (
                                                <div className="w-full flex items-start justify-center gap-3 text-black">
                                                    <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <span className='font-semibold'>{pdt.type}:</span>
                                                            <span>{pdt.title}</span>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <img src={pdt.imageUrl} alt="" />
                                                    </div>
                                                    <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                        <div className="w-full flex items-center justify-start font-semibold">Description</div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start">{pdt.desc}</div>
                                                    </div>
                                                    <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="font-semibold">Comments</div>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        {
                                                            pdt.comments.length === 0 ?
                                                                <div className="w-full items-center justify-start">No comment yet!</div> :
                                                                pdt.comments.map(comment => (
                                                                    <div key={comment._id} className="w-full flex flex-col items-center bg-[#F8F9FD] gap-1">
                                                                        <div className="w-full flex items-center justify-start p-2 text-base font-medium gap-2">
                                                                            <FaUserCircle className='text-xl' />
                                                                            <div>{comment.name}</div>
                                                                            <div className='text-sm'>{comment.createdAt.split('T')[0]}</div>
                                                                        </div>
                                                                        <div className="w-full flex items-center justify-start p-2 bg-white">{comment.body}</div>
                                                                    </div>
                                                                ))
                                                        }
                                                        <form onSubmit={(e) => createNewComment(e, pdt._id)} className="w-full flex items-start gap-3 mt-4">
                                                            <textarea
                                                                value={comments[pdt._id]?.body || ''}
                                                                onChange={(e) => handleInputChange(e, pdt._id)}
                                                                className='w-full p-2 border border-solid border-gray-300 outline-none'
                                                                placeholder='Type here...'
                                                                name="body"
                                                            ></textarea>
                                                            <button
                                                                type="submit"
                                                                className='w-fit bg-[#7F55DE] p-1.5 px-3 text-white text-base font-medium rounded-lg'
                                                            >
                                                                Send
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            ) :
                                            (
                                                <div className="w-full flex items-start justify-center gap-3 text-black">
                                                    <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <span className='font-semibold'>{pdt.type}:</span>
                                                            <span>{pdt.title} ({pdt.productDetails.code})</span>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <img src={pdt.imageUrl} alt="" />
                                                    </div>

                                                    <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                        <div className="w-full flex items-center justify-start font-semibold">Description</div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start">{pdt.desc}</div>
                                                        <div className="w-full h-[1.5px] bg-gray-300"></div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Dimension:</div>
                                                            <div className="w-full flex flex-wrap items-center justify-start gap-2">
                                                                {pdt.productDetails.len ? <div><span className='text-black font-medium'>L:</span> {pdt.productDetails.len} {pdt.productDetails.unit}</div> : ''}
                                                                {pdt.productDetails.wid ? <div><span className='text-black font-medium'>W:</span> {pdt.productDetails.wid} {pdt.productDetails.unit}</div> : ''}
                                                                {pdt.productDetails.dia ? <div><span className='text-black font-medium'>Dia:</span> {pdt.productDetails.dia} {pdt.productDetails.unit}</div> : ''}
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Color:</div>
                                                            <div className="flex items-center justify-center gap-2">
                                                                <div className={`w-7 h-5 rounded-sm`} style={{ backgroundColor: pdt.productDetails.color }}></div>
                                                                <div>{pdt.productDetails.color}</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Material:</div>
                                                            <div>{pdt.productDetails.material}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Insert:</div>
                                                            <div>{pdt.productDetails.insert}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Finish:</div>
                                                            <div>{pdt.productDetails.finish}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Quantity:</div>
                                                            <div>{pdt.productDetails.qty}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Vendor:</div>
                                                            <div>{pdt.productDetails.vendor}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Budget ($):</div>
                                                            <div>{pdt.productDetails.budget}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Buying price ($):</div>
                                                            <div>{pdt.productDetails.buyCost}</div>
                                                        </div>
                                                        <div className="w-full flex items-center justify-start gap-2">
                                                            <div className='font-medium'>Selling price ($):</div>
                                                            <div>{pdt.productDetails.sellCost}</div>
                                                        </div>
                                                    </div>

                                                    <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                        <div className="w-full flex items-center justify-between">
                                                            <div className="font-semibold">Comments</div>
                                                        </div>
                                                        <div className="w-full h-[2px] bg-gray-300"></div>
                                                        {
                                                            pdt.comments.length === 0 ?
                                                                <div className="w-full items-center justify-start">No comment yet!</div> :
                                                                pdt.comments.map(comment => (
                                                                    <div key={comment._id} className="w-full flex flex-col items-center bg-[#F8F9FD] gap-1">
                                                                        <div className="w-full flex items-center justify-start p-2 text-base font-medium gap-2">
                                                                            <FaUserCircle className='text-xl' />
                                                                            <div>{comment.name}</div>
                                                                            <div className='text-sm'>{comment.createdAt.split('T')[0]}</div>
                                                                        </div>
                                                                        <div className="w-full flex items-center justify-start p-2 bg-white">{comment.body}</div>
                                                                    </div>
                                                                ))
                                                        }
                                                        <form onSubmit={(e) => createNewComment(e, pdt._id)} className="w-full flex items-start gap-3 mt-4">
                                                            <textarea
                                                                value={comments[pdt._id]?.body || ''}
                                                                onChange={(e) => handleInputChange(e, pdt._id)}
                                                                className='w-full p-2 border border-solid border-gray-300 outline-none'
                                                                placeholder='Type here...'
                                                                name="body"
                                                            ></textarea>
                                                            <button
                                                                type="submit"
                                                                className='w-fit bg-[#7F55DE] p-1.5 px-3 text-white text-base font-medium rounded-lg'
                                                            >
                                                                Send
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            )
                                    }
                                </div>
                            ))
                        )
                    }
                </div>
                <Dialog
                    // size={`${type === "ref" || editItem.type === 'Reference' ? "xs" : "md"}`}
                    size='md'
                    open={isOpen}
                    handler={handleClose}
                    className="bg-transparent shadow-none w-full flex items-center justify-center"
                >
                    <div className="w-full flex flex-col items-center justify-start gap-3 bg-white p-4 rounded-lg text-black">
                        <div className='w-full flex items-center justify-start text-lg font-semibold'>{isEditMode ? 'Edit Project Item' : 'Add Project Items'}</div>
                        {!isEditMode ? <div className="w-full h-[1.5px] bg-black"></div> : null}
                        {!isEditMode && (
                            <div className="w-full flex items-center justify-start gap-16">
                                <div className='-mr-12 text-black font-medium'>Type:</div>
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        className=''
                                        type="checkbox"
                                        value="ref"
                                        checked={type === "ref"}
                                        onChange={handleChange}
                                    />
                                    <div className="text-gray-800">Reference</div>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        className=''
                                        type="checkbox"
                                        value="pdt"
                                        checked={type === "pdt"}
                                        onChange={handleChange}
                                    />
                                    <div className="text-gray-800">Product</div>
                                </div>
                            </div>
                        )}
                        <div className="w-full h-[1.5px] bg-black"></div>
                        {
                            (type === 'ref' && !isEditMode) || (isEditMode && editItem?.type === 'Reference') ? (
                                <RefForm
                                    id={id}
                                    fetchDetails={fetchProductDetails}
                                    handleClose={handleClose}
                                    editItem={editItem}
                                    isEditMode={isEditMode}
                                />
                            ) : (
                                <PdtForm
                                    id={id}
                                    fetchDetails={fetchProductDetails}
                                    handleClose={handleClose}
                                    editItem={editItem}
                                    isEditMode={isEditMode}
                                />
                            )
                        }
                    </div>
                </Dialog>

            </div>
        </div>
    );
};

export default ProjectItem;

