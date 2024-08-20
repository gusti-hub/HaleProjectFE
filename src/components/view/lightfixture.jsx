import React, { useContext, useEffect, useState } from 'react';

const ViewHardwired = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.hardwired_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length Overall:</div>
                <div>{pdt.productDetails.hardwired_len_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width Overall:</div>
                <div>{pdt.productDetails.hardwired_wid_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height Overall:</div>
                <div>{pdt.productDetails.hardwired_height_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length Fixture:</div>
                <div>{pdt.productDetails.hardwired_len_fixture}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width Fixture:</div>
                <div>{pdt.productDetails.hardwired_wid_fixture}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height Fixture:</div>
                <div>{pdt.productDetails.hardwired_height_fixture}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length Shade:</div>
                <div>{pdt.productDetails.hardwired_len_shade}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width Shade:</div>
                <div>{pdt.productDetails.hardwired_wid_shade}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height Shade:</div>
                <div>{pdt.productDetails.hardwired_height_shade}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.hardwired_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Finish:</div>
                <div>{pdt.productDetails.hardwired_finish}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Base Material:</div>
                <div>{pdt.productDetails.hardwired_base_material}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Shade Material:</div>
                <div>{pdt.productDetails.hardwired_shade_material}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Shade Type:</div>
                <div>{pdt.productDetails.hardwired_shade_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Switch Type:</div>
                <div>{pdt.productDetails.hardwired_switch_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Quantity:</div>
                <div>{pdt.productDetails.hardwired_quantity}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Socket Type:</div>
                <div>{pdt.productDetails.hardwired_socket_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Dimmable:</div>
                <div>{pdt.productDetails.hardwired_dimmable}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Switch:</div>
                <div>{pdt.productDetails.hardwired_switch}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Wattaga:</div>
                <div>{pdt.productDetails.hardwired_wattaga}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Temperature:</div>
                <div>{pdt.productDetails.hardwired_temperature}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Rating:</div>
                <div>{pdt.productDetails.hardwired_rating}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Hardwired:</div>
                <div>{pdt.productDetails.hardwired}</div>
            </div>
       
        </>);
};

export default ViewHardwired;
