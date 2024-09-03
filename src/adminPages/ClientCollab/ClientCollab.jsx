import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { FiSearch } from 'react-icons/fi';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const ClientCollab = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('name');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allSales, setAllSales] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const fetchSalesData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendServer}/api/sales`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllSales(response.data.salesData);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const sales = allSales.filter(sale => sale.client.split('-')[1] === loggedInUser);

    const filteredSales = sales.filter(sale =>
        sale.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSales = filteredSales.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchSalesData();
    }, []);

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Client Collaboration</div>
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

                        <div className="w-full flex flex-col items-center">
                            <div className="w-full flex items-center justify-end">
                                {
                                    sales.length != 0 &&
                                    <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                                        <FiSearch className='text-xl text-gray-600 ml-2' />
                                        <input value={searchQuery} onChange={handleSearchChange}
                                            className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                                            type="search" placeholder='Search by name'
                                        />
                                    </div>
                                }
                            </div>

                            {
                                filteredSales.length === 0 ?
                                    <div className="w-full flex items-center justify-start text-lg font-medium mt-4">
                                        No records found!
                                    </div> :
                                    <div className="w-full flex flex-col items-center">
                                        <table className='w-full border-collapse mt-4'>
                                            <thead>
                                                <tr className='text-gray-700 text-lg text-nowrap'>
                                                    <th>Project Code</th>
                                                    <th>Project Name</th>
                                                    <th>Description</th>
                                                    <th>Project Owner</th>
                                                    <th>Client Name</th>
                                                    <th>Progress</th>
                                                    <th>Date Created</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    currentSales.map((pdt, index) => {
                                                        return (
                                                            <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                                                <td>
                                                                    {
                                                                        pdt.progress === "Not Started" ?
                                                                            <div className=''>{pdt.code}</div> :
                                                                            <div className='cursor-pointer text-blue-900' onClick={() => navigate(`/project-collab/${pdt._id}`)}>
                                                                                {pdt.code}
                                                                            </div>
                                                                    }
                                                                </td>
                                                                <td>{pdt.name}</td>
                                                                <td>{pdt.desc}</td>
                                                                <td>{pdt.owner}</td>
                                                                <td>{pdt.client.split('-')[1]}</td>
                                                                <td>
                                                                    {
                                                                        pdt.progress === "Not Started" ?
                                                                            <div className='p-1 bg-blue-gray-50 text-gray-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                                            pdt.progress === "In progress" ?
                                                                                <div className='p-1 bg-orange-50 text-orange-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                                                pdt.progress === "Request for Approval" ?
                                                                                    <div className='p-1 bg-blue-50 text-blue-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                                                    pdt.progress === "Approved" ?
                                                                                        <div className='p-1 bg-green-50 text-green-700 rounded-3xl font-medium'>{pdt.progress}</div> :
                                                                                        pdt.progress === "Rejected" ?
                                                                                            <div className='p-1 bg-red-50 text-red-700 rounded-3xl font-medium'>{pdt.progress}</div> : ""
                                                                    }
                                                                </td>
                                                                <td>{pdt.createdAt.split('T')[0]}</td>
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

export default ClientCollab;
