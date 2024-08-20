import React, { useContext, useEffect, useState } from 'react';

const ViewHardware = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.hardware_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.hardware_len}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.hardware_wid}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height:</div>
                <div>{pdt.productDetails.hardware_height}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.hardware_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Finish:</div>
                <div>{pdt.productDetails.hardware_finish}</div>
            </div>            
        </>);
};

export default ViewHardware;
