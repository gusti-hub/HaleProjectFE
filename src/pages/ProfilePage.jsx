import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { backendServer } from '../utils/info';
import toast from 'react-hot-toast';

const ProfilePage = () => {

    const address = useParams();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState({});
    const [userType, setUserType] = useState(null);

    const [formData, setFormData] = useState({
        oldPass: '',
        newPass: '',
        title: data.title
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileURL, setFileURL] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
        setFileURL(URL.createObjectURL(event.target.files[0]));
    };

    const handleUpload = async () => {
        if (!selectedFile) return imageUrl;

        const uploadData = new FormData();
        uploadData.append('image', selectedFile);

        try {
            const response = await axios.post(`${backendServer}/api/upload`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
            return null;
        }
    };

    const [isChecked, setIsChecked] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/profile-page/${address.id}`);
            setData(response.data.user);
            setUserType(response.data.userType);
            setFormData({
                oldPass: '',
                newPass: '',
                title: response.data.user.title
            });
            setSelectedFile(null);
            setImageUrl(response.data.user.imageUrl ? response.data.user.imageUrl : '');
            setFileName('');
            setFileURL('');
            setLoader(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoader(false);
        }
    };

    const [saveLoader, setSaveLoader] = useState(false);
    const [buttonLoader, setButtonLoader] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if ((formData.oldPass.length === 0 && formData.newPass.length === 0) || (formData.oldPass.length > 0 && formData.newPass.length > 0)) {

            setSaveLoader(true);

            try {
                let uploadedImageUrl = imageUrl;

                if (selectedFile) {
                    const uploadedUrl = await handleUpload();
                    if (uploadedUrl) {
                        uploadedImageUrl = uploadedUrl;
                    } else {
                        setSaveLoader(false);
                        return;
                    }
                }

                const finalFormData = { ...formData, imageUrl: uploadedImageUrl };

                const response = await axios.put(`${backendServer}/api/update-my-profile/${address.id}`, finalFormData);
                toast.success(response.data.message);
                setSaveLoader(false);
                fetchDetails();
            } catch (error) {
                toast.error(error.response.data.message);
                setSaveLoader(false);
            }
        } else {
            toast.error("To change password, both the old and new passwords are mandatory!");
        }

    };

    const handleDeleteProfilePhoto = async (url) => {
        if (!url) {
            toast.error("No profile picture found!");
        } else {
            setButtonLoader(true);
            try {
                const response = await axios.put(`${backendServer}/api/delete-profile-img/${address.id}`, { fileUrl: url });
                fetchDetails();
                toast.success(response.data.message);
                setButtonLoader(false);
            } catch (error) {
                toast.error(error.response.data.message);
                setButtonLoader(false);
            }
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-full min-h-screen flex flex-col items-center justify-start rounded-lg bg-white">
                <div className="w-full flex items-center justify-start p-6 bg-[#F8F9FD] gap-6">
                    <div onClick={() => navigate(-1)}
                        className="flex items-center justify-center rounded-[50%] bg-[#7F55DE] p-2 cursor-pointer">
                        <IoArrowBack className='text-white text-2xl' />
                    </div>
                    <img className={`w-[6rem]`} src="../images/logoBlue.png" alt="Logo" />
                </div>

                <div className="w-full flex flex-col items-center justify-start gap-4 p-8">
                    <div className="w-full text-left text-gray-900 text-2xl font-medium">My Profile</div>
                    <div className="w-full h-[2px] bg-gray-300"></div>
                    {
                        loader ?
                            <div className='w-full flex items-center justify-center mt-4'>
                                <CircularProgress />
                            </div> :
                            error ?
                                <div className="w-full flex items-center justify-center text-red-600 font-medium mt-4">
                                    Error: {error}
                                </div> :
                                <div className="w-[90%] flex items-start justify-start">
                                    <input type="file" onChange={handleFileChange} ref={fileInputRef} name='file' accept="image/*" style={{ display: 'none' }} />
                                    <div className="w-full flex flex-col items-center justify-start gap-4">
                                        <div className="w-full text-left font-medium text-gray-800">Profile Picture:</div>
                                        <div className="w-full flex items-center justify-start">
                                            <img className='w-[10rem] rounded-[50%] aspect-square'
                                                src={!data.imageUrl ? '/images/blankProfile.jpg' : data.imageUrl} alt="" />
                                        </div>
                                        {
                                            selectedFile &&
                                            <div className="w-full flex items-start justify-start gap-2 text-sm">
                                                <div className='text-nowrap font-medium'>Selected image:</div>
                                                <img className='w-[5rem] rounded-[50%] aspect-square' src={fileURL} alt="" />
                                                <div>{fileName}</div>
                                            </div>
                                        }
                                        {
                                            buttonLoader ? <div className="w-full flex items-center justify-start pl-32"><CircularProgress /></div>
                                                :
                                                <div className="w-full flex items-center justify-start gap-4">
                                                    <button onClick={handleButtonClick}
                                                        className='bg-[#7F55DE] p-2 px-4 text-white text-sm font-medium rounded-lg'>Change Picture</button>
                                                    <button onClick={() => handleDeleteProfilePhoto(data.imageUrl)}
                                                        className='bg-gray-200 p-2 px-4 text-red-600 text-sm font-medium rounded-lg'>Delete Picture</button>
                                                </div>
                                        }
                                    </div>

                                    <form className="w-full flex flex-col items-center justify-start gap-4">
                                        <div className="w-full flex items-center justify-start gap-8">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-full text-left font-medium text-gray-800">Name:</div>
                                                <div className="w-full flex items-center justify-start">
                                                    <input value={data.name}
                                                        className='w-[25rem] p-2 border border-solid border-gray-300 rounded-md text-[15px]'
                                                        type="text" name="name" disabled />
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-full text-left font-medium text-gray-800">Email:</div>
                                                <div className="w-full flex items-center justify-start">
                                                    <input value={data.email}
                                                        className='w-[25rem] p-2 border border-solid border-gray-300 rounded-md text-[15px]'
                                                        type="text" name="email" disabled />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full flex flex-col items-center justify-start gap-2.5">
                                            <div className="w-full flex items-center justify-start gap-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-full text-left font-medium text-gray-800">Old Password:</div>
                                                    <div className="w-full flex items-center justify-start">
                                                        <input value={formData.oldPass} onChange={handleInputChange}
                                                            className='w-[25rem] p-2 border border-solid border-gray-300 rounded-md text-[15px]'
                                                            type={isChecked ? 'text' : 'password'} name="oldPass" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-full text-left font-medium text-gray-800">New Password:</div>
                                                    <div className="w-full flex items-center justify-start">
                                                        <input value={formData.newPass} onChange={handleInputChange}
                                                            className='w-[25rem] p-2 border border-solid border-gray-300 rounded-md text-[15px]'
                                                            type={isChecked ? 'text' : 'password'} name="newPass" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full flex flex-col items-center gap-1.5">
                                                <div className="w-full flex items-center justify-start gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={handleCheckboxChange}
                                                        name="showPassword" id="showPassword" />
                                                    <div className='text-sm'>Show password</div>
                                                </div>
                                                <div className="w-full text-left text-xs  italic">*Leave the password fields blank to keep current password</div>
                                            </div>
                                        </div>

                                        {
                                            userType === "Employee" && <div className="w-full flex flex-col items-center gap-2">
                                                <div className="w-full text-left font-medium text-gray-800">Current Role:</div>
                                                <div className="w-full flex items-center justify-start">
                                                    <input value={data.role}
                                                        className='w-[25rem] p-2 border border-solid border-gray-300 rounded-md text-[15px]'
                                                        type="text" name="role" disabled />
                                                </div>
                                            </div>
                                        }

                                        <div className="w-full flex flex-col items-center gap-2">
                                            <div className="w-full text-left font-medium text-gray-800">Title:</div>
                                            <div className="w-full flex items-center justify-start">
                                                <input value={formData.title} onChange={handleInputChange}
                                                    className='w-[25rem] p-2 border border-solid border-gray-300 rounded-md text-[15px]'
                                                    type="text" name="title" />
                                            </div>
                                        </div>

                                        <div className="w-full flex items-center justify-start mt-4">
                                            {
                                                saveLoader ? <CircularProgress /> :
                                                    <button onClick={handleUpdate}
                                                        className='bg-[#7F55DE] p-2 px-6 text-white text-base font-medium rounded-lg'>Update Profile</button>
                                            }
                                        </div>
                                    </form>
                                </div>
                    }
                </div>

            </div>
        </div>
    );
};

export default ProfilePage;
