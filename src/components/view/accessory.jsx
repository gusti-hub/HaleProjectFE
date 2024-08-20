import React, { useContext, useEffect, useState } from 'react';

const ViewAcessory = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.acessory_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.acessory_len}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.acessory_wid}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height:</div>
                <div>{pdt.productDetails.acessory_height}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.acessory_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Finish:</div>
                <div>{pdt.productDetails.acessory_finish}</div>
            </div>        
        </>);
};

export default ViewAcessory;
