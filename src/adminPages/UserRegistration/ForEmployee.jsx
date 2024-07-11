import React, { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { IoPersonAdd } from 'react-icons/io5';
import { Dialog } from '@material-tailwind/react';

const ForEmployee = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', title: '', role: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    // if (loading) return (
    //     <div className='w-full flex items-center justify-center'>
    //         <CircularProgress />
    //     </div>
    // )

    if (error) return (
        <div className="w-full flex items-center justify-center text-red-600 font-medium">
            Error: {error}
        </div>
    );

    return (
        <div className="w-full flex lg:hidden flex-col items-center justify-start bg-white p-4 rounded-lg gap-8">
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none w-full flex items-center justify-center"
            >
                <form
                    className='w-full flex flex-col items-center justify-start gap-4 bg-white p-4 text-black rounded-lg'>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="name">Name:</label>
                        <input
                            value={formData.name}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="name" id="" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="email">Email:</label>
                        <input
                            value={formData.email}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="email" placeholder='Type here...' name="email" id="" />
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="password">Password: (Minimum of 8 characters)</label>
                        {
                            isChecked ?
                                <input
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='w-full border-b-2 border-solid border-black p-2 outline-none'
                                    type="text" placeholder='Type here...' name="password" id="" />
                                :
                                <input
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className='w-full border-b-2 border-solid border-black p-2 outline-none'
                                    type="password" placeholder='Type here...' name="password" id="" />
                        }
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            name="" id="" />
                        <div className='text-sm'>Show password</div>
                    </div>
                    <div className="w-full flex flex-col items-start gap-1 text-base">
                        <label htmlFor="title">Title:</label>
                        <input
                            value={formData.title}
                            onChange={handleInputChange}
                            className='w-full border-b-2 border-solid border-black p-2 outline-none'
                            type="text" placeholder='Type here...' name="title" id="" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-4 text-base">
                        <label htmlFor="role">Role:</label>
                        <select className='p-1' name="role">
                            <option value="">Director</option>
                        </select>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button className='w-full bg-main p-2 text-white text-base font-medium rounded-lg'>Register</button>
                    </div>
                </form>
            </Dialog>
            <div className="w-full flex items-center justify-end">
                <button onClick={handleOpen}
                    className='flex items-center justify-center gap-2 px-4 py-2 rounded-[25px] bg-main text-white text-lg'>
                    <IoPersonAdd />
                    <div>ADD</div>
                </button>
            </div>
        </div>
    );
};

export default ForEmployee;
