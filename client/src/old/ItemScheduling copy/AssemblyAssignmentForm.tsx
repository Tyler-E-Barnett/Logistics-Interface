import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { JobContext } from "../../context/JobContext";
import { localDateTime } from "../../modules/dateInfo";

function AssemblyAssignmentForm({ id, contextType }) {
  const { jobId, jobStart, jobEnd, facilityId, toggleUpdate } =
    useContext(JobContext)!;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [start, setStart] = useState(formatDate(jobStart));
  const [end, setEnd] = useState(formatDate(jobEnd));
  const [jobNumber, setJobNumber] = useState(jobId);
  const [location, setLocation] = useState(facilityId);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      fmRecordId: jobId,
      itemId: id,
      start,
      end,
      contextKey: jobNumber,
      contextType: contextType,
      locationId: location,
    };
    const apiUrl = "/api/inventory/assignment";

    try {
      const response = await axios.put(apiUrl, formData);
      alert("Submission successful!");
      toggleUpdate(); // Toggle update after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-4 text-xs bg-white rounded-lg shadow-lg w-[500px]"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Assignment Details
      </h2>
      <div className="flex items-center justify-center w-full gap-4">
        <div className="flex flex-col w-full">
          <label htmlFor="start" className="font-medium text-gray-600">
            Start:
          </label>
          <input
            type="datetime-local"
            id="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="end" className="font-medium text-gray-600">
            End:
          </label>
          <input
            type="datetime-local"
            id="end"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md"
            required
          />
        </div>
      </div>
      <div className="flex justify-center w-full gap-4">
        <div className="flex flex-col w-full">
          <label htmlFor="jobNumber" className="font-medium text-gray-600">
            Job Number:
          </label>
          <input
            type="text"
            id="jobNumber"
            value={jobNumber}
            onChange={(e) => setJobNumber(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md"
            required
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="location" className="font-medium text-gray-600">
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}

export default AssemblyAssignmentForm;
