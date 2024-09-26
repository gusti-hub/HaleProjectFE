import React, { useState } from 'react';

const Test = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
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

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    // Remove the selected file
    const removeFile = () => {
        setSelectedFile(null);
    };

    return (
        <div className="w-full max-w-md mx-auto text-center">
            <label
                className={`flex flex-col justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer ${
                    dragActive ? 'border-gray-700' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*" // Optional: restrict to image files only
                />
                <div className="text-gray-500">
                    <p className="mb-2 text-sm">
                        {selectedFile ? selectedFile.name : 'Drag & drop a file here, or'}
                    </p>
                    <span className="text-blue-500 cursor-pointer">browse</span>
                </div>
            </label>

            {selectedFile && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Selected file:</h4>
                    <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                        <span>{selectedFile.name}</span>
                        <button
                            onClick={removeFile}
                            className="text-white bg-red-500 hover:bg-red-600 p-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test;
