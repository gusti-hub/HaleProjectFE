import React, { useContext, useEffect, useState } from 'react';

const ViewFabric = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.fabric_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.fabric_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.fabric_width}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Horizontal:</div>
                <div>{pdt.productDetails.fabric_horizontal}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Vertical:</div>
                <div>{pdt.productDetails.fabric_vertical}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Content:</div>
                <div>{pdt.productDetails.fabric_content}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Backing:</div>
                <div>{pdt.productDetails.fabric_backing}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>CFA Required:</div>
                <div>{pdt.productDetails.fabric_cfa_required}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>CFA Waived:</div>
                <div>{pdt.productDetails.fabric_cfa_waived}</div>
            </div>
        </>);
};

export default ViewFabric;
