import React, { useContext, useEffect, useState } from 'react';

const DecorativeLighting = ({formData, handleInputChange}) => {
    return (
        <>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_unit">Size Unit:</label>
                    <select
                        value={formData.decorative_lighting_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="decorative_lighting_unit">
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
                        <label htmlFor="decorative_lighting_len_overall">L:</label>
                        <input value={formData.decorative_lighting_len_overall} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_len_overall' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_wid_overall">W:</label>
                        <input value={formData.decorative_lighting_wid_overall} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_wid_overall' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_height_overall">H:</label>
                        <input value={formData.decorative_lighting_height_overall} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_height_overall' placeholder='Height' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 font-semibold">
                <label>Fixture Size:</label>
            </div>    
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_len_fixture">L:</label>
                        <input value={formData.decorative_lighting_len_fixture} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_len_fixture' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_wid_fixture">W:</label>
                        <input value={formData.decorative_lighting_wid_fixture} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_wid_fixture' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_height_fixture">H:</label>
                        <input value={formData.decorative_lighting_height_fixture} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_height_fixture' placeholder='Height' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2 font-semibold">
                <label>Shade Size:</label>
            </div>    
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_len_shade">L:</label>
                        <input value={formData.decorative_lighting_len_shade} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_len_shade' placeholder='Length' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_wid_shade">W:</label>
                        <input value={formData.decorative_lighting_wid_shade} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_wid_shade' placeholder='Width' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="decorative_lighting_height_shade">H:</label>
                        <input value={formData.decorative_lighting_height_shade} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_height_shade' placeholder='Length' maxLength="5" />
                    </div>                    
                </div>
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_color">Color:</label>
                    <input value={formData.decorative_lighting_color} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_color' placeholder='Type here...' maxLength="50" />
                </div>     
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_finish">Finish:</label>
                    <input value={formData.decorative_lighting_finish} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_finish' placeholder='Type here...' maxLength="50" />
                </div>     
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_base_material">Base Material:</label>
                    <input value={formData.decorative_lighting_base_material} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_base_material' placeholder='Type here...' maxLength="50" />
                </div>     
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_shade_material">Shade Material:</label>
                    <input value={formData.decorative_lighting_shade_material} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_shade_material' placeholder='Type here...' maxLength="50" />
                </div>     
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_shade_type">Shade Type:</label>
                    <input value={formData.decorative_lighting_shade_type} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_shade_type' placeholder='Type here...' maxLength="50" />
                </div>     
            </div>         
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_switch_type">Switch Type:</label>
                    <select
                        value={formData.decorative_lighting_switch_type}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="decorative_lighting_switch_type">
                        <option value="" disabled>Select an option</option>
                        <option value="3-Way">3-Way</option>
                        <option value="On/Off Switch">On/Off Switch</option>
			            <option value="Dimmer">Dimmer</option>
                    </select>
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_quantity">Socket Quantity:</label>
                   <input value={formData.decorative_lighting_quantity} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='decorative_lighting_quantity' placeholder='Length' maxLength="3" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_socket_type">Socket Type:</label>
                    <input value={formData.decorative_lighting_socket_type} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_socket_type' placeholder='Type here...' maxLength="50" />
                </div>     
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_dimmable">Dimmable:</label>
                    <select
                        value={formData.decorative_lighting_dimmable}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="decorative_lighting_dimmable">
                        <option value="" disabled>Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div> 
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_switch">Switch:</label>
                    <input value={formData.decorative_lighting_switch} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_switch' placeholder='Type here...' maxLength="50" />
                </div>     
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_wattaga">Shade Type:</label>
                    <input value={formData.decorative_lighting_wattaga} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_wattaga' placeholder='Type here...' maxLength="10" />
                </div>     
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_temperature">Temperature:</label>
                    <input value={formData.decorative_lighting_temperature} onChange={handleInputChange}
                        className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                        type="text" name='decorative_lighting_temperature' placeholder='Type here...' maxLength="50" />
                </div>     
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="decorative_lighting_rating">Rating:</label>
                    <select
                        value={formData.decorative_lighting_rating}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="decorative_lighting_rating">
                        <option value="" disabled>Select an option</option>
                        <option value="Indoor Only">Indoor Only</option>
                        <option value="Damp Rated">Damp Rated</option>
			            <option value="Wet Rated">Wet Rated</option>
                    </select>
                </div> 
            </div>                                                                                                                                                                                                                                          
        </>
    );
}

export default DecorativeLighting;
