import React, { useContext, useEffect, useState } from 'react';

const Arearug = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="unit">Size Unit:</label>
                        <select
                            value={formData.unit}
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
                                <label htmlFor="arearug_len">L:</label>
                                <input value={formData.arearug_len} onChange={handleInputChange}
                                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                    type="number" name='arearug_len' placeholder='Length' maxLength="5" />
                            </div>
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="arearug_wid">W:</label>
                                <input value={formData.arearug_wid} onChange={handleInputChange}
                                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                    type="number" name='arearug_wid' placeholder='Width' maxLength="5" />
                            </div>
                        </div>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                        <div className="w-full flex items-center justify-start gap-2">
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="arearug_content">Content:</label>
                                <input value={formData.arearug_content} onChange={handleInputChange}
                                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                    type="text" name='arearug_content' placeholder='Type here...' maxLength="100" />
                            </div>
                        </div>
                </div>
                <div className="w-full flex items-center justify-center gap-4">
                        <div className="w-full flex items-center justify-start gap-2">
                            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                <label htmlFor="arearug_rugpad">Rug Pad:</label>
                                <input value={formData.arearug_rugpad} onChange={handleInputChange}
                                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                    type="text" name='arearug_rugpad' placeholder='Type here...' maxLength="200" />
                            </div>
                        </div>
                </div>
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="arearug_unit">Custom:</label>
                        <select
                            value={formData.custom}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="arearug_custom">
                            <option value="" disabled>Select an option</option>
                            <option value="No">No</option>                                    
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
                {
                    formData.custom === "Yes" ? (
                        <><div className="w-full flex items-center justify-center gap-4">
                                <div className="w-full flex items-center justify-start gap-2">
                                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                        <label htmlFor="arearug_color">Color:</label>
                                        <input
                                            value={formData.arearug_color}
                                            onChange={handleInputChange}
                                            className="w-full outline-none border-b border-solid border-b-black p-[2px]"
                                            type="text"
                                            name="arearug_color"
                                            placeholder="Type here..."
                                            maxLength="50" />
                                    </div>
                                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                        <label htmlFor="arearug_gauge">Gauge:</label>
                                        <input
                                            value={formData.arearug_gauge}
                                            onChange={handleInputChange}
                                            className="w-full outline-none border-b border-solid border-b-black p-[2px]"
                                            type="text"
                                            name="arearug_gauge"
                                            placeholder="Type here..."
                                            maxLength="10" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-4">
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                        <label htmlFor="arearug_pile">Pile Height:</label>
                                        <input value={formData.arearug_pile} onChange={handleInputChange}
                                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                            type="number" name='arearug_pile' placeholder='pile' maxLength="5"/>
                                        </div>
                                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                            <label htmlFor="arearug_stitches">Stitches per Inch:</label>
                                            <input value={formData.arearug_stitches} onChange={handleInputChange}
                                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                            type="number" name='arearug_stitches' placeholder='stitches' maxLength="50"/>
                                        </div>
                                    </div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-4">
                                <div className="w-full flex items-center justify-start gap-2">
                                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                        <label htmlFor="arearug_pattern">Pattern Repeat:</label>
                                        <input value={formData.arearug_pattern} onChange={handleInputChange}
                                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                            type="text" name='arearug_pattern' placeholder='Type here...' maxLength="50" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-4">
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                            <label htmlFor="arearug_construction">Construction:</label>
                                            <input value={formData.arearug_construction} onChange={handleInputChange}
                                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                                type="text" name='arearug_construction' placeholder='Type here...' maxLength="50" />
                                        </div>
                                    </div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-4">
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                            <label htmlFor="arearug_backing">Backing:</label>
                                            <input value={formData.arearug_backing} onChange={handleInputChange}
                                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                                type="text" name='arearug_backing' placeholder='Type here...' maxLength="100" />
                                        </div>
                                    </div>
                            </div> 
                            <div className="w-full flex items-center justify-center gap-4">
                                    <div className="w-full flex items-center justify-start gap-2">
                                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                            <label htmlFor="arearug_secondaryBacking">Secondary Backing:</label>
                                            <input value={formData.arearug_secondaryBacking} onChange={handleInputChange}
                                                className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                                type="text" name='arearug_secondaryBacking' placeholder='Type here...' maxLength="50" />
                                        </div>
                                    </div>
                            </div>                                                                                                             
                        </>                                
                    ) : (
                        <>                                                                            
                            <div className="w-full flex items-center justify-start gap-2">
                                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                                    <label htmlFor="arearug_color">Color:</label>
                                    <input value={formData.arearug_color} onChange={handleInputChange}
                                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                                        type="text" name='arearug_color' placeholder='Type here...' maxLength="50" />
                                </div>
                            </div>
                        </>
                    )
                }                                                                                     
        </>
    );
};

export default Arearug;
