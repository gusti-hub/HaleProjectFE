import React, { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Expenses from './Expenses';
import TimeCalender from "./TimeCalender";

const TE = () => {

    const navigate = useNavigate();

    const [menuId, setMenuId] = useState(1);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full min-h-screen flex flex-col items-center justify-start rounded-lg">
                <div className="w-full flex items-center justify-start p-6 bg-[#F8F9FD] gap-6">
                    <div onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-[50%] bg-[#7F55DE] p-2 cursor-pointer">
                        <IoArrowBack className='text-white text-2xl' />
                    </div>
                    <img className={`w-[6rem]`} src="../images/logoBlue.png" alt="Logo" />
                </div>

                <div className="w-full flex items-center justify-start gap-2 p-4">
                    <div onClick={() => setMenuId(1)}
                        className={`text-center py-1 px-5 border-b-2 border-b-[#7F55DE] ${menuId === 1 ? 'border-solid font-medium' : 'border-none font-normal'} cursor-pointer`}>
                        TIME
                    </div>
                    <div onClick={() => setMenuId(2)}
                        className={`text-center py-1 px-5 border-b-2 border-b-[#7F55DE] ${menuId === 2 ? 'border-solid font-medium' : 'border-none font-normal'} cursor-pointer`}>
                        EXPENSES
                    </div>
                </div>

                <div className="w-full flex text-center justify-center px-4"><div className="w-full h-[2px] bg-gray-400"></div></div>

                {
                    menuId === 1 ? <TimeCalender /> :
                        menuId === 2 ? <Expenses /> : ''
                }

            </div>
        </div>
    );
};

export default TE;
