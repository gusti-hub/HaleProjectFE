import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({ name: '', email: '', password: '' });
    const [successMessage, setSuccessMessage] = useState('');

    const validateName = (name) => {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(name);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = { name: '', email: '', password: '' };

        if (!validateName(formData.name)) {
            newErrors.name = 'Name should only contain alphabetic characters.';
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters long.';
        }

        setErrors(newErrors);

        if (!newErrors.name && !newErrors.email && !newErrors.password) {
            try {
                const response = await axios.post('http://localhost:5000/api/signup', formData);
                setSuccessMessage(response.data.message);
            } catch (error) {
                setErrors({ ...newErrors, form: error.response.data.message });
                toast.error(error.response.data.message);
            }
        }
    };


    return (
        <div className="w-full min-h-screen flex items-center justify-center textured-bg">
            <div
                style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px" }}
                className="w-full md:w-[60%] lg:w-[30%] flex flex-col items-center justify-center bg-white p-6 gap-20 m-6">
                <div className="w-full flex items-center justify-start">
                    <img className='w-32' src="images/logoBlue.png" alt="" />
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-6">
                    <div className="w-full text-center text-2xl font-medium text-main">
                        Welcome to HALE!
                    </div>
                    <form onSubmit={handleSubmit}
                        className='w-full flex flex-col items-center justify-center gap-6'
                        action="">
                        <div className="w-full flex flex-col items-start gap-1 text-base">
                            <label htmlFor="name">Name:</label>
                            <input
                                value={formData.name}
                                onChange={handleInputChange}
                                className='w-full border-b-2 border-solid border-black p-2 outline-none text-sm'
                                type="text" placeholder='Type here...' name="name" id="" />
                            {errors.name && <div className='text-red-600 text-xs'>{errors.name}</div>}
                        </div>
                        <div className="w-full flex flex-col items-start gap-1 text-base">
                            <label htmlFor="email">Email:</label>
                            <input
                                value={formData.email}
                                onChange={handleInputChange}
                                className='w-full border-b-2 border-solid border-black p-2 outline-none text-sm'
                                type="email" placeholder='Type here...' name="email" id="" />
                            {errors.email && <div className='text-red-600 text-xs'>{errors.email}</div>}
                        </div>
                        <div className="w-full flex flex-col items-start gap-1 text-base">
                            <label htmlFor="password">Password:</label>
                            {
                                isChecked ?
                                    <input
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className='w-full border-b-2 border-solid border-black p-2 outline-none text-sm'
                                        type="text" placeholder='Type here...' name="password" id="" />
                                    :
                                    <input
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className='w-full border-b-2 border-solid border-black p-2 outline-none text-sm'
                                        type="password" placeholder='Type here...' name="password" id="" />
                            }
                            {errors.password && <div className='text-red-600 text-xs'>{errors.password}</div>}
                        </div>
                        <div className="w-full flex items-center justify-start gap-2">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                                name="" id="" />
                            <div className='text-sm'>Show password</div>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <button className='w-full bg-main p-2 text-white text-base font-medium rounded-lg'>Continue</button>
                        </div>
                        <div className="w-full flex items-center justify-center text-sm">
                            <div>Already have an account? <span
                                onClick={() => navigate("/")}
                                className='text-main font-medium cursor-pointer'>Log in</span></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
