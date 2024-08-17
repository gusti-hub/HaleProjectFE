import React, { useContext, useEffect, useState } from 'react';

const Equipment = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="equipment_unit">Size Unit:</label>
                    <select
                        value={formData.equipment_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="equipment_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="equipment_len">L:</label>
                        <input value={formData.equipment_len} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='equipment_en' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="equipment_wid">W:</label>
                        <input value={formData.equipment_wid} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='equipment_wid' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="equipment_height">H:</label>
                        <input value={formData.equipment_height} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='equipment_height' placeholder='Height' maxLength="5" />
                    </div>
                </div>
                </div><div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="equipment_color">Color:</label>
                            <input value={formData.equipment_color} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='equipment_color' placeholder='Type here...' maxLength="50" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="equipment_finish">Finish:</label>
                            <input value={formData.equipment_finish} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='equipment_finish' placeholder='Type here...' maxLength="50" />
                        </div>
                    </div>
                </div>
        </>);
};

export default Equipment;
