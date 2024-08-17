import React, { useContext, useEffect, useState } from 'react';

const Upholstery = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="upholstery_color">Color:</label>
                    <input value={formData.upholstery_color} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='upholstery_color' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>   
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="upholstery_unit">Size Unit:</label>
                    <select
                        value={formData.upholstery_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="upholstery_width">Width:</label>
                        <input value={formData.upholstery_width} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='upholstery_width' placeholder='Width' maxLength="5" />
                    </div>                  
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">                   
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="upholstery_horizontal">Horizontal Repeat:</label>
                        <input value={formData.upholstery_horizontal} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='upholstery_horizontal' placeholder='Horizontal' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="upholstery_vertical">Vertical Repeat:</label>
                        <input value={formData.upholstery_vertical} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='upholstery_vertical' placeholder='vertical' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="upholstery_content">Content:</label>
                    <input value={formData.upholstery_content} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='upholstery_content' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="upholstery_backing">Backing:</label>
                    <input value={formData.upholstery_backing} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='upholstery_backing' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                <label htmlFor="upholstery_qty">Qty:</label>
                    <input value={formData.upholstery_qty} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="number" name='upholstery_qty' placeholder='Length' maxLength="5" />
                    <div className="text-gray-800">yards</div>
            </div>                                        
        </>);
};

export default Upholstery;
