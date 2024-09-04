import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { backendServer } from '../../utils/info';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const EmpSales = () => {

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/emp-prj-data`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="min-w-[25rem] w-full flex flex-col items-center gap-2 bg-[#F8F9FD] p-4 rounded-md border border-solid border-gray-300">
            <div className="w-full text-left font-semibold">Sales by Employees:</div>
            <div className="w-full flex items-center justify-center">
                {
                    loading ?
                        <div className='w-full flex items-center justify-center my-14'>
                            <CircularProgress />
                        </div> :
                        error ?
                            <div className="w-full flex items-center justify-center text-red-600 font-medium my-16">
                                Error: {error}
                            </div> :
                            <div className="w-full flex items-center justify-center">
                                {
                                    data.length === 0 ? <div className="w-full text-left mb-36 text-sm">No employee found!</div>
                                        :
                                        <div className="w-full flex flex-col items-center gap-3">
                                            <table className='w-full border-collapse bg-white'>
                                                <thead>
                                                    <tr className='text-gray-700 text-lg text-nowrap'>
                                                        <th>Name of Employees</th>
                                                        <th>No. of total Projects</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentSales.map(sale => {
                                                            return (
                                                                <tr className='text-base text-center text-gray-700'>
                                                                    <td>{sale.name}</td>
                                                                    <td>{sale.salesCount}</td>
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

export default EmpSales;
