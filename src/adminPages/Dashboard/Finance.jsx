import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { backendServer } from '../../utils/info';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Finance = () => {

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/dashboard/financetab`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-center">
                {
                    loading ?
                        <div className='w-full flex items-center justify-center my-2'>
                            <CircularProgress />
                        </div> :
                        error ?
                            <div className="w-full flex items-center justify-center text-red-600 font-medium my-4">
                                Error: {error}
                            </div> :
                            <div className="w-full flex items-center justify-center">
                                {
                                    data.length === 0 ? <div className="w-full text-left mb-10 text-sm">No data found!</div>
                                        :
                                        <div className="w-full flex flex-col items-center gap-3">
                                            <table className='w-full border-collapse bg-white'>
                                                <thead>
                                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                                        <th>Product Id</th>
                                                        <th>Product Name</th>
                                                        <th>Profit By Item</th>
                                                        <th>Cost Against Job</th>
                                                        <th>Job Profitability</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentSales.map(sale => {
                                                            return (
                                                                <tr key={sale._id} className='text-base text-center text-gray-700'>
                                                                    <td>{sale.productDetails.code ? sale.productDetails.code : null}</td>
                                                                    <td>{sale.title ? sale.title : null}</td>
                                                                    <td>{sale.profitByItem}</td>
                                                                    <td>{sale.costAgainstJob}</td>
                                                                    <td>{sale.profitFees}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                            <div className='w-full flex items-center justify-end gap-2'>

                                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center cursor-pointer">
                                                    <MdOutlineKeyboardArrowLeft className='text-lg' />
                                                </button>

                                                <div className='text-gray-700 text-xs'>
                                                    Page {currentPage} of {totalPages}
                                                </div>

                                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center cursor-pointer">
                                                    <MdOutlineKeyboardArrowRight className='text-lg' />
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

export default Finance;
