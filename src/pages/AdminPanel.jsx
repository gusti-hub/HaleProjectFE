import React, { useContext, useState } from 'react';
import { MdDashboard, MdOutlineDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { AppContext } from '../context/CommonContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../adminPages/Dashboard';
import UserRegistration from '../adminPages/UserRegistration/UserRegistration';
import { FaArrowLeft, FaArrowRight, FaRegUser, FaUserCircle, FaUsers } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiUsers } from 'react-icons/fi';
import SalesOrder from '../adminPages/SalesOrder/SalesOrder';

const AdminPanel = () => {

    const navigate = useNavigate();

    const { menuID, handleMenuID } = useContext(AppContext);

    const loggedInUser = localStorage.getItem('name');

    const loggedInUserID = localStorage.getItem('userId');

    const userType = localStorage.getItem('type');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    const [isExpanded, setExpanded] = useState(true);

    console.log();

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full flex items-start justify-center border-[0.75rem] border-solid border-[#DCD8FF] rounded-lg">
                <div className={`${isExpanded ? "w-[20%]" : "w-[5%]"} flex flex-col items-center justify-between bg-[#F8F9FD] minHeight rounded-l-lg`}>
                    <div className="w-full flex flex-col items-center justify-start px-2">
                        <div className={`w-full flex items-center p-4 ${isExpanded ? 'flex-row justify-between' : 'flex-col justify-center'}`}>
                            <img className={`w-[6rem] ${isExpanded ? 'block' : 'hidden'}`} src="images/logoBlue.png" alt="" />
                            <IoIosArrowBack onClick={() => setExpanded(false)}
                                className={`text-lg cursor-pointer text-gray-600 ${isExpanded ? "block" : "hidden"}`} />
                            <IoIosArrowForward onClick={() => setExpanded(true)}
                                className={`text-lg cursor-pointer text-gray-600 ${!isExpanded ? "block my-2" : "hidden"}`} />
                        </div>
                        <div className="w-full h-[2px] bg-gray-300"></div>
                        <div className="w-full flex flex-col items-center justify-start m-6">
                            <div
                                onClick={() => handleMenuID(1)}
                                className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 1 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                <MdOutlineDashboard className={`text-2xl ${menuID === 1 ? 'text-black' : 'text-gray-800'}`} />
                                <div className={`font-medium text-base text-nowrap ${menuID === 1 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Dashboard</div>
                            </div>
                            <div
                                onClick={() => handleMenuID(2)}
                                className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 2 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                <AiOutlineProduct className={`text-2xl ${menuID === 2 ? 'text-black' : 'text-gray-800'}`} />
                                <div className={`font-medium text-base text-nowrap ${menuID === 2 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Project Management</div>
                            </div>
                            <div
                                onClick={() => handleMenuID(3)}
                                className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 3 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                <FiUsers className={`text-2xl ${menuID === 3 ? 'text-black' : 'text-gray-800'}`} />
                                <div className={`font-medium text-base text-nowrap ${menuID === 3 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>User Registration</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center">
                        <div className={`w-full flex items-center p-4 pb-0 text-lg gap-3 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                            <div className="flex items-center justify-center rounded-[50%] p-2.5 bg-[#EAECF6]">
                                <FaRegUser className='text-lg' />
                            </div>
                            <div className={`${isExpanded ? "block" : "hidden"}`}>{loggedInUser}</div>
                        </div>
                        <div
                            onClick={handleLogout}
                            className={`w-full flex items-center justify-start gap-3 p-4 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                            <TbLogout2 className='text-2xl text-red-600' />
                            <div className={`font-medium text-base text-red-600 ${isExpanded ? "block" : "hidden"}`}>Logout</div>
                        </div>
                    </div>
                </div>
                <div className="w-full minHeight flex items-start justify-center bg-white p-4">
                    {
                        menuID === 1 ? <Dashboard />
                        : menuID === 2 ? <SalesOrder /> 
                            : menuID === 3 ? <UserRegistration /> : ""
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
