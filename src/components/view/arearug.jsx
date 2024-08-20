import React, { useContext, useEffect, useState } from 'react';

const ViewArearug = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Unit:</div>
                <div>{pdt.productDetails.arearug_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Length:</div>
                <div>{pdt.productDetails.arearug_len}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Width:</div>
                <div>{pdt.productDetails.arearug_wid}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Rug Pad:</div>
                <div>{pdt.productDetails.arearug_rugpad}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Content:</div>
                <div>{pdt.productDetails.arearug_content}</div>
            </div>
            { pdt.productDetails.arearug_custom == "Yes" ? 
                <>
                  <div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Custom:</div>
                      <div>{pdt.productDetails.arearug_custom}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Color:</div>
                      <div>{pdt.productDetails.arearug_color}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Gauge:</div>
                      <div>{pdt.productDetails.arearug_gauge}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Pile:</div>
                      <div>{pdt.productDetails.arearug_pile}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Stitches:</div>
                      <div>{pdt.productDetails.arearug_stitches}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Pattern:</div>
                      <div>{pdt.productDetails.arearug_pattern}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Construction:</div>
                      <div>{pdt.productDetails.arearug_construction}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Backing:</div>
                      <div>{pdt.productDetails.arearug_backing}</div>
                  </div><div className="w-full flex items-center justify-start gap-2">
                      <div className='font-medium'>Secondary Backing:</div>
                      <div>{pdt.productDetails.arearug_secondaryBacking}</div>
                  </div>
                </>
                :
                <>
                    <div className="w-full flex items-center justify-start gap-2">
                    <div className='font-medium'>Custom:</div>
                        <div>{pdt.productDetails.arearug_custom}</div>
                    </div><div className="w-full flex items-center justify-start gap-2">
                        <div className='font-medium'>Color:</div>
                    <div>{pdt.productDetails.arearug_color}</div>
                    </div>
                </>
            }
            
        </>);
};

export default ViewArearug;
