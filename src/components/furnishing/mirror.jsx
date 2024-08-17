import React, { useContext, useEffect, useState } from 'react';

const Mirror = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="mirror_unit">Size Unit:</label>
                    <select
                        value={formData.mirror_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="mirror_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="mirror_len">L:</label>
                        <input value={formData.mirror_len} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='mirror_len' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="mirror_wid">W:</label>
                        <input value={formData.mirror_wid} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='mirror_wid' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="mirror_height">H:</label>
                        <input value={formData.mirror_height} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='mirror_height' placeholder='Height' maxLength="5" />
                    </div>
                </div>
                </div><div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="mirror_color">Color:</label>
                            <input value={formData.mirror_color} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='mirror_color' placeholder='Type here...' maxLength="50" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="mirror_finish">Finish:</label>
                            <input value={formData.mirror_finish} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='mirror_finish' placeholder='Type here...' maxLength="50" />
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="mirror_orientation">Orientation:</label>
                        <select
                            value={formData.mirror_orientation}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="mirror_orientation">
                            <option value="" disabled>Select an option</option>
                            <option value="Portrait">Portrait</option>
                            <option value="Landscape">Landscape</option>
                        </select>
                    </div> 
                </div> 
                <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="mirror_glass">Glass:</label>
                        <select
                            value={formData.mirror_glass}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="mirror_glass">
                            <option value="" disabled>Select an option</option>
                            <option value="Regular Glass">Regular Glass</option>
                            <option value="Museum Glass">Museum Glass</option>
                        </select>
                    </div> 
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="mirror_mounting_hardware">Mounting Hardware:</label>
                        <input value={formData.mirror_mounting_hardware} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='mirror_mounting_hardware' placeholder='Type here...' maxLength="50" />
                    </div> 
                </div>                   
        </>);
};

export default Mirror;
