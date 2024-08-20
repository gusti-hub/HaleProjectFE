import React, { useContext, useEffect, useState } from 'react';

const ViewWindowTreatment = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.wt_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length Window:</div>
                <div>{pdt.productDetails.wt_len_window}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width Window:</div>
                <div>{pdt.productDetails.wt_wid_window}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height Window:</div>
                <div>{pdt.productDetails.wt_height_window}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Mount:</div>
                <div>{pdt.productDetails.wt_mount}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Valance:</div>
                <div>{pdt.productDetails.wt_valance}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Vendor Provided Fabric:</div>
                <div>{pdt.productDetails.wt_vendor_provided_fabric}</div>
            </div>
            {
                pdt.productDetails.wt_vendor_provided_fabric == "Yes" ?
                <>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Fabric:</div>
                        <div>{pdt.productDetails.wt_fabric}</div>
                    </div>
                </> 
                : <></>
            }           
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Com Fabric:</div>
                <div>{pdt.productDetails.wt_com_fabric}</div>
            </div>
            {
                pdt.productDetails.wt_com_fabric == "Yes" ?
                <>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Pattern Name:</div>
                        <div>{pdt.productDetails.wt_pattern_name}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Sku:</div>
                        <div>{pdt.productDetails.wt_sku}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Color:</div>
                        <div>{pdt.productDetails.wt_color}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Horizontal:</div>
                        <div>{pdt.productDetails.wt_horizontal}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Vertical:</div>
                        <div>{pdt.productDetails.wt_vertical}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Content:</div>
                        <div>{pdt.productDetails.wt_content}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Backing:</div>
                        <div>{pdt.productDetails.wt_backing}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Installation Type:</div>
                        <div>{pdt.productDetails.wt_installation_type}</div>
                    </div>
                </> 
                : <></>
            }                         
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Type:</div>
                <div>{pdt.productDetails.wt_type}</div>
            </div>
            {
                pdt.productDetails.wt_type == "Drapery" ?
                <>
                    <div className="h-[20px] bg-gray-300"></div>
                    <div className="w-full flex items-center justify-start font-semibold">Drapery</div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Style:</div>
                        <div>{pdt.productDetails.wt_drapery_style}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Fullness:</div>
                        <div>{pdt.productDetails.wt_drapery_fullness}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Hem:</div>
                        <div>{pdt.productDetails.wt_drapery_hem}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Construction:</div>
                        <div>{pdt.productDetails.wt_drapery_construction}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Control:</div>
                        <div>{pdt.productDetails.wt_drapery_control}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Control Location:</div>
                        <div>{pdt.productDetails.wt_drapery_control_location}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Hardware:</div>
                        <div>{pdt.productDetails.wt_drapery_hardware}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Blackout Linear:</div>
                        <div>{pdt.productDetails.wt_drapery_blackout_linear}</div>
                    </div>
                </> 
                : 
                <>
                    <div className="h-[20px] bg-gray-300"></div>
                    <div className="w-full flex items-center justify-start font-semibold">Shade</div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Style:</div>
                        <div>{pdt.productDetails.wt_shade_style}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Fullness:</div>
                        <div>{pdt.productDetails.wt_shade_fullness}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Hem:</div>
                        <div>{pdt.productDetails.wt_shade_hem}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Construction:</div>
                        <div>{pdt.productDetails.wt_shade_construction}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Control Type:</div>
                        <div>{pdt.productDetails.wt_shade_control_type}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Control Location:</div>
                        <div>{pdt.productDetails.wt_shade_control_location}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Hardware:</div>
                        <div>{pdt.productDetails.wt_shade_hardware}</div>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Blackout Linear:</div>
                        <div>{pdt.productDetails.wt_shade_blackout_linear}</div>
                    </div>
                </>
            }        
        </>);
};

export default ViewWindowTreatment;
