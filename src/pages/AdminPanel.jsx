import React, { useContext } from 'react';
import { MdDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { AppContext } from '../context/CommonContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../adminPages/Dashboard';
import UserRegistration from '../adminPages/UserRegistration/UserRegistration';
import { FaUsers } from "react-icons/fa";

const AdminPanel = () => {

    const navigate = useNavigate();

    const { menuID, handleMenuID } = useContext(AppContext);

    const loggedInUser = localStorage.getItem('name');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className="w-full flex items-start justify-center">
            <div className="w-[25%] min-h-screen flex flex-col items-center justify-between bg-white">

                <div className="w-full flex flex-col items-center justify-start">
                    <div className="w-full flex items-center justify-center m-6">
                        <img className='w-32' src="images/logoBlue.png" alt="" />
                    </div>
                    <div className="w-full flex flex-col items-center justify-start m-6">
                        <div
                            onClick={() => handleMenuID(1)}
                            className={`w-full flex items-center justify-start gap-4 p-6 py-4 cursor-pointer ${menuID === 1 ? 'bg-main' : 'bg-white'}`}>
                            <MdDashboard className={`text-2xl ${menuID === 1 ? 'text-white' : 'text-balance'}`} />
                            <div className={`font-medium text-lg ${menuID === 1 ? 'text-white' : 'text-balance'}`}>Dashboard</div>
                        </div>
                        <div
                            onClick={() => handleMenuID(2)}
                            className={`w-full flex items-center justify-start gap-4 p-6 py-4 cursor-pointer ${menuID === 2 ? 'bg-main' : 'bg-white'}`}>
                            <AiFillProduct className={`text-2xl ${menuID === 2 ? 'text-white' : 'text-balance'}`} />
                            <div className={`font-medium text-lg ${menuID === 2 ? 'text-white' : 'text-balance'}`}>Sales Order</div>
                        </div>
                        <div
                            onClick={() => handleMenuID(3)}
                            className={`w-full flex items-center justify-start gap-4 p-6 py-4 cursor-pointer ${menuID === 3 ? 'bg-main' : 'bg-white'}`}>
                            <FaUsers className={`text-2xl ${menuID === 3 ? 'text-white' : 'text-balance'}`} />
                            <div className={`font-medium text-lg ${menuID === 3 ? 'text-white' : 'text-balance'}`}>User Registration</div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center">
                    <div className="w-full h-2 bg-main"></div>
                    <div className="w-full flex items-center justify-start px-6 pt-4 text-lg">
                        Welcome {loggedInUser},
                    </div>
                    <div
                        onClick={handleLogout}
                        className="w-full flex items-center justify-start gap-4 p-6 py-4 cursor-pointer">
                        <TbLogout2 className='text-2xl text-red-600' />
                        <div className="font-medium text-lg text-red-600">Logout</div>
                    </div>
                </div>

            </div>
            <div className="w-full min-h-screen flex items-start justify-center bg-main p-6">
                {
                    menuID === 1 ? <Dashboard />
                        : menuID === 3 ? <UserRegistration /> : ""
                }
            </div>
        </div>
    );
};

export default AdminPanel;
