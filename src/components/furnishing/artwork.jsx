import React, { useContext, useEffect, useState } from 'react';

const Artwork = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_unit">Size Unit:</label>
                    <select
                        value={formData.artwork_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="artwork_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 font-semibold">
                <label>Overall Size:</label>
            </div>    
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_len_overall">L:</label>
                        <input value={formData.artwork_len_overall} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_len_overall' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_wid_overall">W:</label>
                        <input value={formData.artwork_wid_overall} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_wid_overall' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_height_overall">H:</label>
                        <input value={formData.artwork_height_overall} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_height_overall' placeholder='Height' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 font-semibold">
                <label>Frame Size:</label>
            </div>    
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_wid_frame">W:</label>
                        <input value={formData.artwork_wid_frame} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_wid_frame' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_height_frame">H:</label>
                        <input value={formData.artwork_height_frame} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_height_frame' placeholder='Height' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 font-semibold">
                <label>Artwork Size:</label>
            </div>    
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_len_artwork">L:</label>
                        <input value={formData.artwork_len_artwork} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_len_artwork' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="artwork_wid_artwork">W:</label>
                        <input value={formData.artwork_wid_artwork} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='artwork_wid_artwork' placeholder='Width' maxLength="5" />
                    </div>
                </div>
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_medium">Medium:</label>
                    <input value={formData.artwork_medium} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='artwork_medium' placeholder='Type here...' maxLength="50" />
                </div>     
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_frame_item">Frame Item:</label>
                    <input value={formData.artwork_frame_item} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='artwork_frame_item' placeholder='Type here...' maxLength="50" />
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_frame_material">Frame Material:</label>
                    <input value={formData.artwork_frame_material} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='artwork_frame_material' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_frame_finish">Frame Finish:</label>
                    <input value={formData.artwork_frame_finish} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='artwork_frame_finish' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_mat_color">Mat Color:</label>
                    <input value={formData.artwork_mat_color} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='artwork_mat_color' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_mat_size">Mat Size:</label>
                    <input value={formData.artwork_mat_size} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='artwork_mat_size' placeholder='Type here...' maxLength="50" />
                </div> 
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_orientation">Orientation:</label>
                    <select
                        value={formData.artwork_orientation}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="artwork_orientation" >
                        <option value="" disabled>Select an option</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Landscape">Landscape</option>
                    </select>
                </div> 
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_glass">Glass:</label>
                    <select
                        value={formData.artwork_glass}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="artwork_glass">
                        <option value="" disabled>Select an option</option>
                        <option value="Regular Glass">Regular Glass</option>
                        <option value="Museum Glass">Museum Glass</option>
                    </select>
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="artwork_mounting_hardware">Mounting Hardware:</label>
                    <input value={formData.artwork_mounting_hardware} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='artwork_mounting_hardware' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>                                                                                                                                                      
        </>);
};

export default Artwork;
