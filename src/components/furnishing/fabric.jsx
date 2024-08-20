import React, { useContext, useEffect, useState } from 'react';

const Fabric = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="fabric_color">Color:</label>
                    <input value={formData.fabric_color} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='fabric_color' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>   
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="fabric_unit">Size Unit:</label>
                    <select
                        value={formData.fabric_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="fabric_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="fabric_width">Width:</label>
                        <input value={formData.fabric_width} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='fabric_width' placeholder='Width' maxLength="5" />
                    </div>                  
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">                   
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="fabric_horizontal">Horizontal Repeat:</label>
                        <input value={formData.fabric_horizontal} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='fabric_horizontal' placeholder='Horizontal' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="fabric_vertical">Vertical Repeat:</label>
                        <input value={formData.fabric_vertical} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='fabric_vertical' placeholder='vertical' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="fabric_content">Content:</label>
                    <input value={formData.fabric_content} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='fabric_content' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="fabric_backing">Backing:</label>
                    <input value={formData.fabric_backing} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='fabric_backing' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>   
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="fabric_cfa_required">CFA Required:</label>
                     <select
                        value={formData.fabric_cfa_required}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="fabric_cfa_required">
                        <option value="" disabled>Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div> 
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="fabric_cfa_waived">CFA Waived:</label>
                    <select
                        value={formData.fabric_cfa_waived}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="fabric_cfa_waived">
                        <option value="" disabled>Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>                 
            </div>                                        
        </>);
};

export default Fabric;
