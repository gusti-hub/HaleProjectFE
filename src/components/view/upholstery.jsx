import React, { useContext, useEffect, useState } from 'react';

const ViewUpholstery = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.upholstery_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.upholstery_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.upholstery_width}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Horizontal:</div>
                <div>{pdt.productDetails.upholstery_horizontal}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Vertical:</div>
                <div>{pdt.productDetails.upholstery_vertical}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Content:</div>
                <div>{pdt.productDetails.upholstery_content}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Backing:</div>
                <div>{pdt.productDetails.upholstery_backing}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Qty:</div>
                <div>{pdt.productDetails.upholstery_qty}</div>
            </div>
        </>);
};

export default ViewUpholstery;
