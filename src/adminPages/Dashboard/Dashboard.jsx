import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import BarChart from '../../components/BarChart';
import EmpSales from './EmpSales';
import PrjStatus from './PrjStatus';
import General from './General';
import Design from './Design';
import Finance from './Finance';
import Logistics from './Logistics';

const Dashboard = () => {

    const [menuId, setMenuId] = useState(1);

    useEffect(() => {
    }, []);

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Dashboard</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <div className="w-[70%] flex items-center justify-center">
                <div onClick={() => setMenuId(1)}
                    className={`w-full text-center cursor-pointer py-0.5 ${menuId === 1 ? 'font-semibold text-white bg-[#7F55DE] rounded-md' : 'bg-gray-100 text-gray-800'}`}>
                    General
                </div>
                <div onClick={() => setMenuId(2)}
                    className={`w-full text-center cursor-pointer py-0.5 ${menuId === 2 ? 'font-semibold text-white bg-[#7F55DE] rounded-md' : 'bg-gray-100 text-gray-800'}`}>
                    Design
                </div>
                <div onClick={() => setMenuId(3)}
                    className={`w-full text-center cursor-pointer py-0.5 ${menuId === 3 ? 'font-semibold text-white bg-[#7F55DE] rounded-md' : 'bg-gray-100 text-gray-800'}`}>
                    Finance
                </div>
                <div onClick={() => setMenuId(4)}
                    className={`w-full text-center cursor-pointer py-0.5 ${menuId === 6 ? 'font-semibold text-white bg-[#7F55DE] rounded-md' : 'bg-gray-100 text-gray-800'}`}>
                    Logistics
                </div>                                                                                
            </div>
            {
                (menuId === 1 ? <General /> :
                 menuId === 2 ? <Design /> :
                 menuId === 3 ? <Finance /> :
                 menuId === 4 ? <Logistics /> : ''
                )
            }
        </div>
    );
};

export default Dashboard;
