import React, { useContext, useEffect, useState } from 'react';

const Miscellaneous = ({formData, handleInputChange}) => {
  return (
        <>
            <div className="w-full flex items-center justify-center gap-4">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="miscellaneous_fabrication_style">Fabrication Style:</label>
                    <textarea value={formData.miscellaneous_fabrication_style} onChange={handleInputChange}
                    className='w-full outline-none border border-solid border-gray-500 p-1 rounded-md'
                    name="miscellaneous_fabrication_style" rows="2" maxLength="2500" placeholder='Type here...'></textarea>
                </div> 
            </div>  
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="miscellaneous_pattern">Pattern:</label>
                    <select
                        value={formData.miscellaneous_pattern}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="miscellaneous_pattern">
                        <option value="" disabled>Select an option</option>
                        <option value="Pattern Match">Pattern Match</option>
                        <option value="Pattern Match, Lines to Run Vertically">Pattern Match, Lines to Run Vertically</option>
                        <option value="Pattern Match, Lines to Run Horizontally">Pattern Match, Lines to Run Horizontally</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center justify-start gap-2">
                <div className="w-full flex items-center justify-start gap-2 text-black text-nowrap">
                    <label htmlFor="miscellaneous_insert">Insert:</label>
                    <select
                        value={formData.miscellaneous_insert}
                        onChange={handleInputChange}
                        className='p-1 outline-none' name="miscellaneous_insert">
                        <option value="" disabled>Select an option</option>
                        <option value="Interior Fill : 25/75 Duck Down">Interior Fill : 25/75 Duck Down</option>
                        <option value="Outdoor Fill : Angel Hair Fiber">Outdoor Fill : Angel Hair Fiber</option>
                    </select>
                </div>
            </div>                             
        </>);
};

export default Miscellaneous;
