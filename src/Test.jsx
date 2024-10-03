import React, { useEffect, useState } from 'react';
import { format, addDays, subDays, isFuture, startOfWeek } from 'date-fns';
import { CiCirclePlus } from 'react-icons/ci';
import { TiDeleteOutline } from 'react-icons/ti';
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr';
import axios from 'axios';
import toast from 'react-hot-toast';
import { backendServer } from './utils/info';

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');

export const getDaysRange = (currentDate, numberOfDays = 15) => {
    const daysRange = [];
    for (let i = 0; i < numberOfDays; i++) {
        daysRange.push(addDays(currentDate, i));
    }
    return daysRange;
};

const Test = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [projectData, setProjectData] = useState([]);
    const [hours, setHours] = useState([{ projectCode: '', projectName: '', hours: {} }]); // Single row initially
    const [timeData, setTimeData] = useState(null); // Store fetched time data
    const [changesMade, setChangesMade] = useState(false); // Track changes to show Save button

    // Fetch project data from backend
    const fetchProjectData = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/sales`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProjectData(response.data.salesData); // Assume projects array is in response
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch user's time data from backend
    const fetchTimeData = async () => {
        try {
            const response = await axios.get(`${backendServer}/api/times/${userId}`);
            setTimeData(response.data.timeData); // Set the time data
            populateTimeData(response.data.timeData); // Populate the calendar
        } catch (error) {
            console.error('Error fetching time data:', error);
        }
    };

    useEffect(() => {
        fetchProjectData();
        fetchTimeData(); // Fetch the time data when the component loads
    }, []);

    const populateTimeData = (data) => {
        if (!data || !data.time) return;

        // Populate the hours state with the fetched data
        const fetchedHours = data.time.map((entry) => {
            const projectHours = {};

            entry.projects.forEach((project) => {
                projectHours[entry.date] = project.hours;
            });

            return {
                projectCode: entry.projects[0].projectCode,
                projectName: projectData.find((p) => p.code === entry.projects[0].projectCode)?.name,
                hours: projectHours,
            };
        });

        setHours(fetchedHours);
    };

    const today = new Date();
    const daysRange = getDaysRange(currentDate, 15);

    // Handle changing work hours for each project on each date
    const handleHourChange = (rowIndex, day, value) => {
        const updatedHours = [...hours];
        updatedHours[rowIndex].hours[day] = value;
        setHours(updatedHours);
        setChangesMade(true); // Set changesMade to true to show Save button
    };

    // Handle selecting a project from the dropdown
    const handleSelectProject = (rowIndex, projectId) => {
        const selectedProject = projectData.find((project) => project._id === projectId);

        // Check if project is already selected
        if (hours.some((row) => row.projectCode === selectedProject.code)) {
            toast.error('Project already selected!');
            return;
        }

        const updatedHours = [...hours];
        updatedHours[rowIndex] = { projectCode: selectedProject.code, projectName: selectedProject.name, hours: {} };
        setHours(updatedHours);
        setChangesMade(true); // Set changesMade to true to show Save button
    };

    // Add a new project row with a limit of 4
    const handleAddProject = () => {
        if (hours.length >= 4) {
            toast.error('You can only select up to 4 projects.');
            return;
        }
        setHours([...hours, { projectCode: '', projectName: '', hours: {} }]);
    };

    // Handle removing a project
    const handleRemoveProject = (rowIndex) => {
        const updatedHours = [...hours];
        updatedHours.splice(rowIndex, 1); // Remove the selected row
        setHours(updatedHours);
        setChangesMade(true); // Set changesMade to true to show Save button
    };

    // Move to the next or previous 15-day range
    const nextDays = () => setCurrentDate(addDays(currentDate, 15));
    const previousDays = () => setCurrentDate(subDays(currentDate, 15));
    const handleToday = () => setCurrentDate(new Date());
    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const weekStartDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
        setCurrentDate(weekStartDate);
    };

    // Calculate total hours per row
    const calculateTotalHours = (row) => {
        return Object.values(row.hours).reduce((total, value) => total + (parseFloat(value) || 0), 0);
    };

    // Calculate total hours per column (per day)
    const calculateDailyTotal = (day) => {
        return hours.reduce((total, row) => total + (parseFloat(row.hours[day]) || 0), 0);
    };

    const createData = async () => {
        const data = daysRange.map((day) => ({
            date: format(day, 'yyyy-MM-dd'),
            projects: hours.map((row) => ({
                projectCode: row.projectCode,
                hours: Number(row.hours[day]) || 0,
            })),
        }));
    
        return data.filter(item => item.projects.some(d => d.hours !== 0));
    };    

    // Save the updated hours to the backend
    const handleSave = async () => {
        const timeEntries = await createData();

        try {
            await axios.put(`${backendServer}/api/times/${userId}`, timeEntries);
            toast.success('Time data saved successfully!');
            setChangesMade(false); // Reset changesMade after successful save
        } catch (error) {
            toast.error(error.response.data.message);
            console.error('Error saving time data:', error);
        }

        console.log(timeEntries);
        
    };

    return (
        <div className="overflow-x-auto p-4">
            {/* Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <span className="text-lg font-bold text-center w-full">
                    {format(daysRange[0], 'MMM dd')} - {format(daysRange[14], 'MMM dd')}
                </span>
                <div className="flex items-center gap-2">
                    {/* Add Project Button */}
                    <button onClick={handleAddProject} className="bg-[#7F55DE] text-white rounded p-2.5 flex items-center">
                        <CiCirclePlus className="font-bold text-xl" />
                    </button>
                    {changesMade && (
                        <button onClick={handleSave} className="bg-[#7F55DE] text-white p-2 rounded">
                            Save
                        </button>
                    )}
                    <button onClick={handleToday} className="bg-[#7F55DE] text-white p-2 rounded">
                        Today
                    </button>
                    <input type="date" className="border p-2 text-[#7F55DE] rounded" onChange={handleDateChange} />
                    <button onClick={previousDays} className="bg-gray-300 text-[#7F55DE] p-2 rounded">
                        <GrLinkPrevious />
                    </button>
                    <button onClick={nextDays} className="bg-gray-300 text-[#7F55DE] p-2 rounded">
                        <GrLinkNext />
                    </button>
                </div>
            </div>

            {/* Table */}
            <table className="min-w-full table-auto border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border p-2">Project</th>
                        {daysRange.map((day, index) => (
                            <th key={index} className={`border p-2 text-center ${[0, 6].includes(day.getDay()) ? 'bg-gray-100' : ''}`}>
                                {format(day, 'EEE dd')}
                            </th>
                        ))}
                        <th className="border p-2 text-center">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {hours.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {/* Project Selection */}
                            <td className="border flex items-center justify-between p-2">
                                <select
                                    value={row.projectCode}
                                    onChange={(e) => handleSelectProject(rowIndex, e.target.value)}
                                    className=" border p-2"
                                >
                                    <option value="">Select Project</option>
                                    {projectData.map((project) => (
                                        <option key={project._id} value={project._id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => handleRemoveProject(rowIndex)} className="text-red-500">
                                    <TiDeleteOutline size={20} />
                                </button>
                            </td>

                            {/* Hours per day */}
                            {daysRange.map((day, index) => (
                                <td key={index} className="border p-2 text-center">
                                    {!isFuture(day) ? (
                                        <input
                                            type="number"
                                            value={row.hours[day] || ''}
                                            onChange={(e) => handleHourChange(rowIndex, day, e.target.value)}
                                            className="max-w-[3rem] border text-center"
                                            min="0"
                                        />
                                    ) : (
                                        <span>--</span> // Disable input for future dates
                                    )}
                                </td>
                            ))}

                            {/* Total Hours for the row */}
                            <td className="border p-2 text-center">{calculateTotalHours(row)}</td>
                        </tr>
                    ))}

                    {/* Total Hours row */}
                    <tr>
                        <td className="border p-2 font-bold text-center">Total</td>
                        {daysRange.map((day, index) => (
                            <td key={index} className="border p-2 text-center">
                                {calculateDailyTotal(day)}
                            </td>
                        ))}
                        <td className="border p-2 text-center">
                            {hours.reduce((total, row) => total + calculateTotalHours(row), 0)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Test;
