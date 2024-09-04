import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import BarChart from '../../components/BarChart';
import EmpSales from './EmpSales';
import PrjStatus from './PrjStatus';

const Dashboard = () => {

    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const userId = localStorage.getItem('userId');

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
            },
        },
    };

    useEffect(() => {
        fetchSalesNo();
        fetchTotalRevenue();
        fetchPrjStatuses();
    }, []);

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Dashboard</div>
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
                        <div className="w-full flex flex-col items-center justify-start gap-4 max-h-[36rem] overflow-x-hidden overflow-y-scroll scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
                            <div className="w-full flex items-start justify-center gap-4">
                                <div className="w-full flex flex-col items-center gap-4">
                                    <div className="w-full flex items-start justify-start gap-4">
                                        <div className='min-w-[12rem] flex flex-col items-start gap-2 p-3 rounded-md bg-green-100'>
                                            <div className='font-medium'>Total Revenue</div>
                                            <div className='font-semibold text-3xl'>{formatCurrency(totRev)}</div>
                                        </div>
                                        <div className='min-w-[12rem] flex flex-col items-start gap-2 p-3 rounded-md bg-[#F8F9FD] border border-solid border-gray-300'>
                                            <div className='font-medium'>Total Projects</div>
                                            <div className='font-semibold text-3xl'>{salesNo}</div>
                                        </div>
                                    </div>
                                    {/* Tables */}
                                    <EmpSales />
                                </div>
                                {/* Graph section */}
                                <div className="w-full max-w-[34rem] min-h-[18rem] flex items-center justify-center bg-[#F8F9FD] rounded-md p-4 border border-solid border-gray-300 mr-2">
                                    {
                                        chartLoader ?
                                            <div className='w-full flex items-center justify-center'>
                                                <CircularProgress />
                                            </div> :
                                            chartError ?
                                                <div className="w-full flex items-center justify-center text-red-600 font-medium">
                                                    Error: {chartError}
                                                </div> :
                                                <div className="w-full flex flex-col items-center">
                                                    <div className="w-full flex flex-col items-center gap-1.5 text-sm">
                                                        <div className="w-full text-left font-semibold">Legends:</div>
                                                        <div className="w-full flex flex-col items-center text-xs font-medium gap-2 pl-2">
                                                            <div className="w-full flex items-center justify-start gap-1">
                                                                <div className="w-8 h-4 bg-gray-700 opacity-60"></div><div>Yet to start</div>
                                                            </div>
                                                            <div className="w-full flex items-center justify-start gap-1">
                                                                <div className="w-8 h-4 bg-orange-700 opacity-60"></div><div>In progress</div>
                                                            </div>
                                                            <div className="w-full flex items-center justify-start gap-1">
                                                                <div className="w-8 h-4 bg-blue-700 opacity-60"></div><div>Request for Approval</div>
                                                            </div>
                                                            <div className="w-full flex items-center justify-start gap-1">
                                                                <div className="w-8 h-4 bg-green-700 opacity-60"></div><div>Approved</div>
                                                            </div>
                                                            <div className="w-full flex items-center justify-start gap-1">
                                                                <div className="w-8 h-4 bg-red-700 opacity-60"></div><div>Rejected</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <BarChart data={data} options={options} />
                                                </div>
                                    }
                                </div>
                            </div>

                            {/* Long table */}
                            <div className="w-full flex items-center justify-center bg-[#F8F9FD] rounded-md p-4 border border-solid border-gray-300">
                                <PrjStatus />
                            </div>
                        </div>
            }
        </div>
    );
};

export default Dashboard;
