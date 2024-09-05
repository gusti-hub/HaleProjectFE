import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { backendServer } from '../../utils/info';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const PrjStatus = () => {

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
            const response = await axios.get(`${backendServer}/api/prj-sales-data`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
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
            <div className="w-full text-left font-semibold">Project Status:</div>
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
                                                        <th>Project Name</th>
                                                        <th>Client Name</th>
                                                        <th>No. of total products</th>
                                                        <th>No. of total products with RFQ</th>
                                                        <th>No. of total products with PO</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentSales.map(sale => {
                                                            return (
                                                                <tr key={sale.saleId} className='text-base text-center text-gray-700'>
                                                                    <td>{sale.saleName}</td>
                                                                    <td>{sale.clientName.split('-')[1]}</td>
                                                                    <td>{sale.numberOfProducts}</td>
                                                                    <td>{sale.totalUniqueRFQProducts}</td>
                                                                    <td>{sale.totalUniquePOProducts}</td>
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

export default PrjStatus;
