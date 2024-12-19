import { useState } from "react";
import axios from "axios";

function AssignmentForm({ id, contextType }) {
  // Helper function to format date for datetime-local input
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM' format
  };

  // State initialization using formatted dates
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [location, setLocation] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the data object from state
    const formData = {
      fmRecordId: id,
      itemId: id,
      start,
      end,
      contextKey: jobNumber,
      contextType: contextType,
      locationId: location,
    };

    // Define the URL where the PUT request will be sent
    const apiUrl = "/api/inventory/assignment"; // Replace with your actual API URL

    try {
      // Sending a PUT request with Axios
      const response = await axios.put(apiUrl, formData);
      console.log("Success:", response.data);
      alert("Submission successful!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center h-10 gap-1 p-1 bg-secondary"
    >
      <div className="mb-2">
        <label
          htmlFor="start"
          className="block mb-1 text-xs font-medium text-gray-900"
        >
          Start Time
        </label>
        <input
          type="datetime-local"
          id="start"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="end"
          className="block mb-1 text-xs font-medium text-gray-900"
        >
          End Time
        </label>
        <input
          type="datetime-local"
          id="end"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="jobNumber"
          className="block mb-1 text-xs font-medium text-gray-900"
        >
          Job Number
        </label>
        <input
          type="text"
          id="jobNumber"
          value={jobNumber}
          onChange={(e) => setJobNumber(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
          required
        />
      </div>
      <div className="mb-2">
        <label
          htmlFor="location"
          className="block mb-1 text-xs font-medium text-gray-900"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
          required
        />
      </div>
      <button
        type="submit"
        className="h-8 p-2 mt-2 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
      >
        Assign
      </button>
    </form>
  );
}

export default AssignmentForm;
