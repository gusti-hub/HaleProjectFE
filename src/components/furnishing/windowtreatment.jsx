import React, { useContext, useEffect, useState } from 'react';

const WindowTreatment = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wt_unit">Size Unit:</label>
                    <select
                        value={formData.wt_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="wt_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 font-semibold">
                <label>Window Dimension:</label>
            </div>    
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_len_window">L:</label>
                        <input value={formData.wt_len_window} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wt_len_window' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_wid_window">W:</label>
                        <input value={formData.wt_wid_window} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wt_wid_window' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_height_window">H:</label>
                        <input value={formData.wt_height_window} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wt_height_window' placeholder='Height' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wt_mount">COM Fabric:</label>
                        <select
                            value={formData.wt_mount}
                            onChange={handleInputChange}
                            className='p-1 outline-none' name="wt_mount">
                            <option value="" disabled>Select an option</option>
                            <option value="Inside">Inside</option>
                            <option value="Outside">Outside</option>
                        </select>
            </div>             
            <div className="w-full flex items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_valance">Valance:</label>
                        <textarea value={formData.wt_valance} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_valance" rows="2" maxLength="2500" placeholder='Type here...'></textarea>
                    </div> 
            </div>
            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                <label htmlFor="wt_vendor_provided_fabric">Vendor Provided Fabric:</label>
                    <select
                        value={formData.wt_vendor_provided_fabric}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="wt_vendor_provided_fabric">
                        <option value="" disabled>Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
            </div> 
            {
                formData.wt_vendor_provided_fabric === 'Yes' &&
                (<div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wt_fabric">Fabric:</label>
                    <input value={formData.wt_fabric} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='wt_fabric' placeholder='Type here...' maxLength="50" />
                </div>)
                
            }
            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                <label htmlFor="wt_com_fabric">COM Fabric:</label>
                    <select
                        value={formData.wt_com_fabric}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="wt_com_fabric">
                        <option value="" disabled>Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
            </div> 
            {
                formData.wt_com_fabric === 'Yes' &&
                (
                    <>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_pattern_name">Pattern Name:</label>
                            <input value={formData.wt_pattern_name} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_pattern_name' placeholder='Type here...' maxLength="100" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_sku">Item SKU:</label>
                            <input value={formData.wt_sku} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_sku' placeholder='Type here...' maxLength="50" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_color">Color:</label>
                            <input value={formData.wt_color} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_color' placeholder='Type here...' maxLength="50" />
                        </div> 
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_horizontal">Horizontal Repeat:</label>
                            <input value={formData.wt_horizontal} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wt_horizontal' placeholder='Horizontal' maxLength="5" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_vertical">Vertical Repeat:</label>
                            <input value={formData.wt_vertical} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wt_vertical' placeholder='vertical' maxLength="5" />
                        </div>
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_content">Content:</label>
                            <input value={formData.wt_content} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_content' placeholder='Type here...' maxLength="50" />
                        </div> 
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_backing">Backing:</label>
                            <input value={formData.wt_backing} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_backing' placeholder='Type here...' maxLength="50" />
                        </div> 
                        <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                            <label htmlFor="wt_installation_type">Installation Type:</label>
                            <input value={formData.wt_installation_type} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_installation_type' placeholder='Type here...' maxLength="50" />
                        </div>                                                                                                                                                         
                    </>
                )
            }
            <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                <label htmlFor="wt_type">Type:</label>
                    <select
                        value={formData.wt_type}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="wt_type">
                        <option value="" disabled>Select an option</option>
                        <option value="Drapery">Drapery</option>
                        <option value="Window Shade">Window Shade</option>
                    </select>
            </div>
            {
                formData.wt_type === 'Drapery' &&
                (<>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_style">Style:</label>
                            <select
                                value={formData.wt_drapery_style}
                                onChange={handleInputChange}
                                className='p-1 outline-none' name="wt_drapery_style">
                                <option value="" disabled>Select an option</option>
                                <option value="Grommet Top">Grommet Top</option>
                                <option value="Pinch Pleat">Pinch Pleat</option>
                                <option value="Rod Pocket">Rod Pocket</option>
                                <option value="Tab Top">Tab Top</option>
                            </select>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_fullness">Fullness:</label>
                        <input value={formData.wt_drapery_fullness} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_drapery_fullness' placeholder='Type here...' maxLength="50" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_hem">Hem:</label>
                        <textarea value={formData.wt_drapery_hem} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_drapery_hem" rows="2" maxLength="200" placeholder='Type here...'></textarea>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_construction">Construction:</label>
                        <textarea value={formData.wt_drapery_construction} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_drapery_construction" rows="2" maxLength="2500" placeholder='Type here...'></textarea>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_control">Control:</label>
                        <input value={formData.wt_drapery_control} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_drapery_control' placeholder='Type here...' maxLength="50" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_control_location">Control Location:</label>
                        <input value={formData.wt_drapery_control_location} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_drapery_control_location' placeholder='Type here...' maxLength="50" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_hardware">Hardware:</label>
                        <textarea value={formData.wt_drapery_hardware} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_drapery_hardware" rows="2" maxLength="200" placeholder='Type here...'></textarea>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_drapery_blackout_linear">Blackout Liner:</label>
                        <textarea value={formData.wt_drapery_blackout_linear} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_drapery_blackout_linear" rows="2" maxLength="200" placeholder='Type here...'></textarea>
                    </div>                                                                                                                             
                </>
                )                
            }
            {
                formData.wt_type === 'Window Shade' &&
                (<>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_style">Style:</label>
                            <select
                                value={formData.wt_shade_style}
                                onChange={handleInputChange}
                                className='p-1 outline-none' name="wt_shade_style">
                                <option value="" disabled>Select an option</option>
                                <option value="Roller">Roller</option>
                                <option value="Roman">Roman</option>
                                <option value="Woven">Woven</option>
                            </select>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_fullness">Fullness:</label>
                        <input value={formData.wt_shade_fullness} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="text" name='wt_shade_fullness' placeholder='Type here...' maxLength="50" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_hem">Hem:</label>
                        <textarea value={formData.wt_shade_hem} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_shade_hem" rows="2" maxLength="200" placeholder='Type here...'></textarea>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_construction">Construction:</label>
                        <textarea value={formData.wt_shade_construction} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_shade_construction" rows="2" maxLength="2500" placeholder='Type here...'></textarea>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_control_type">Control Type:</label>
                            <select
                                value={formData.wt_shade_control_type}
                                onChange={handleInputChange}
                                className='p-1 outline-none' name="wt_shade_control_type">
                                <option value="" disabled>Select an option</option>
                                <option value="Continuous">Continuous</option>
                                <option value="Pull">Pull</option>
                            </select>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_control_location">Control Location:</label>
                            <select
                                value={formData.wt_shade_control_location}
                                onChange={handleInputChange}
                                className='p-1 outline-none' name="wt_shade_control_location">
                                <option value="" disabled>Select an option</option>
                                <option value="Left Facing">Left Facing</option>
                                <option value="Right Facing">Right Facing</option>
                            </select>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_hardware">Hardware:</label>
                        <textarea value={formData.wt_shade_hardware} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_shade_hardware" rows="2" maxLength="200" placeholder='Type here...'></textarea>
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wt_shade_blackout_linear">Blackout Liner:</label>
                        <textarea value={formData.wt_shade_blackout_linear} onChange={handleInputChange}
                        className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                        name="wt_shade_blackout_linear" rows="2" maxLength="200" placeholder='Type here...'></textarea>
                    </div>                                                                                                                             
                </>
                )                
            }                                                        
        </>);
};

export default WindowTreatment;
