import React, { useContext, useEffect, useState } from 'react';

const ViewWallpaper = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Color:</div>
                <div>{pdt.productDetails.wallpaper_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.wallpaper_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.wallpaper_width}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Horizontal:</div>
                <div>{pdt.productDetails.wallpaper_horizontal}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Vertical:</div>
                <div>{pdt.productDetails.wallpaper_vertical}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Content:</div>
                <div>{pdt.productDetails.wallpaper_content}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Type:</div>
                <div>{pdt.productDetails.wallpaper_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Weight:</div>
                <div>{pdt.productDetails.wallpaper_weight}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Backing:</div>
                <div>{pdt.productDetails.wallpaper_backing}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Installation:</div>
                <div>{pdt.productDetails.wallpaper_installation}</div>
            </div>
   
        </>);
};

export default ViewWallpaper;
