import React, { useContext, useEffect, useState } from 'react';
import { format, addDays, subDays, isFuture, startOfWeek } from 'date-fns';
import { CiCirclePlus } from 'react-icons/ci';
import { TiDeleteOutline } from 'react-icons/ti';
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr';
import axios from 'axios';
import { backendServer } from '../../utils/info';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/CommonContext';

const userId = localStorage.getItem('userId');

export const getDaysRange = (currentDate, numberOfDays = 15) => {
  const daysRange = [];

  for (let i = 0; i < numberOfDays; i++) {
    daysRange.push(addDays(currentDate, i));
  }

  return daysRange;
};

const projectsList = [
  'Project 1',
  'Project 2',
  'Project 3',
  'Project 4',
  'Project 5',
  'Project 6',
];

const TimeCalender = () => {

  const navigate = useNavigate();

  const { handleMenuID } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [saveLoader, setSaveLoader] = useState(false);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [hours, setHours] = useState(
    Array(4).fill({ name: '', hours: {} }) // Initializing 4 rows for projects
  );

  const today = new Date();

  // Get the current 15-day range
  const daysRange = getDaysRange(currentDate, 15);

  // Handle changing work hours for each project on each date
  const handleHourChange = (rowIndex, day, value) => {
    const updatedHours = [...hours];
    updatedHours[rowIndex].hours[day] = value;
    setHours(updatedHours);
  };

  // Handle selecting a project from the dropdown
  const handleSelectProject = (rowIndex, projectName) => {
    const updatedHours = [...hours];
    updatedHours[rowIndex] = { name: projectName, hours: {} };
    setHours(updatedHours);
  };

  // Handle removing a project
  const handleRemoveProject = (rowIndex) => {
    const updatedHours = [...hours];
    updatedHours[rowIndex] = { name: '', hours: {} };
    setHours(updatedHours);
  };

  // Move to the next or previous 15-day range
  const nextDays = () => setCurrentDate(addDays(currentDate, 15));
  const previousDays = () => setCurrentDate(subDays(currentDate, 15));

  // Handle setting currentDate to today
  const handleToday = () => setCurrentDate(new Date());

  // Handle selecting a week starting with a specific date from the calendar
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

  const handleCancel = () => {
    navigate('/admin-panel');
    handleMenuID(10);
  }

  return (
    <div className="overflow-x-auto p-4 text-sm w-full flx flex-col items-center justify-start">

      <div className="w-full flex items-center justify-between px-4 pb-4 mb-6" style={{ boxShadow: "0px 6px 4px -3px rgba(201,195,201,1)" }}>
        <div className="text-gray-900 text-2xl font-medium">Time</div>
        <div className="flex items-center justify-center gap-4 text-base">
          <button onClick={handleCancel}
            className={`bg-gray-200 hover:bg-gray-300 py-1.5 px-4 cursor-pointer'`}>Cancel</button>
          {
            saveLoader ? <div className="flex items-center justify-center px-4"><CircularProgress /></div> :
              <button disabled={loading || error}
                className={`bg-[#7F55DE] py-1.5 px-5 text-white ${loading || error ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Save</button>
          }
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-base font-bold text-center w-full">
          {format(daysRange[0], 'MMM dd')} - {format(daysRange[14], 'MMM dd')}
        </span>
        <div className="flex items-center gap-2">
          {/* Calendar and Today Button */}
          <input type="date" className="p-1.5 rounded border border-solid border-gray-300" onChange={handleDateChange} />
          <button onClick={handleToday} className="bg-[#7F55DE] text-white p-2 rounded">
            Today
          </button>
          <button onClick={previousDays} className="bg-gray-300 text-[#7F55DE] p-2 rounded">
            <GrLinkPrevious />
          </button>
          <button onClick={nextDays} className="bg-gray-300 text-[#7F55DE] p-2 rounded">
            <GrLinkNext />
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2 text-sm">Project</th>
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
              <td className="border p-2 min-w-48">
                {!row.name && (
                  <select className="py-1.5 px-4 border rounded text-sm" onChange={(e) => handleSelectProject(rowIndex, e.target.value)}>
                    <option value="">Select Project</option>
                    {projectsList.map((project, index) => (
                      <option key={index} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                )}
                {row.name && (
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-full">{row.name}</span>
                    <button onClick={() => handleRemoveProject(rowIndex)} className="text-red-600 hover:text-red-800 right-0">
                      <TiDeleteOutline className="text-xl" />
                    </button>
                  </div>
                )}
              </td>
              {daysRange.map((day, dayIndex) => (
                <td key={dayIndex} className={`border p-2 ${[0, 6].includes(day.getDay()) ? 'bg-gray-100' : ''}`}>
                  <input
                    type="number"
                    className={`w-full p-1 border-none focus:outline-none rounded ${[0, 6].includes(day.getDay()) ? 'bg-gray-100' : 'bg-white'}`}
                    value={row.hours[day] || ''}
                    min={0}
                    onChange={(e) => handleHourChange(rowIndex, day, e.target.value)}
                    disabled={!row.name || isFuture(day)} // Disable input if no project is selected or the date is in the future
                  />
                </td>
              ))}
              <td className="border p-2 text-center">{calculateTotalHours(row)}</td>
            </tr>
          ))}

          {/* Total Hours Row */}
          <tr>
            <td className="border p-2 font-bold">Total Hours</td>
            {daysRange.map((day, dayIndex) => (
              <td key={dayIndex} className="border p-2 text-center font-bold">
                {calculateDailyTotal(day)}
              </td>
            ))}
            <td className="border p-2 text-center font-bold">
              {/* Total for the "Total Hours" row */}
              {hours.reduce((sum, row) => sum + calculateTotalHours(row), 0)}
            </td>
          </tr>

          {/* Work Schedule Row */}
          <tr>
            <td className="border p-2 font-bold">Work Schedule</td>
            {daysRange.map((_, index) => (
              <td key={index} className="border p-2 text-center">
                {/* Placeholder for work schedule */}
              </td>
            ))}
            <td className="border p-2 text-center"></td>
          </tr>

          {/* Daily Overtime Row */}
          <tr>
            <td className="border p-2 font-bold">Daily Overtime</td>
            {daysRange.map((_, index) => (
              <td key={index} className="border p-2 text-center">
                {/* Placeholder for daily overtime */}
              </td>
            ))}
            <td className="border p-2 text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TimeCalender;
