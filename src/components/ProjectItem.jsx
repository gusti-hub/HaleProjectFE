import { Dialog } from '@material-tailwind/react';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { backendServer } from '../utils/info';
import toast from 'react-hot-toast';
import { AppContext } from '../context/CommonContext';
import { MdDeleteOutline } from 'react-icons/md';
import { FaEdit, FaUserCircle } from 'react-icons/fa';

const RefForm = ({ id, fetchDetails, handleClose, editItem, isEditMode }) => {
    const initialFormData = isEditMode ? editItem : { projectId: id, type: 'Reference', title: '', desc: '' };
    const [formData, setFormData] = useState(initialFormData);

    const resetForm = () => {
        setFormData({ projectId: id, type: 'Reference', title: '', desc: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                const response = await axios.put(`${backendServer}/api/product/${formData._id}`, formData);
                toast.success(response.data.message);
            } else {
                const response = await axios.post(`${backendServer}/api/newProduct`, formData);
                toast.success(response.data.message);
            }
            handleClose();
            fetchDetails();
            resetForm();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-start gap-2 text-black">
                <label htmlFor="title">Title:</label>
                <input value={formData.title} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='title' placeholder='Type here...' />
            </div>
            <div className="w-full flex items-start justify-start gap-2 text-black">
                <label htmlFor="desc">Description:</label>
                <textarea value={formData.desc} onChange={handleInputChange}
                    className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                    name="desc" rows="2" placeholder='Type here...'></textarea>
            </div>
            <button type="submit" className='w-full p-1.5 rounded-lg bg-[#7F55DE] text-white font-medium'>
                {isEditMode ? 'Update Item' : 'Add Item'}
            </button>
        </form>
    );
};

const PdtForm = ({ id }) => {
    return (
        <div></div>
    );
};

const ProjectItem = ({ name, id, isOpen, handleOpen, handleClose }) => {
    const loggedInUser = localStorage.getItem('name');
    const { open, setOpen } = useContext(AppContext);

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
            const response = await axios.get(`${backendServer}/api/allProducts/${id}`);
            setLoading(false);
            setProducts(response.data.allProducts);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    const createNewComment = async (e, _id) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${backendServer}/api/product/${id}/${loggedInUser}/newComment/${_id}`, comments[_id]);
            toast.success(response.data.message);
            resetCommentForm(_id);
            fetchProductDetails();
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
    }

    useEffect(() => {
        fetchProductDetails();
    }, []);

    return (
        <div className="w-full flex items-center justify-center bg-[#F8F9FD] p-4">
            <div className="w-full flex flex-col items-center justify-start gap-3 p-4 bg-white">
                <div className="w-full flex items-center justify-start text-gray-900 text-[1.325rem] font-semibold">
                    {name}
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
                                        pdt.type === 'Reference' ? (
                                            <div className="w-full flex items-start justify-center gap-3 text-black">
                                                <div className="w-full flex flex-col items-center border-2 border-solid border-gray-300 rounded-lg p-3 gap-2">
                                                    <div className="w-full flex items-center justify-start gap-2">
                                                        <span className='font-semibold'>{pdt.type}:</span>
                                                        <span>{pdt.title}</span>
                                                    </div>
                                                    <div className="w-full h-[2px] bg-gray-300"></div>
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
                                        ) : null
                                    }
                                </div>
                            ))
                        )
                    }
                </div>
                <Dialog
                    size="xs"
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
                            type === 'ref' || isEditMode ? (
                                <RefForm
                                    id={id}
                                    fetchDetails={fetchProductDetails}
                                    handleClose={handleClose}
                                    editItem={editItem}
                                    isEditMode={isEditMode}
                                />
                            ) : (
                                <PdtForm id={id} />
                            )
                        }
                    </div>
                </Dialog>
            </div>
        </div>
    );
};

export default ProjectItem;
