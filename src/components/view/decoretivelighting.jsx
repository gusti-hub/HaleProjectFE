import React, { useContext, useEffect, useState } from 'react';

const ViewDecorativeLighting = ({pdt}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Unit:</div>
                <div>{pdt.productDetails.decorative_lighting_unit}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Length Overall:</div>
                <div>{pdt.productDetails.decorative_lighting_len_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Width Overall:</div>
                <div>{pdt.productDetails.decorative_lighting_wid_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Height Overall:</div>
                <div>{pdt.productDetails.decorative_lighting_height_overall}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Length Fixture:</div>
                <div>{pdt.productDetails.decorative_lighting_len_fixture}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Width Fixture:</div>
                <div>{pdt.productDetails.decorative_lighting_wid_fixture}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Height Fixture:</div>
                <div>{pdt.productDetails.decorative_lighting_height_fixture}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Length Shade:</div>
                <div>{pdt.productDetails.decorative_lighting_len_shade}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Width Shade:</div>
                <div>{pdt.productDetails.decorative_lighting_wid_shade}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Height Shade:</div>
                <div>{pdt.productDetails.decorative_lighting_height_shade}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Color:</div>
                <div>{pdt.productDetails.decorative_lighting_color}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Finish:</div>
                <div>{pdt.productDetails.decorative_lighting_finish}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Base Material:</div>
                <div>{pdt.productDetails.decorative_lighting_base_material}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Shade Material:</div>
                <div>{pdt.productDetails.decorative_lighting_shade_material}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Shade Type:</div>
                <div>{pdt.productDetails.decorative_lighting_shade_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Switch Type:</div>
                <div>{pdt.productDetails.decorative_lighting_switch_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Quantity:</div>
                <div>{pdt.productDetails.decorative_lighting_quantity}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Socket Type:</div>
                <div>{pdt.productDetails.decorative_lighting_socket_type}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Dimmable:</div>
                <div>{pdt.productDetails.decorative_lighting_dimmable}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Switch:</div>
                <div>{pdt.productDetails.decorative_lighting_switch}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Wattaga:</div>
                <div>{pdt.productDetails.decorative_lighting_wattaga}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Temperature:</div>
                <div>{pdt.productDetails.decorative_lighting_temperature}</div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className='font-medium'>Lighting Rating:</div>
                <div>{pdt.productDetails.decorative_lighting_rating}</div>
            </div>

        </>);
};

export default ViewDecorativeLighting;
