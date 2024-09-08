import React, { useContext, useEffect, useState } from 'react';
import { MdDashboard, MdManageSearch, MdOutlineDashboard, MdOutlineInventory2 } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { AppContext } from '../context/CommonContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../adminPages/Dashboard/Dashboard';
import { ClientRegistration, UserRegistration, VendorRegistration } from '../adminPages/UserRegistration/UserRegistration';
import { FaArrowLeft, FaArrowRight, FaRegBuilding, FaRegUser, FaUserCircle, FaUsers } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiUsers } from 'react-icons/fi';
import SalesOrder from '../adminPages/SalesOrder/SalesOrder';
import { RiCollageLine, RiShieldUserLine, RiUserSettingsLine } from 'react-icons/ri';
import { GrBusinessService } from 'react-icons/gr';
import Procurement from '../adminPages/Procurement/Procurement';
import Inventory from '../adminPages/Inventory/Inventory';
import ClientCollab from '../adminPages/ClientCollab/ClientCollab';
import ClientCollabEmp from '../adminPages/ClientCollab/CliendCollabEmp';
import CircularProgress from '@mui/material/CircularProgress';

const AdminPanel = () => {

    const navigate = useNavigate();

    const { menuID, handleMenuID, nameLoader, loggedInUserName, nameError, fetchName } = useContext(AppContext);

    const loggedInUser = localStorage.getItem('name');

    const loggedInUserID = localStorage.getItem('userId');

    const userType = localStorage.getItem('type');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    const [isExpanded, setExpanded] = useState(true);

    useEffect(() => {
        fetchName(loggedInUserID);
    }, []);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full flex items-start justify-center rounded-lg">
                {/* border-[0.75rem] border-solid border-[#DCD8FF] */}
                <div className={`${isExpanded ? userType === 'Employee' ? "w-[20%]" : "w-[15%]" : "w-[5%]"} flex flex-col items-center justify-between bg-[#F8F9FD] minHeight rounded-l-lg`}>
                    <div className="w-full flex flex-col items-center justify-start px-2">
                        <div className={`w-full flex items-center p-4 ${isExpanded ? 'flex-row justify-between' : 'flex-col justify-center'}`}>
                            <img className={`w-[6rem] ${isExpanded ? 'block' : 'hidden'}`} src="images/logoBlue.png" alt="" />
                            {
                                userType === 'Employee' && <IoIosArrowBack onClick={() => setExpanded(false)}
                                    className={`text-lg cursor-pointer text-gray-600 ${isExpanded ? "block" : "hidden"}`} />
                            }
                            <IoIosArrowForward onClick={() => setExpanded(true)}
                                className={`text-lg cursor-pointer text-gray-600 ${!isExpanded ? "block my-2" : "hidden"}`} />
                        </div>
                        <div className="w-full h-[2px] bg-gray-300"></div>
                        {
                            userType === 'Employee' && <div className="w-full flex flex-col items-center justify-start m-6">
                                <div
                                    onClick={() => handleMenuID(1)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 1 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <MdOutlineDashboard className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 1 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 1 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Dashboard</div>
                                </div>
                                <div
                                    onClick={() => handleMenuID(2)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 2 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <AiOutlineProduct className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 2 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 2 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Project Management</div>
                                </div>
                                <div
                                    onClick={() => handleMenuID(9)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 9 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <MdManageSearch className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 9 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 9 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Client Collaboration</div>
                                </div>
                                <div
                                    onClick={() => handleMenuID(3)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 3 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <RiUserSettingsLine className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 3 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 3 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Employee Registration</div>
                                </div>
                                <div
                                    onClick={() => handleMenuID(4)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 4 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <FaRegBuilding className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 4 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 4 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Vendor Registration</div>
                                </div>
                                <div
                                    onClick={() => handleMenuID(5)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 5 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <FiUsers className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 5 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 5 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Client Registration</div>
                                </div>
                                {/* <div
                                    onClick={() => handleMenuID(6)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 6 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <RiShieldUserLine className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 6 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 6 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Role Authorization</div>
                                </div> */}
                                <div
                                    onClick={() => handleMenuID(7)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 7 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <GrBusinessService className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 7 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 7 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Procurement</div>
                                </div>
                                <div
                                    onClick={() => handleMenuID(8)}
                                    className={`w-full flex items-center gap-4 p-3 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'} ${menuID === 8 ? 'bg-[#E9ECF5] rounded-[30px]' : 'bg-transparent'}`}>
                                    <MdOutlineInventory2 className={`text-2xl ${!isExpanded ? 'ml-0' : 'ml-2'} ${menuID === 8 ? 'text-black' : 'text-gray-800'}`} />
                                    <div className={`font-medium text-base text-nowrap ${menuID === 8 ? 'text-black' : 'text-gray-800'} ${isExpanded ? "block" : "hidden"}`}>Inventory</div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="w-full flex flex-col items-center justify-center">
                        <div className={`w-full flex items-center p-4 pb-0 text-lg gap-3 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                            <div className={`flex items-center justify-center rounded-[50%] p-2.5 bg-[#EAECF6] ${nameError ? 'border-2 border-solid border-red-600' : 'border-none'}`}>
                                <FaRegUser className={`text-lg`} />
                            </div>
                            {
                                nameLoader ?
                                    <div className={`w-full flex items-center justify-center ${isExpanded ? "block" : "hidden"}`}><CircularProgress /></div> :
                                    nameError ? <div className={`w-full flex items-center justify-start text-red-600 text-[15px] font-medium ${isExpanded ? "block" : "hidden"}`}>{nameError}</div> :
                                        <div className={`${isExpanded ? "block" : "hidden"}`}>{loggedInUserName}</div>
                            }
                        </div>
                        <div
                            onClick={handleLogout}
                            className={`w-full flex items-center justify-start gap-3 p-4 cursor-pointer ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                            <TbLogout2 className='text-2xl text-red-600' />
                            <div className={`font-medium text-base text-red-600 ${isExpanded ? "block" : "hidden"}`}>Logout</div>
                        </div>
                    </div>
                </div>
                {
                    userType === 'Employee' && <div className="w-full minHeight flex items-start justify-center bg-white p-4">
                        {
                            menuID === 1 ? <Dashboard />
                                : menuID === 2 ? <SalesOrder />
                                    : menuID === 3 ? <UserRegistration />
                                        : menuID === 4 ? <VendorRegistration />
                                            : menuID === 5 ? <ClientRegistration />
                                                : menuID === 6 ? ''
                                                    : menuID === 7 ? <Procurement />
                                                        : menuID === 8 ? <Inventory />
                                                            : menuID === 9 ? <ClientCollabEmp /> : ''
                        }
                    </div>
                }
                {
                    userType === 'Client' && <div className="w-full minHeight flex items-start justify-center bg-white p-4">
                        <ClientCollab />
                    </div>
                }
            </div>
        </div>
    );
};

export default AdminPanel;
