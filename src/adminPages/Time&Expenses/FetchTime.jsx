/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { backendServer } from "../../utils/info";
import dayjs from "dayjs";
import { GrLinkPrevious, GrLinkNext } from "react-icons/gr";
import CircularProgress from "@mui/material/CircularProgress";
import { MdEditDocument } from "react-icons/md";
import toast from "react-hot-toast";

const FetchTime = ({ id, status }) => {
	const token = localStorage.getItem("token");
	const userId = localStorage.getItem("usedId");

	const [timeData, setTimeData] = useState([]);
	const [projects, setProjects] = useState([]);
	const [startDate, setStartDate] = useState(dayjs().startOf("week")); // Start on the first day of the current week (Sunday)
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false); // Edit mode for both time data and comment
	const [comment, setComment] = useState(""); // Store the comment
	const workSchedule = 8; // Fixed work schedule for now

	const fetchTimeData = async () => {
		try {
			const response = await axios.get(
				`${backendServer}/api/fetch-times/${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(response.data);

			const timeEntries = response.data.timeData.time;
			const fetchedComment = response.data.timeData.comment || ""; // Fetch the comment
			console.log(fetchedComment);

			setTimeData(timeEntries);
			setComment(fetchedComment);

			const uniqueProjects = [];
			timeEntries.forEach((entry) => {
				entry.projects.forEach((project) => {
					if (
						!uniqueProjects.find((p) => p.projectCode === project.projectCode)
					) {
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

	const handleNextPage = () => {
		setStartDate(startDate.add(1, "week").startOf("week")); // Move to the next week
	};

	const handlePrevPage = () => {
		setStartDate(startDate.subtract(1, "week").startOf("week")); // Move to the previous week
	};

	const handleToday = () => {
		setStartDate(dayjs().startOf("week")); // Go to the current week
	};

	// Get the dates for the current week (Sunday to Saturday)
	const getDisplayedDates = () => {
		return Array.from({ length: 7 }, (_, i) => startDate.add(i, "day"));
	};

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

	const calculateTotalHours = (date) => {
		return projects.reduce((total, project) => {
			return total + getHoursForProjectOnDate(project.projectCode, date);
		}, 0);
	};

	const calculateOvertime = (totalHours) => {
		return totalHours > workSchedule ? totalHours - workSchedule : 0;
	};

	const [saveLoader, setSaveLoader] = useState(false);

	const handleUpdate = async () => {

		setSaveLoader(true);

		try {
			await axios.put(`${backendServer}/api/times/${id}`, {
				timeData,
				comment,
			});
			setEditMode(false);
			setSaveLoader(false);
			await fetchTimeData();
			toast.success("Data updated successfully");
		} catch (error) {
			console.log(error.message);
			toast.error("Failed to update data");
			setSaveLoader(false);
		}
	};

	const handleCancel = async () => {
		setEditMode(false);
		await fetchTimeData();
	}

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
		<div className="w-full flex flex-col items-center justify-center p-6 gap-4 mt-8">

			{
				status === 'Draft on Approval' && <div className={`w-full flex items-center ${editMode ? 'justify-end' : 'justify-start'}`}>
					{
						!editMode && <button onClick={() => setEditMode(true)}
							className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-800 py-1.5 px-5">
							<MdEditDocument className='text-xl' />
							<div className='text-nowrap'>Edit Time</div>
						</button>
					}
					{
						editMode && <div className="flex items-center justify-center gap-4">
							<button onClick={handleCancel}
								className={`bg-gray-200 hover:bg-gray-300 py-1.5 px-4 cursor-pointer'`}>Cancel</button>
							{
								saveLoader ? <div className="flex items-center justify-center px-6"><CircularProgress /></div>
									: <button disabled={loading || error} onClick={() => handleUpdate()}
										className={`bg-[#7F55DE] py-1.5 px-5 text-white ${loading || error ? 'cursor-not-allowed' : 'cursor-pointer'}`}>Update</button>
							}
						</div>
					}
				</div>
			}

			<div className="w-full flex items-center justify-end gap-4">
				{/* Navigation Controls */}
				<div className="flex gap-2">
					<button
						onClick={handlePrevPage}
						className="cursor-pointer text-[#7F55DE]"
					>
						<GrLinkPrevious />
					</button>
					<button
						onClick={handleToday}
						className="hover:bg-gray-100 text-[#7F55DE] rounded text-sm px-2.5 py-1.5 border border-solid border-[#7F55DE]"
					>
						Today
					</button>
					<button
						onClick={handleNextPage}
						className="cursor-pointer text-[#7F55DE]"
					>
						<GrLinkNext />
					</button>
				</div>
			</div>

			{/* Time Table */}
			<table className="table-auto border-collapse w-full text-sm">
				<thead>
					<tr>
						<th className="border px-4 py-2">Project Code</th>
						{getDisplayedDates().map((date) => (
							<th
								key={date}
								className={`border px-4 py-2 ${date.isSame(dayjs(), "day")
									? "text-[#7F55DE] font-semibold"
									: ""
									}`}
							>
								{date.format("ddd DD")}
							</th>
						))}
						<th className="border px-4 py-2">Total</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<tr key={project.projectCode}>
							<td className="border px-4 py-2">{project.projectCode}</td>
							{getDisplayedDates().map((date) => (
								<td key={date} className="border px-4 py-2">
									{editMode ? (
										<input
											type="number"
											value={getHoursForProjectOnDate(project.projectCode, date) || 0} // Ensure a value of 0 if no data
											className="w-12 text-center"
											onChange={(e) => {
												const updatedHours = Number(e.target.value);

												setTimeData((prevData) => {
													// Check if there is an entry for the current date
													const existingEntry = prevData.find((entry) =>
														dayjs(entry.date).isSame(date, "day")
													);

													if (existingEntry) {
														// If an entry exists for this date, update the hours for the specific project
														return prevData.map((entry) =>
															dayjs(entry.date).isSame(date, "day")
																? {
																	...entry,
																	projects: entry.projects.map((p) =>
																		p.projectCode === project.projectCode
																			? { ...p, hours: updatedHours }
																			: p
																	),
																}
																: entry
														);
													} else {
														// If no entry exists for this date, create a new one
														return [
															...prevData,
															{
																date: date.toISOString(), // New entry for this date
																projects: projects.map((p) =>
																	p.projectCode === project.projectCode
																		? { ...p, hours: updatedHours } // Update hours for the current project
																		: { ...p, hours: 0 } // Set hours to 0 for other projects on this date
																),
															},
														];
													}
												});
											}}
										/>
									) : (
										getHoursForProjectOnDate(project.projectCode, date) || 0
									)}

								</td>
							))}
							<td className="border px-4 py-2">
								{getDisplayedDates().reduce(
									(total, date) =>
										total + getHoursForProjectOnDate(project.projectCode, date),
									0
								)}
							</td>
						</tr>
					))}

					{/* Total Hours Row */}
					<tr>
						<td className="border px-4 py-2 font-bold text-nowrap">
							Total Hours
						</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className="border px-4 py-2 bg-gray-100">
								{calculateTotalHours(date)}
							</td>
						))}
						<td className="border px-4 py-2 bg-gray-100">
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
							<td key={date} className="border px-4 py-2">
								{workSchedule}
							</td>
						))}
						<td className="border px-4 py-2">
							{workSchedule * getDisplayedDates().length}
						</td>
					</tr>

					{/* Overtime Row */}
					<tr>
						<td className="border px-4 py-2 font-bold">Daily Overtime</td>
						{getDisplayedDates().map((date) => (
							<td key={date} className="border px-4 py-2">
								{calculateOvertime(calculateTotalHours(date))}
							</td>
						))}
						<td className="border px-4 py-2">
							{getDisplayedDates().reduce(
								(total, date) =>
									total + calculateOvertime(calculateTotalHours(date)),
								0
							)}
						</td>
					</tr>
				</tbody>
			</table>

			{/* Comment Section */}
			<div className="w-full mt-6 flex flex-col items-start gap-2">
				<h2 className="font-bold text-lg">Comment</h2>
				{editMode ? (
					<textarea
						className="w-full p-2 border rounded-md border-solid border-gray-400"
						rows={3}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Type here..."
					/>
				) : comment ? (
					<p>{comment}</p>
				) : (
					<p className="text-sm">No Comment Available</p>
				)}
			</div>
		</div>
	);
};

export default FetchTime;
