import React from 'react';
import * as XLSX from 'xlsx';

const Test = () => {
    const tableData = [
        { id: 1, name: 'John Doe', age: 28 },
        { id: 2, name: 'Jane Smith', age: 34 },
        // Add more rows as needed
    ];

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, 'table_data.xlsx');
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleDownload}>Download as Excel</button>
        </div>
    );
};

export default Test;
