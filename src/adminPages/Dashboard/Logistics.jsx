import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import BarChart from '../../components/BarChart';
import EmpSales from './EmpSales';
import PrjStatus from './PrjStatus';

const Logistics = ({}) => {

    const token = localStorage.getItem('token');

    function formatCurrency(value) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });

        if (value >= 1000) {
            const abbreviatedValue = value / 1000;
            return formatter.format(abbreviatedValue) + 'k';
        }

        return formatter.format(value);
    };

    const [loading, setLoading] = useState(true);
    const [chartLoader, setChartLoader] = useState(false);
    const [error, setError] = useState(null);
    const [chartError, setChartError] = useState(null);
    const [salesNo, setSalesNo] = useState(null);
    const [totRev, setTotRev] = useState(null);

    const fetchSalesNo = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/sales-no`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSalesNo(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const fetchTotalRevenue = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/calculate-revenue`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotRev(response.data);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };

    const [statusArray, setStatusArray] = useState([]);

    const fetchPrjStatuses = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/project-statuses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStatusArray(response.data);
            setChartLoader(false);
        } catch (error) {
            setChartError(error.response.data.message);
            setChartLoader(false);
        }
    };

    const data = {
        labels: ['Yet to start', 'In progress', 'Request for Approval', 'Approved', 'Rejected'],
        datasets: [{
            data: statusArray,
            backgroundColor: [
                'rgba(97, 97, 97, 0.2)',
                'rgba(245, 124, 0, 0.2)',
                'rgba(25, 118, 210, 0.2)',
                'rgba(56, 142, 60, 0.2)',
                'rgba(211, 47, 47, 0.2)'
            ],
            borderColor: [
                'rgb(97, 97, 97)',
                'rgb(245, 124, 0)',
                'rgb(25, 118, 210)',
                'rgb(56, 142, 60)',
                'rgb(211, 47, 47)'
            ],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Project Status Data',
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: true,
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    },
                    stepSize: 1,
                },
            },
        },
    };


    useEffect(() => {
        fetchSalesNo();
        fetchTotalRevenue();
        fetchPrjStatuses();
    }, []);

    return (
        loading ?
            <div className='w-full flex items-center justify-center'>
                <CircularProgress />
            </div> :
            error ?
                <div className="w-full flex items-center justify-center text-red-600 font-medium">
                    Error: {error}
                </div> :           
                <div className="w-full flex flex-col items-center justify-start gap-4 dashHeight overflow-x-hidden overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                    <div className="w-full flex items-start justify-center gap-4">
                        <div className="w-full flex flex-col items-center gap-4">
                            <div className="w-full flex items-start justify-start gap-4">
                                <div className='min-w-[12rem] w-full flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                    <div className='font-medium flex justify-center w-full'>ACK Received</div>
                                    <div className='font-semibold text-3xl flex justify-center w-full'>{3}</div>
                                </div>
                                <div className='min-w-[12rem] w-full flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                    <div className='font-medium flex justify-center w-full'>Items Shipped</div>
                                    <div className='font-semibold text-3xl flex justify-center w-full'>{2}</div>
                                </div>
                            </div>
                            <div className="w-full flex items-start justify-start gap-4">
                                <div className='min-w-[12rem] w-full flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                    <div className='font-medium flex justify-center w-full'>Items Received</div>
                                    <div className='font-semibold text-3xl flex justify-center w-full'>{3}</div>
                                </div>
                                <div className='min-w-[12rem] w-full flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                    <div className='font-medium flex justify-center w-full'>Items Inspected</div>
                                    <div className='font-semibold text-3xl flex justify-center w-full'>{3}</div>
                                </div>
                            </div>
                            <div className="w-full flex items-start justify-start gap-4">
                            <div className='min-w-[12rem] w-full flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                <div className='font-medium flex justify-center w-full'>Items Rejected/Demage (Punch)</div>
                                <div className='font-semibold text-3xl flex justify-center w-full'>{3}</div>
                            </div>
                            <div className='min-w-[12rem] w-full flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                <div className='font-medium flex justify-center w-full'>Punch Item</div>
                                <div className='font-semibold text-3xl flex justify-center w-full'>{3}</div>
                            </div>
                        </div>                            
                        </div>
                    </div>
                </div>            
    );
};

export default Logistics;
