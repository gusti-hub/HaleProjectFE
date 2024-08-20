import React, { useContext, useEffect, useState } from 'react';

const Casegood = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="casegood_unit">Size Unit:</label>
                    <select
                        value={formData.casegood_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="casegood_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="casegood_len">L:</label>
                        <input value={formData.casegood_len} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='casegood_len' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="casegood_wid">W:</label>
                        <input value={formData.casegood_wid} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='casegood_wid' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="casegood_height">H:</label>
                        <input value={formData.casegood_height} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='casegood_height' placeholder='Height' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="casegood_top">Top:</label>
                    <input value={formData.casegood_top} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='casegood_top' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="casegood_finish">Finish:</label>
                    <input value={formData.casegood_finish} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='casegood_finish' placeholder='Type here...' maxLength="50" />
                </div> 
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="casegood_outlet">Outlet:</label>
                    <input value={formData.casegood_outlet} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='casegood_outlet' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="casegood_hardware">hardware:</label>
                    <input value={formData.casegood_hardware} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='casegood_hardware' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>                               
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="casegood_installation_type">Installation Type:</label>
                    <select
                        value={formData.casegood_installation_type}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="casegood_installation_type">
                        <option value="" disabled>Select an option</option>
                        <option value="Built-in">Built-in</option>
                        <option value="Freestanding">Freestanding</option>
                    </select>
                </div> 
            </div>                
        </>);
};

export default Casegood;
