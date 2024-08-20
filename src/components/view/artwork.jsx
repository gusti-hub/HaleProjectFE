import React, { useContext, useEffect, useState } from 'react';

const ViewArtwork = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Medium:</div>
                <div>{pdt.productDetails.artwork_medium}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Frame Item:</div>
                <div>{pdt.productDetails.artwork_frame_item}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Frame Material:</div>
                <div>{pdt.productDetails.artwork_frame_material}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Frame Finish:</div>
                <div>{pdt.productDetails.artwork_frame_finish}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Mat Color:</div>
                <div>{pdt.productDetails.artwork_mat_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Mat Size:</div>
                <div>{pdt.productDetails.artwork_mat_size}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Orientation:</div>
                <div>{pdt.productDetails.artwork_orientation}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Glass:</div>
                <div>{pdt.productDetails.artwork_glass}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Mounting Hardware:</div>
                <div>{pdt.productDetails.artwork_mounting_hardware}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.artwork_unit}</div>
            </div>            
            <div className="w-full flex items-center justify-start font-semibold">Overall</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.artwork_len_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.artwork_wid_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height:</div>
                <div>{pdt.productDetails.artwork_height_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start font-semibold">Frame</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.artwork_wid_frame}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Height:</div>
                <div>{pdt.productDetails.artwork_height_frame}</div>
            </div>
            <div className="w-full flex items-center justify-start font-semibold">Artwork</div>
            <div className="w-full h-[2px] bg-gray-300"></div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.artwork_len_artwork}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.artwork_wid_artwork}</div>
            </div>
        </>);
};

export default ViewArtwork;
