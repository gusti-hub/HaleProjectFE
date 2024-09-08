import axios from 'axios';
import React, { createContext, useState } from 'react';
import { backendServer } from '../utils/info';

const AppContext = createContext();

const AppProvider = ({ children }) => {

    const [menuID, setMenuID] = useState(1);

    const handleMenuID = (id) => {
        setMenuID(id);
    }

    const [userReg, setUserReg] = useState('clt');

    const handleUserReg = (val) => {
        setUserReg(val);
    }

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen((cur) => !cur);
    };

    const loggedInUserID = localStorage.getItem('userId');

    const [loggedInUserName, setLoggedInUserName] = useState(null);
    const [nameLoader, setNameLoader] = useState(false);
    const [nameError, setNameError] = useState(null);

    const fetchName = async () => {
        setNameLoader(true);
        try {
            const response = await axios.get(`${backendServer}/api/getLoggedInUser/${loggedInUserID}`);
            setLoggedInUserName(response.data);
            setNameLoader(false);
        } catch (error) {
            setNameError("Error");
            setNameLoader(false);
        }
    };

    return (
        <AppContext.Provider
            value={{ menuID, handleMenuID, userReg, handleUserReg, open, handleOpen, nameLoader, loggedInUserName, nameError, fetchName }}
        >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
