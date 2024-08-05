import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

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
                                    <button className='px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>RFQ</button>
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
                                                        <th>Project ID</th>
                                                        <th>Project Name</th>
                                                        <th>Qty</th>
                                                        <th>Vendor</th>
                                                        <th>Item Status</th>
                                                        <th>RFQ Sent Date</th>
                                                        <th>RFQ Receive Date</th>
                                                        <th>RFQ Number</th>
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
                                                                    <td>{pdt.productDetails.qty}</td>
                                                                    <td>{pdt.productDetails.vendor}</td>
                                                                    {
                                                                        pdt.status === "Pending" ?
                                                                            <td>Approval pending</td> : ''
                                                                    }
                                                                    <td></td>
                                                                    <td></td>
                                                                    <td></td>
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
        </div>
    );
};

export default Products;
