import axios from "axios";
import { useEffect, useState } from "react";
import { backendServer } from "../../utils/info";
import dayjs from "dayjs";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";

const FetchTime = () => {
	const userId = localStorage.getItem("userId");
	const [timeData, setTimeData] = useState([]);
	const [projects, setProjects] = useState([]);
	const [startDate, setStartDate] = useState(dayjs().startOf("day")); // Start with today's date
	const [page, setPage] = useState(0); // Page index for navigation (each page shows 15 days)
	const daysPerPage = 15;

	const id = "66fa5a7b7950830dc4874c8c";

	// Fetch the time data from the backend
	const fetchTimeData = async () => {
		try {
			const response = await axios.get(`${backendServer}/api/fetch-times/${id}`);
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
		} catch (error) {
			console.log(error.message);
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

	return (
		<div className="p-4">
			<h2>Work Hours Calendar</h2>
			<div className="flex items-center justify-end gap-2 py-2">
				<input
					type="date"
					onChange={handleCalendarSelect}
					className="border p-1 rounded text-[#7F55DE]"
				/>
				<button onClick={handlePrevPage} className="p-2 bg-gray-200 rounded text-[#7F55DE]">
					<GrLinkPrevious />
				</button>
				<button onClick={handleToday} className="p-2 bg-gray-200 text-[#7F55DE] text-sm rounded">
					Today
				</button>
				<button onClick={handleNextPage} className="p-2 bg-gray-200 rounded text-[#7F55DE]">
					<GrLinkNext />
				</button>
			</div>

			<table className="table-auto border-collapse w-full">
				<thead>
					<tr>
						<th className="border px-4 py-2">Project Code</th>
						{getDisplayedDates().map((date) => (
							<th key={date} className="border px-4 py-2">
								{date.format("MMM DD, YYYY")}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.projectCode}>
							<td className="border px-4 py-2">{project.projectCode}</td>
							{getDisplayedDates().map((date) => (
								<td key={date} className="border px-4 py-2">
									{getHoursForProjectOnDate(project.projectCode, date)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default FetchTime;
