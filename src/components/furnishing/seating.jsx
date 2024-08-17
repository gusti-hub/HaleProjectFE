import React, { useContext, useEffect, useState } from 'react';

const Seating = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="seating_unit">Size Unit:</label>
                    <select
                        value={formData.seating_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="seating_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="seating_len">L:</label>
                        <input value={formData.seating_len} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='seating_len' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="seating_wid">W:</label>
                        <input value={formData.seating_wid} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='seating_wid' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="seating_height">H:</label>
                        <input value={formData.seating_height} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='seating_height' placeholder='Height' maxLength="5" />
                    </div>
                </div>
                </div><div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="seating_color">Color:</label>
                            <input value={formData.seating_color} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_color' placeholder='Type here...' maxLength="50" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="seating_finish">Finish:</label>
                            <input value={formData.seating_finish} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_finish' placeholder='Type here...' maxLength="50" />
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="seating_vendor_provided_fabric">Vendor Provided Fabric:</label>
                        <select
                            value={formData.seating_vendor_provided_fabric}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="seating_vendor_provided_fabric">
                            <option value="" disabled>Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div> 
                </div>
                {
                    formData.seating_vendor_provided_fabric === 'Yes' &&
                    (<div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="seating_fabric">Fabric:</label>
                        <input value={formData.seating_fabric} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='seating_fabric' placeholder='Type here...' maxLength="50" />
                    </div>)
                    
                } 
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="seating_com_fabric">COM Fabric:</label>
                        <select
                            value={formData.seating_com_fabric}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="seating_com_fabric">
                            <option value="" disabled>Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                </div> 
                {
                    formData.seating_com_fabric === 'Yes' &&
                    (
                        <>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_pattern_name">Pattern Name:</label>
                                <input value={formData.seating_pattern_name} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_pattern_name' placeholder='Type here...' maxLength="100" />
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_sku">Item SKU:</label>
                                <input value={formData.seating_sku} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_sku' placeholder='Type here...' maxLength="50" />
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_color">Color:</label>
                                <input value={formData.seating_color} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_color' placeholder='Type here...' maxLength="50" />
                            </div> 
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_width">Width:</label>
                                <input value={formData.seating_width} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="number" name='seating_width' placeholder='Width' maxLength="5" />
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_horizontal">Horizontal Repeat:</label>
                                <input value={formData.seating_horizontal} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="number" name='seating_horizontal' placeholder='Horizontal' maxLength="5" />
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_vertical">Vertical Repeat:</label>
                                <input value={formData.seating_vertical} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="number" name='seating_vertical' placeholder='vertical' maxLength="5" />
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_content">Content:</label>
                                <input value={formData.seating_content} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_content' placeholder='Type here...' maxLength="50" />
                            </div> 
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_backing">Backing:</label>
                                <input value={formData.seating_backing} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='seating_backing' placeholder='Type here...' maxLength="50" />
                            </div> 
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="seating_qty">Qty:</label>
                                <input value={formData.seating_qty} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="number" name='seating_qty' placeholder='Length' maxLength="5" />
                                <div className="text-gray-800">yards</div>
                            </div>                                                                                                                                                          
                      </>
                    )
                }             
        </>);
};

export default Seating;
