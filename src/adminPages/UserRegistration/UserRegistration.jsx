import React, { useContext } from 'react';
import { AppContext } from '../../context/CommonContext';
import ForEmployee from './ForEmployee';
import ForClient from './ForClient';

const UserRegistration = () => {

    const {userReg, handleUserReg} = useContext(AppContext);

    const handleChange = (e) => {
        handleUserReg(e.target.value);
    }
    return (
        <div className="w-full flex flex-col items-start justify-center gap-4">
            <div className="w-full text-left text-white text-3xl font-medium">User Registration</div>
            <div className="w-full h-[2px] bg-white"></div>
            <div className="w-full flex items-center justify-start gap-16">
                <div className="flex items-center justify-center gap-2">
                    <input 
                    className=''
                    type="checkbox"
                    value="emp"
                    checked={userReg === "emp"}
                    onChange={handleChange} />
                    <div className="text-white text-lg">Employee</div>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <input 
                    className=''
                    type="checkbox"
                    value="clt"
                    checked={userReg === "clt"}
                    onChange={handleChange} />
                    <div className="text-white text-lg">Client</div>
                </div>
            </div>
            {
                userReg === "emp" ? <ForEmployee /> : <ForClient />
            }
        </div>
    );
};

export default UserRegistration;
