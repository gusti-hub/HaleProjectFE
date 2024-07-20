import React, { createContext, useState } from 'react';

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

    return (
        <AppContext.Provider
            value={{menuID, handleMenuID, userReg, handleUserReg, open, handleOpen}}
        >
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };
