import React, { useContext, useEffect, useState } from 'react';

const ViewSeating = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.seating_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.seating_len}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.seating_wid}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height:</div>
                <div>{pdt.productDetails.seating_height}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.seating_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Finish:</div>
                <div>{pdt.productDetails.seating_finish}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Vendor Provided Fabric:</div>
                <div>{pdt.productDetails.seating_vendor_provided_fabric}</div>
            </div>
            {
                pdt.productDetails.seating_vendor_provided_fabric == "Yes" ?
                <>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Fabric:</div>
                        <div>{pdt.productDetails.seating_fabric}</div>
                    </div>
                </> 
                : <></>

            }
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Com Fabric:</div>
                <div>{pdt.productDetails.seating_com_fabric}</div>
            </div>
            {
                pdt.productDetails.seating_com_fabric == "Yes" ?
                <>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Pattern Name:</div>
                        <div>{pdt.productDetails.seating_pattern_name}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Sku:</div>
                        <div>{pdt.productDetails.seating_sku}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Width:</div>
                        <div>{pdt.productDetails.seating_width}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Horizontal:</div>
                        <div>{pdt.productDetails.seating_horizontal}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Vertical:</div>
                        <div>{pdt.productDetails.seating_vertical}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Content:</div>
                        <div>{pdt.productDetails.seating_content}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Backing:</div>
                        <div>{pdt.productDetails.seating_backing}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Qty:</div>
                        <div>{pdt.productDetails.seating_qty}</div>
                    </div>
                </> 
                : <></>
            }          
     
        </>);
};

export default ViewSeating;
