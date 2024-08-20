import React, { useContext, useEffect, useState } from 'react';

const ViewCasegood = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.casegood_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.casegood_len}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.casegood_wid}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height:</div>
                <div>{pdt.productDetails.casegood_height}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Top:</div>
                <div>{pdt.productDetails.casegood_top}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Finish:</div>
                <div>{pdt.productDetails.casegood_finish}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Outlet:</div>
                <div>{pdt.productDetails.casegood_outlet}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Hardware:</div>
                <div>{pdt.productDetails.casegood_hardware}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Installation Type:</div>
                <div>{pdt.productDetails.casegood_installation_type}</div>
            </div>
   
        </>);
};

export default ViewCasegood;
