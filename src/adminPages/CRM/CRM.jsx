import React, { useState } from 'react';
import CustomerData from './CustomerData';

const CRM = () => {

    const [menuId, setMenuId] = useState(1);

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">CRM</div>
            <div className="w-full h-[2px] bg-gray-300"></div>

            <div className="w-[70%] flex items-center justify-center">
                <div onClick={() => setMenuId(1)}
                    className={`w-full text-center cursor-pointer py-0.5 ${menuId === 1 ? 'font-semibold text-white bg-[#7F55DE] rounded-md' : 'bg-gray-100 text-gray-800'}`}>
                    Customer Data
                </div>
                <div onClick={() => setMenuId(2)}
                    className={`w-full text-center cursor-pointer py-0.5 ${menuId === 2 ? 'font-semibold text-white bg-[#7F55DE] rounded-md' : 'bg-gray-100 text-gray-800'}`}>
                    Evaluation
                </div>
            </div>

            {
                menuId === 1 ? <CustomerData /> : ''
            }

        </div>
    );
};

export default CRM;
