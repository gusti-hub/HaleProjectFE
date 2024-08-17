import React, { useContext, useEffect, useState } from 'react';

const Table = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="table_unit">Size Unit:</label>
                    <select
                        value={formData.table_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="table_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="table_len">L:</label>
                        <input value={formData.table_len} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='table_len' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="table_wid">W:</label>
                        <input value={formData.table_wid} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='table_wid' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="table_height">H:</label>
                        <input value={formData.table_height} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='table_height' placeholder='Height' maxLength="5" />
                    </div>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="table_other_dimension">Fabrication Style:</label>
                        <textarea value={formData.table_other_dimension} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="table_other_dimension" rows="2" maxLength="2500" placeholder='Type here...'></textarea>
                    </div> 
                </div>  
                </div><div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2">
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="table_top">Top:</label>
                            <input value={formData.table_top} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='table_top' placeholder='Type here...' maxLength="50" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="table_finish">Finish:</label>
                            <input value={formData.table_finish} onChange={handleInputChange}
                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                type="text" name='table_finish' placeholder='Type here...' maxLength="50" />
                        </div>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="table_hardware">Mounting Hardware:</label>
                        <input value={formData.table_hardware} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='table_hardware' placeholder='Type here...' maxLength="50" />
                    </div> 
                </div>                   
        </>);
};

export default Table;
