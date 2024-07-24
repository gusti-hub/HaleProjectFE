import React, { useContext } from 'react';
import ForEmployee from './ForEmployee';
import ForClient from './ForClient';
import ForVendor from './ForVendor';

const UserRegistration = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Employee Registration</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <ForEmployee />
        </div>
    );
};

const ClientRegistration = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Client Registration</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <ForClient />
        </div>
    );
};

const VendorRegistration = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Vendor Registration</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <ForVendor />
        </div>
    );
};

export { UserRegistration, ClientRegistration, VendorRegistration };
