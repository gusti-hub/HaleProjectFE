import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allPdts, setAllPdts] = useState([]);

    const fetchAllPdts = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/allpdts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllPdts(response.data.filter(pdt => pdt.type === "Product"));
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

    const filteredSales = allPdts.filter(pdt =>
        pdt.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchAllPdts();
    }, []);

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Inventory</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            {
                loading ?
                    <div className='w-full flex items-center justify-center'>
                        <CircularProgress />
                    </div> :
                    error ?
                        <div className="w-full flex items-center justify-center text-red-600 font-medium">
                            Error: {error}
                        </div> :
                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="w-full flex items-center justify-start gap-6">
                                <button onClick={() => navigate('/inventory_in')}
                                    className='w-20 px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>IN</button>
                                <button onClick={() => navigate('/inventory_out')}
                                    className='w-20 px-5 py-1.5 rounded-md bg-[#7F55DE] text-white text-lg'>OUT</button>
                            </div>
                            {
                                allPdts.length != 0 &&
                                <div className="w-full flex items-center justify-end">
                                    <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                                        <FiSearch className='text-xl text-gray-600 ml-2' />
                                        <input value={searchQuery} onChange={handleSearchChange}
                                            className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                                            type="search" placeholder='Search by name'
                                        />
                                    </div>
                                </div>
                            }
                            {
                                filteredSales.length === 0 ?
                                    <div className="w-full flex items-center justify-start text-lg font-medium">
                                        No product found!
                                    </div> :
                                    <div className="w-full flex flex-col items-center">
                                        <table className='w-full border-collapse'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>#</th>
                                                    <th>Product ID</th>
                                                    <th>Product Name</th>
                                                    <th>Project ID</th>
                                                    <th>Quantity</th>
                                                    <th>Buy Price</th>
                                                    <th>Sell Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentSales.map((pdt, index) => {
                                                        return (
                                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                <td>{indexOfFirstItem + index + 1}</td>
                                                                <td>{pdt.productDetails.code ? pdt.productDetails.code : null}</td>
                                                                <td>{pdt.title ? pdt.title : null}</td>
                                                                <td>{pdt.projectId ? pdt.projectId : null}</td>
                                                                <td>{pdt.totalRecQty}</td>
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
    );
};

export default Inventory;
