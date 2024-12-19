import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { JobContext } from "../../context/JobContext";
import { localDateTime } from "../../modules/dateInfo";

function AssemblyAssignmentForm({
  id,
  contextType,
  timeBlockData,
  showDeleteButton,
  closeForm,
}) {
  const { job, jobId, jobStart, jobEnd, facilityId, toggleUpdate } =
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

  // const facilityLookup = async (id) => {
  //   try {
  //     const response = await axios.get("/api/facilities/lookup", {
  //       params: {
  //         id: id,
  //       },
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // };

  const [start, setStart] = useState(
    timeBlockData ? formatDate(timeBlockData.start) : formatDate(jobStart)
  );
  const [end, setEnd] = useState(
    timeBlockData ? formatDate(timeBlockData.end) : formatDate(jobEnd)
  );
  const [jobNumber, setJobNumber] = useState(
    timeBlockData ? timeBlockData.contextKey : job.id
  );
  const [location, setLocation] = useState(
    timeBlockData ? timeBlockData.locationId : facilityId
  );

  // this can be avoided by populating the facility data on timeblock call
  // useEffect(() => {
  //   const fetchFacility = async () => {
  //     if (timeBlockData) {
  //       const facilityData = await facilityLookup(timeBlockData.locationId);
  //       if (facilityData) {
  //         setLocation(facilityData);
  //       }
  //     }
  //   };

  //   fetchFacility();
  // }, [timeBlockData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (new Date(end) <= new Date(start)) {
      alert("End time must be greater than the start time.");
      return;
    }

    const formData = {
      fmRecordId: jobId,
      itemId: timeBlockData ? timeBlockData.itemId : id,
      start: start,
      end: end,
      contextKey: jobNumber,
      contextType: contextType,
      locationId: location._id,
    };
    const apiUrl = "/api/inventory/assignment";

    console.log(formData);

    try {
      const response = await axios.put(apiUrl, formData);
      alert("Submission successful!");
      console.log("submission response", response.data);
      toggleUpdate();
      closeForm(); // Close the form after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/inventory/assignment/${id}`);
      //   alert("Time block deleted successfully!");
      toggleUpdate();
      closeForm(); // Close the form after deletion
    } catch (error) {
      console.error("Error deleting time block:", error);
      alert("Deletion failed!");
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
            Job Id:
          </label>
          <input
            type="text"
            id="jobNumber"
            value={jobNumber}
            onChange={(e) => setJobNumber(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md"
            disabled
          />
        </div>
        <div className="flex flex-col w-full">
          <label htmlFor="location" className="font-medium text-gray-600">
            Location:
          </label>
          <input
            type="text"
            id="location"
            value={location.facilityName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
            disabled
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
      >
        Submit
      </button>
      {showDeleteButton && (
        <button
          type="button"
          onClick={handleDelete}
          className="px-6 py-2 mt-2 text-white transition duration-200 bg-red-600 rounded hover:bg-red-700"
        >
          Delete
        </button>
      )}
      <div className=""></div>
    </form>
  );
}

export default AssemblyAssignmentForm;
