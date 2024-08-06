import React, { useContext } from 'react';
import ForEmployee from './ForEmployee';
import ForClient from './ForClient';
import ForVendor from './ForVendor';
import ForRoleAuthorization from './ForRoleAuthorization';
import ForRoleRegistration from './ForRoleRegistration';

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

const RoleRegistration = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Role Registration</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <ForRoleRegistration />
        </div>
    );
};

const RoleAuthorization = () => {

    return (
        <div className="w-full flex flex-col items-start justify-center gap-[1.1rem]">
            <div className="w-full text-left text-gray-900 text-2xl font-medium">Role Authorization</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <ForRoleAuthorization />
        </div>
    );
};


export { UserRegistration, ClientRegistration, VendorRegistration, RoleRegistration, RoleAuthorization };
