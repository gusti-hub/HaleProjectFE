import React, { useContext, useEffect, useState } from 'react';

const Accessory = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="unit">Size Unit:</label>
                    <select
                        value={formData.acessory_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="acessory_len">L:</label>
                        <input value={formData.acessory_len} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='acessory_len' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="acessory_wid">W:</label>
                        <input value={formData.acessory_wid} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='acessory_wid' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="acessory_height">H:</label>
                        <input value={formData.acessory_height} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='acessory_height' placeholder='Height' maxLength="5" />
                    </div>
                </div>
                </div><div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="acessory_color">Color:</label>
                            <input value={formData.acessory_color} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='acessory_color' placeholder='Type here...' maxLength="50" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="acessory_finish">Finish:</label>
                            <input value={formData.acessory_finish} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='acessory_finish' placeholder='Type here...' maxLength="50" />
                        </div>
                    </div>
                </div>
        </>);
};

export default Accessory;
