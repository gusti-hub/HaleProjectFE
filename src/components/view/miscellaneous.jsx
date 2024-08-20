import React, { useContext, useEffect, useState } from 'react';

const ViewMiscellaneous = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Fabrication Style:</div>
                <div>{pdt.productDetails.miscellaneous_fabrication_style}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Pattern:</div>
                <div>{pdt.productDetails.miscellaneous_pattern}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Insert:</div>
                <div>{pdt.productDetails.miscellaneous_insert}</div>
            </div>
        </>);
};

export default ViewMiscellaneous;
