import React, { useState } from 'react';
import { AiOutlinePaperClip } from "react-icons/ai";
import { BsTrash3 } from "react-icons/bs";

const DragNDrop = ({ selectedFile, handleSetSelectedFile }) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        handleSetSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        handleSetSelectedFile(file);
    };

    const removeFile = () => {
        handleSetSelectedFile(null);
    };

    return (
        <div className="w-full max-w-sm text-center">
            <label
                className={`flex flex-col justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${dragActive ? 'border-gray-700 bg-gray-50' : 'border-[#7F55DE]'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden" accept="image/*"
                />
                <div className="text-gray-500 flex flex-col items-center justify-center gap-2">
                    <p className="text-sm">
                        {selectedFile ? selectedFile.name : 'Drag & drop a file here, or'}
                    </p>
                    <span className="text-blue-600 cursor-pointer">browse file</span>
                    <span className="text-xs text-black">(only image file accepted)</span>
                </div>
            </label>

            <div className="w-full flex items-center justify-start gap-2 mt-4">
                <AiOutlinePaperClip className='text-xl' />
                <div className="text-sm max-w-[20rem] text-left text-ellipsis overflow-hidden whitespace-nowrap">{selectedFile ? selectedFile.name : 'No file choosen'}</div>
                {selectedFile && <BsTrash3 onClick={removeFile} className='text-[15px] text-red-600 cursor-pointer ml-2' />}
            </div>

        </div>
    );
};

export default DragNDrop;
