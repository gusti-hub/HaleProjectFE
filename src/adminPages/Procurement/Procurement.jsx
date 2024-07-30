import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Procurement = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allSales, setAllSales] = useState([]);
    const [currProject, setCurrProject] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const fetchSalesData = async () => {
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

    useEffect(() => {
        fetchSalesData();
    }, []);

    const filteredSales = allSales.filter(sale =>
        sale.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className='w-full flex items-center justify-center'>
            <CircularProgress />
        </div>
    );

    if (error) return (
        <div className="w-full flex items-center justify-center text-red-600 font-medium">
            Error: {error}
        </div>
    );
    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Procurement</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <div className="w-full flex items-center justify-end">
                <div className="flex items-center justify-center border-2 border-solid border-gray-300 rounded-lg">
                    <FiSearch className='text-xl text-gray-600 ml-2' />
                    <input value={searchQuery} onChange={handleSearchChange}
                        className='w-[18rem] outline-none p-2 mr-1 text-gray-600'
                        type="search" placeholder='Search by name'
                    />
                </div>
            </div>
            {
                filteredSales.length === 0 ?
                    <div className="w-full flex items-center justify-start text-lg font-medium mt-4">
                        No records found!
                    </div> :
                    <table className='w-full border-collapse mt-4'>
                        <thead>
                            <tr className='text-gray-700 text-lg text-nowrap'>
                                <th>Project Id</th>
                                <th>Project Name</th>
                                <th>Project Owner</th>
                                <th>Client Name</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredSales.map(pdt => {
                                    return (
                                        <tr key={pdt._id} className='text-base text-center text-gray-700'>
                                            <td>
                                                <div className='cursor-pointer text-blue-900' onClick={() => navigate(`/products/${pdt._id}`)}>
                                                    {pdt._id}
                                                </div>
                                            </td>
                                            <td>{pdt.name}</td>
                                            <td>{pdt.owner}</td>
                                            <td>{pdt.client}</td>
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
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
            }
        </div>
    );
};

export default Procurement;
