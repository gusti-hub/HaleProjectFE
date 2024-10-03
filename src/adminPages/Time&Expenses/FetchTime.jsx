import axios from "axios";
import { useEffect, useState } from "react";
import { backendServer } from "../../utils/info";
import dayjs from "dayjs";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import CircularProgress from '@mui/material/CircularProgress';

const FetchTime = ({ id }) => {
	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem('token');

	const [timeData, setTimeData] = useState([]);
	const [projects, setProjects] = useState([]);
	const [startDate, setStartDate] = useState(dayjs().startOf("day")); // Start with today's date
	const [page, setPage] = useState(0); // Page index for navigation (each page shows 15 days)
	const daysPerPage = 15;
	const [workSchedule, setWorkSchedule] = useState(8);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch the time data from the backend
	const fetchTimeData = async () => {
		try {
			const response = await axios.get(`${backendServer}/api/fetch-times/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const timeEntries = response.data.timeData.time;
			setTimeData(timeEntries);

			// Extract unique project codes
			const uniqueProjects = [];
			timeEntries.forEach((entry) => {
				entry.projects.forEach((project) => {
					if (!uniqueProjects.find((p) => p.projectCode === project.projectCode)) {
						uniqueProjects.push(project);
					}
				});
			});
			setProjects(uniqueProjects);
			setLoading(false);
		} catch (error) {
			console.log(error.message);
			setError(error.response.data.message);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTimeData();
	}, []);

	// Generate the 15-day window based on the startDate and page
	const getDisplayedDates = () => {
		const startDay = startDate.add(page * daysPerPage, "day");
		return Array.from({ length: daysPerPage }, (_, i) => startDay.add(i, "day"));
	};

	// Function to get hours for a specific project on a specific date
	const getHoursForProjectOnDate = (projectCode, date) => {
		const projectEntry = timeData.find((entry) => {
			const entryDate = dayjs(entry.date).startOf("day");
			return entryDate.isSame(date, "day");
		});

		if (projectEntry) {
			const project = projectEntry.projects.find((p) => p.projectCode === projectCode);
			return project ? project.hours : 0;
		}
		return 0;
	};

	// Calculate total hours for a specific day
	const calculateTotalHours = (date) => {
		return projects.reduce((total, project) => {
			return total + getHoursForProjectOnDate(project.projectCode, date);
		}, 0);
	};

	// Calculate overtime for a specific day
	const calculateOvertime = (totalHours) => {
		return totalHours > workSchedule ? totalHours - workSchedule : 0;
	};

	// Function to move to the next 15-day window
	const handleNextPage = () => {
		setPage((prev) => prev + 1);
	};

	// Function to move to the previous 15-day window
	const handlePrevPage = () => {
		setPage((prev) => prev - 1);
	};

	// Function to reset the calendar to today
	const handleToday = () => {
		setStartDate(dayjs().startOf("day"));
		setPage(0);
	};

	// Function to handle calendar date selection
	const handleCalendarSelect = (e) => {
		const selectedDate = dayjs(e.target.value).startOf("day");
		setStartDate(selectedDate);
		setPage(0); // Reset page navigation when a specific date is selected
	};

	if (loading) {
		return (
			<div className='w-full flex items-center justify-center mt-24'>
				<CircularProgress />
			</div>
		)
	}

	if (error) {
		return (
			<div className="w-full flex items-center justify-center text-red-600 font-medium mt-24">
				Error: {error}
			</div>
		)
	}

	return (
		<div className="w-full flex flex-col items-center justify-start p-6 gap-6">

			<div className="w-full flex items-center justify-end gap-3">
				<input
					type="date"
					onChange={handleCalendarSelect}
					className="p-0.5 rounded border border-solid text-center text-base border-gray-400 pr-2 mr-2"
				/>
				<button onClick={handlePrevPage} className="cursor-pointer text-[#7F55DE]">
					<GrLinkPrevious />
				</button>
				<button onClick={handleToday} className="hover:bg-gray-100 text-[#7F55DE] rounded text-sm px-2.5 py-1.5 border border-solid border-[#7F55DE]">
					Today
				</button>
				<button onClick={handleNextPage} className="cursor-pointer text-[#7F55DE]">
					<GrLinkNext />
				</button>
			</div>

			<table className="table-auto border-collapse w-full text-sm">
				<thead>
					<tr>
						<th className="border px-4 py-2">Project Code</th>
						{getDisplayedDates().map((date) => (
							<th key={date} className={`border px-4 py-2 ${date.day() === 0 ? 'text-red-600' : date.day() === 6 ? 'text-orange-600' : ''}`}>
								{date.format("MMM DD")}
							</th>
						))}
						<th className="border px-4 py-2">Total</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.projectCode}>
							<td className="border px-4 py-2 text-nowrap">{project.projectCode}</td>
							{getDisplayedDates().map((date) => (
								<td key={date} className={`border px-4 py-2 ${date.day() === 0 || date.day() === 6 ? 'bg-gray-100' : ''}`}>
									{getHoursForProjectOnDate(project.projectCode, date)}
								</td>
							))}
							<td className="border px-4 py-2">
								{getDisplayedDates().reduce((total, date) => total + getHoursForProjectOnDate(project.projectCode, date), 0)}
							</td>
						</tr>
					))}

					{/* Total Hours Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Total Hours</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className={`border px-4 py-2 ${date.day() === 0 || date.day() === 6 ? 'bg-gray-100' : ''}`}>
								{calculateTotalHours(date)}
							</td>
						))}
						<td className="border px-4 py-2 font-bold">
							{getDisplayedDates().reduce((total, date) => total + calculateTotalHours(date), 0)}
						</td>
					</tr>

					{/* Work Schedule Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Work Schedule</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className={`border px-4 py-2 ${date.day() === 0 || date.day() === 6 ? 'bg-gray-100' : ''}`}>
								{workSchedule}
							</td>
						))}
						<td className="border px-4 py-2 font-bold">-</td>
					</tr>

					{/* Daily Overtime Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Daily Overtime</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className={`border px-4 py-2 ${date.day() === 0 || date.day() === 6 ? 'bg-gray-100' : ''}`}>
								{calculateOvertime(calculateTotalHours(date))}
							</td>
						))}
						<td className="border px-4 py-2 font-bold">-</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default FetchTime;
