import React, { useContext, useEffect, useState } from 'react';

const Wallpaper = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_color">Color:</label>
                    <input value={formData.wallpaper_color} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='wallpaper_color' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>   
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_unit">Size Unit:</label>
                    <select
                        value={formData.wallpaper_unit}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="wallpaper_unit">
                        <option value="" disabled>Select an option</option>
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                    </select>
                </div>
                <div className="w-full flex items-center justify-start gap-2">
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wallpaper_width">Width:</label>
                        <input value={formData.wallpaper_width} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wallpaper_width' placeholder='Width' maxLength="5" />
                    </div>                  
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2">                   
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wallpaper_horizontal">Horizontal Repeat:</label>
                        <input value={formData.wallpaper_horizontal} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wallpaper_horizontal' placeholder='Horizontal' maxLength="5" />
                    </div>
                    <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                        <label htmlFor="wallpaper_vertical">Vertical Repeat:</label>
                        <input value={formData.wallpaper_vertical} onChange={handleInputChange}
                            className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                            type="number" name='wallpaper_vertical' placeholder='vertical' maxLength="5" />
                    </div>
                </div>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_content">Content:</label>
                    <input value={formData.wallpaper_content} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='wallpaper_content' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_type">Type:</label>
                    <input value={formData.wallpaper_type} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='wallpaper_type' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_weight">Weight:</label>
                    <input value={formData.wallpaper_weight} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='wallpaper_weight' placeholder='Type here...' maxLength="20" />
                </div> 
            </div>                        
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_backing">Backing:</label>
                    <input value={formData.wallpaper_backing} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='wallpaper_backing' placeholder='Type here...' maxLength="50" />
                </div> 
            </div> 
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="wallpaper_installation">Installation:</label>
                    <input value={formData.wallpaper_installation} onChange={handleInputChange}
                    className='w-full outline-none border-b border-solid border-b-black p-[2px]'
                    type="text" name='wallpaper_installation' placeholder='Type here...' maxLength="50" />
                </div> 
            </div>                                                  
        </>);
};

export default Wallpaper;
