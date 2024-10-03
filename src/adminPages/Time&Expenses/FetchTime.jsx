import axios from "axios";
import { useEffect, useState } from "react";
import { backendServer } from "../../utils/info";
import dayjs from "dayjs";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import CircularProgress from "@mui/material/CircularProgress";

// FetchTime component
const FetchTime = ({ id }) => {
	const token = localStorage.getItem("token");
	const [timeData, setTimeData] = useState([]);
	const [projects, setProjects] = useState([]);
	const [startDate, setStartDate] = useState(dayjs().startOf("month")); // Start at the 1st of the current month
	const [page, setPage] = useState(0); // 0 for the first half (1-15), 1 for the second half (16-end)
	const [workSchedule, setWorkSchedule] = useState(8);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Helper function to get the total number of days in a given month
	const getTotalDaysInMonth = (date) => {
		return date.daysInMonth();
	};

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
			setError(error.response?.data?.message || "Error fetching data");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTimeData();
	}, [startDate]);

	// Generate the 15-day window based on the startDate and page
	const getDisplayedDates = () => {
		const totalDaysInMonth = getTotalDaysInMonth(startDate);

		if (page === 0) {
			// First page shows 1st to 15th
			return Array.from({ length: 15 }, (_, i) => startDate.add(i, "day"));
		} else {
			// Second page shows 16th to end of the month
			const daysInSecondHalf = totalDaysInMonth - 15;
			return Array.from({ length: daysInSecondHalf }, (_, i) =>
				startDate.add(15 + i, "day")
			);
		}
	};

	// Function to move to the next 15-day window (next month if needed)
	const handleNextPage = () => {
		if (page === 0) {
			setPage(1); // Move to the second half of the current month
		} else {
			// Move to the first half of the next month
			setStartDate(startDate.add(1, "month").startOf("month"));
			setPage(0);
		}
	};

	// Function to move to the previous 15-day window (previous month if needed)
	const handlePrevPage = () => {
		if (page === 1) {
			setPage(0); // Move to the first half of the current month
		} else {
			// Move to the second half of the previous month
			const prevMonth = startDate.subtract(1, "month").startOf("month");
			setStartDate(prevMonth);
			setPage(1);
		}
	};

	// Function to reset the calendar to the current month (1st–15th or 16th–end based on today's date)
	const handleToday = () => {
		const today = dayjs();
		const startOfMonth = today.startOf("month");

		if (today.date() >= 16) {
			// Show 16th to the end of the current month
			setStartDate(startOfMonth);
			setPage(1);
		} else {
			// Show 1st to 15th of the current month
			setStartDate(startOfMonth);
			setPage(0);
		}
	};

	// Function to get hours for a specific project on a specific date
	const getHoursForProjectOnDate = (projectCode, date) => {
		const projectEntry = timeData.find((entry) => {
			const entryDate = dayjs(entry.date).startOf("day");
			return entryDate.isSame(date, "day");
		});

		if (projectEntry) {
			const project = projectEntry.projects.find(
				(p) => p.projectCode === projectCode
			);
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

	if (loading) {
		return (
			<div className="w-full flex items-center justify-center mt-24">
				<CircularProgress />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full flex items-center justify-center text-red-600 font-medium mt-24">
				Error: {error}
			</div>
		);
	}

	return (
		<div className="w-full flex flex-col items-center justify-center p-6 gap-6">

			{/* Navigation Controls */}
			<div className="w-full flex items-center justify-between">
				{/* Legend for Color Coding */}
				<div className="flex gap-4 items-center">
					<div className="flex items-center">
						<div className="w-8 h-4 bg-red-600 mr-2 rounded-sm"></div>
						<span className="text-sm">Sunday</span>
					</div>
					<div className="flex items-center">
						<div className="w-8 h-4 bg-orange-600 mr-2 rounded-sm"></div>
						<span className="text-sm">Saturday</span>
					</div>
					<div className="flex items-center">
						<div className="w-8 h-4 bg-[#7F55DE] mr-2 rounded-sm"></div>
						<span className="text-sm">Today</span>
					</div>
				</div>

				{/* Month and Year Display */}
				<div className="text-lg font-semibold text-center mr-36">
					{startDate.format("MMMM YYYY")}
				</div>

				{/* Navigation Controls */}
				<div className="flex gap-2">
					<button onClick={handlePrevPage} className="cursor-pointer text-[#7F55DE]">
						<GrLinkPrevious />
					</button>
					<button
						onClick={handleToday}
						className="hover:bg-gray-100 text-[#7F55DE] rounded text-sm px-2.5 py-1.5 border border-solid border-[#7F55DE]"
					>
						Today
					</button>
					<button onClick={handleNextPage} className="cursor-pointer text-[#7F55DE]">
						<GrLinkNext />
					</button>
				</div>
			</div>


			{/* Display Month and Year */}

			{/* Table */}
			<table className="table-auto border-collapse w-full text-sm">
				<thead>
					<tr>
						<th className="border px-4 py-2">Project Code</th>
						{getDisplayedDates().map((date) => {
							const dayOfWeek = date.day();
							return (
								<th
									key={date}
									className={`border px-4 py-2 ${date.isSame(dayjs(), "day") ? "text-[#7F55DE] font-semibold" : ""
										} ${dayOfWeek === 0
											? "text-red-600" // Sunday
											: dayOfWeek === 6
												? "text-orange-600" // Saturday
												: ""
										}`}
								>
									{date.format("DD ddd")}
								</th>
							);
						})}
						<th className="border px-4 py-2">Total</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.projectCode}>
							<td className="border px-4 py-2 text-nowrap">{project.projectCode}</td>
							{getDisplayedDates().map((date) => {
								const dayOfWeek = date.day();
								return (
									<td key={date} className={`border px-4 py-2  ${dayOfWeek === 0
										? "bg-gray-100" // Sunday
										: dayOfWeek === 6
											?  "bg-gray-100" // Saturday
											: ""
									}`}>
										{getHoursForProjectOnDate(project.projectCode, date)}
									</td>
								)
							})}
							<td className="border px-4 py-2">
								{getDisplayedDates().reduce(
									(total, date) => total + getHoursForProjectOnDate(project.projectCode, date),
									0
								)}
							</td>
						</tr>
					))}

					{/* Total Hours Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Total Hours</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className="border px-4 py-2 bg-gray-100">
								{calculateTotalHours(date)}
							</td>
						))}
						<td className="border px-4 py-2 font-bold">
							{getDisplayedDates().reduce(
								(total, date) => total + calculateTotalHours(date),
								0
							)}
						</td>
					</tr>

					{/* Work Schedule Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Work Schedule</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className="border px-4 py-2 bg-gray-100">
								{workSchedule}
							</td>
						))}
						<td className="border px-4 py-2 font-bold">{workSchedule * getDisplayedDates().length}</td>
					</tr>

					{/* Overtime Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Overtime</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className="border px-4 py-2 ">
								{calculateOvertime(calculateTotalHours(date))}
							</td>
						))}
						<td className="border px-4 py-2 font-bold ">
							{getDisplayedDates().reduce(
								(total, date) => total + calculateOvertime(calculateTotalHours(date)),
								0
							)}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default FetchTime;
