const { Run } = require("../models/runModels");
const { JobItem, Job } = require("../models/jobModels");
const { TimeBlock } = require("../models/timeBlockModels");

const { getWorkWeekRange } = require("../modules/common");

const aggregateRunsOperationsJobs = async (req, res) => {
  const runNumber = req.params.run;
  try {
    const result = await Run.aggregate([
      // Match the specific run
      { $match: { runNumber: runNumber } },

      // Join operations related to the run
      {
        $lookup: {
          from: "operations",
          localField: "runNumber",
          foreignField: "runNumber",
          as: "operations",
        },
      },
      { $unwind: "$operations" },

      // Sort operations by arrival time
      { $sort: { "operations.arrival": 1 } },

      // Join jobs related to each operation
      {
        $lookup: {
          from: "jobs",
          localField: "operations.jobNumber",
          foreignField: "jobId",
          as: "operations.jobs",
        },
      },

      // Calculate job durations
      {
        $addFields: {
          "operations.jobs": {
            $map: {
              input: "$operations.jobs",
              as: "job",
              in: {
                $mergeObjects: [
                  "$$job",
                  {
                    durationHours: {
                      $cond: {
                        if: {
                          $and: ["$$job.start", "$$job.end"],
                        },
                        then: {
                          $divide: [
                            { $subtract: ["$$job.end", "$$job.start"] },
                            3600000, // milliseconds to hours
                          ],
                        },
                        else: null,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },

      // Calculate operation duration
      {
        $addFields: {
          "operations.durationHours": {
            $cond: {
              if: {
                $and: ["$operations.arrival", "$operations.departure"],
              },
              then: {
                $divide: [
                  {
                    $subtract: ["$operations.departure", "$operations.arrival"],
                  },
                  3600000, // Convert milliseconds to hours
                ],
              },
              else: null,
            },
          },
        },
      },

      // Group operations back together
      {
        $group: {
          _id: "$_id",
          runNumber: { $first: "$runNumber" },
          start: { $first: "$start" },
          end: { $first: "$end" },
          date: { $first: "$date" },
          crewType: { $first: "$crewType" },
          vehicles: { $first: "$vehicles" },
          operations: {
            $push: {
              arrival: "$operations.arrival",
              departure: "$operations.departure",
              operation: "$operations.operation",
              jobNumber: "$operations.jobNumber",
              jobs: "$operations.jobs",
              durationHours: "$operations.durationHours",
            },
          },
        },
      },

      // Collect all unique jobs from operations
      {
        $addFields: {
          allJobs: {
            $reduce: {
              input: "$operations.jobs",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },

      // Flatten allJobs array to contain unique jobs
      {
        $addFields: {
          allJobs: { $setUnion: ["$allJobs"] },
        },
      },

      // Calculate run duration
      {
        $addFields: {
          durationHours: {
            $cond: {
              if: { $and: ["$start", "$end"] },
              then: {
                $divide: [{ $subtract: ["$end", "$start"] }, 3600000],
              },
              else: null,
            },
          },
        },
      },

      // Final projection to structure the document
      {
        $project: {
          runNumber: 1,
          start: 1,
          end: 1,
          date: 1,
          crewType: 1,
          vehicles: 1,
          operations: 1,
          allJobs: 1,
          durationHours: 1,
        },
      },
    ]);

    res.status(200).send(result);
  } catch (error) {
    console.error("Error during aggregation: ", error);
    res.status(400).send(error);
  }
};

const aggregateRunstoJobstoOperations = async (req, res) => {
  const runNumber = req.params.run;
  try {
    const result = await Run.aggregate([
      // Match the specific run
      { $match: { runNumber: runNumber } },

      // Lookup operations related to the run
      {
        $lookup: {
          from: "operations",
          localField: "runNumber",
          foreignField: "runNumber",
          as: "operations",
        },
      },

      // Unwind operations to facilitate the job lookup and other calculations
      { $unwind: { path: "$operations", preserveNullAndEmptyArrays: true } },

      // Calculate duration for each operation
      {
        $addFields: {
          "operations.duration": {
            $cond: {
              if: { $and: ["$operations.arrival", "$operations.departure"] },
              then: {
                $divide: [
                  {
                    $subtract: ["$operations.departure", "$operations.arrival"],
                  },
                  3600000,
                ],
              }, // Convert milliseconds to hours
              else: null,
            },
          },
        },
      },

      // Lookup jobs related to each operation
      {
        $lookup: {
          from: "jobs",
          localField: "operations.jobNumber",
          foreignField: "jobId",
          as: "operations.jobs",
        },
      },

      // Unwind the jobs to facilitate further operations
      {
        $unwind: { path: "$operations.jobs", preserveNullAndEmptyArrays: true },
      },

      // Group operations by runId and jobId within each run
      {
        $group: {
          _id: { runId: "$_id", jobId: "$operations.jobs.jobId" },
          jobDetails: { $first: "$operations.jobs" },
          operations: { $push: "$operations" },
          jobDuration: {
            $first: {
              $cond: {
                if: {
                  $and: ["$operations.jobs.start", "$operations.jobs.end"],
                },
                then: {
                  $divide: [
                    {
                      $subtract: [
                        "$operations.jobs.end",
                        "$operations.jobs.start",
                      ],
                    },
                    3600000,
                  ],
                }, // Convert milliseconds to hours
                else: null,
              },
            },
          },
        },
      },

      // Collect all unique jobs under each run
      {
        $group: {
          _id: "$_id.runId",
          jobs: {
            $push: {
              jobId: "$_id.jobId",
              jobDetails: "$jobDetails",
              jobDuration: "$jobDuration",
              operations: "$operations",
            },
          },
        },
      },

      // Merge run details back into the top-level document
      {
        $lookup: {
          from: "runs",
          localField: "_id",
          foreignField: "_id",
          as: "runDetails",
        },
      },

      // Unwind the runDetails to avoid array format
      { $unwind: "$runDetails" },

      // Accumulate all operations across all jobs into a single array for easy access
      {
        $addFields: {
          allOperations: {
            $reduce: {
              input: "$jobs",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this.operations"] },
            },
          },
        },
      },

      // Sort all operations by arrival time
      {
        $unwind: "$allOperations",
      },
      {
        $sort: { "allOperations.arrival": 1 },
      },
      {
        $group: {
          _id: "$_id",
          runDetails: { $first: "$runDetails" },
          jobs: { $first: "$jobs" },
          allOperations: { $push: "$allOperations" },
        },
      },

      // Final projection to structure the document
      {
        $project: {
          _id: 0,
          runNumber: "$runDetails.runNumber",
          start: "$runDetails.start",
          end: "$runDetails.end",
          date: "$runDetails.date",
          crewType: "$runDetails.crewType",
          jobs: 1,
          allOperations: 1, // Include the array of all operations
        },
      },
    ]);

    res.status(200).send(result);
  } catch (error) {
    console.error("Error during aggregation: ", error);
    res.status(400).send(error);
  }
};

const getUserScheduleWorkWeek = async (req, res) => {
  const date = req.params.date;
  const userId = req.params.userId;

  const { startDate, endDate } = getWorkWeekRange(date);

  console.log(`${startDate} - ${endDate}`);

  try {
    const shifts = await TimeBlock.find({
      itemId: userId,
      $or: [
        { start: { $gte: startDate, $lte: endDate } },
        { end: { $gte: startDate, $lte: endDate } },
        { start: { $lte: startDate }, end: { $gte: endDate } },
      ],
    }).select("start end contextType contextKey");

    // Enhance shifts with additional data
    const enhancedShifts = shifts.map((shift) => {
      const start = new Date(shift.start);
      const end = new Date(shift.end);

      // Calculate the length in hours
      const length = (end - start) / (1000 * 60 * 60);

      // Format start date as YYYY-MM-DD
      const date = start.toISOString().substring(0, 10);

      // Get the day name
      const day = start.toLocaleString("en-US", { weekday: "long" });

      // Return the enhanced shift object
      return {
        ...shift.toObject(), // Convert Mongoose document to plain object
        date,
        day,
        length,
      };
    });

    res.status(200).send(enhancedShifts);
  } catch (error) {
    console.error("Error retrieving availability from time blocks:", error);
    res.status(400).send("Error retrieving availability from time blocks");
  }
};

const getScheduleWorkWeek = async (req, res) => {
  const date = req.params.date;

  // Assuming getWorkWeekRange returns strings formatted as "YYYY-MM-DD"
  const { startDate, endDate } = getWorkWeekRange(date);

  console.log(`${startDate} - ${endDate}`);

  try {
    const pipeline = [
      {
        $match: {
          $or: [
            { contextType: "shopShift" },
            { contextType: "runShift" },
            { contextType: "jobShift" },
            { contextType: "timeOff" },
          ],
          $or: [
            { start: { $gte: new Date(startDate), $lte: new Date(endDate) } },
            { end: { $gte: new Date(startDate), $lte: new Date(endDate) } },
            {
              start: { $lte: new Date(startDate) },
              end: { $gte: new Date(endDate) },
            },
          ],
        },
      },
      {
        $project: {
          itemId: 1,
          start: 1,
          end: 1,
          contextType: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$start" } },
          day: {
            $switch: {
              branches: [
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 1] },
                  then: "Sunday",
                },
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 2] },
                  then: "Monday",
                },
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 3] },
                  then: "Tuesday",
                },
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 4] },
                  then: "Wednesday",
                },
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 5] },
                  then: "Thursday",
                },
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 6] },
                  then: "Friday",
                },
                {
                  case: { $eq: [{ $dayOfWeek: "$start" }, 7] },
                  then: "Saturday",
                },
              ],
              default: "Unknown",
            },
          },
          shiftLength: {
            $divide: [{ $subtract: ["$end", "$start"] }, 3600000],
          },
        },
      },
      {
        $group: {
          _id: "$itemId",
          shifts: {
            $push: {
              start: "$start",
              end: "$end",
              contextType: "$contextType",
              date: "$date",
              day: "$day",
              shiftLength: "$shiftLength",
            },
          },
          totalHours: {
            $sum: {
              $cond: {
                if: { $ne: ["$contextType", "timeOff"] },
                then: "$shiftLength",
                else: 0,
              },
            },
          },
        },
      },
    ];

    const results = await TimeBlock.aggregate(pipeline);

    function getDayName(date) {
      return date.toLocaleString("en-US", { weekday: "long" }); // or any other locale you prefer
    }

    const processShifts = (data) => {
      const processedData = data.map((item) => {
        const processedShifts = item.shifts.flatMap((shift) => {
          if (shift.contextType === "timeOff" && shift.shiftLength > 24) {
            const segments = [];
            let start = new Date(shift.start);
            const end = new Date(shift.end);

            while (start < end) {
              const nextDay = new Date(start);
              nextDay.setDate(nextDay.getDate() + 1);
              nextDay.setHours(0, 0, 0, 0); // Midnight, start of the next day

              const segmentEnd = nextDay > end ? end : nextDay;
              const durationHours = Math.min(
                24,
                (segmentEnd - start) / (1000 * 3600)
              );
              const dayName = getDayName(start);

              segments.push({
                ...shift,
                start: new Date(start),
                end: new Date(segmentEnd),
                day: dayName, // Update day name based on the start date
                shiftLength: durationHours,
              });

              start = segmentEnd;
            }
            return segments;
          } else {
            // Update day name for non-split shifts as well
            return {
              ...shift,
              day: getDayName(new Date(shift.start)),
            };
          }
        });

        // Recalculate total hours excluding timeOff
        const totalHours = processedShifts.reduce((sum, curr) => {
          return sum + (curr.contextType !== "timeOff" ? curr.shiftLength : 0);
        }, 0);

        return {
          ...item,
          shifts: processedShifts,
          totalHours,
        };
      });

      return processedData;
    };

    const processedShifts = processShifts(results);
    // console.log(processedShifts);

    function transformResultsToMap(results) {
      const resultsMap = {};
      results.forEach((result) => {
        resultsMap[result._id] = {
          shifts: result.shifts,
          totalHours: result.totalHours,
        };
      });
      return resultsMap;
    }

    const processedObject = transformResultsToMap(processedShifts);
    const objResults = transformResultsToMap(results);
    // console.log(objResults);

    res.status(200).send(processedObject);
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(400).send("Error retrieving availability from time blocks");
  }
};

const aggregateJobsWithItems = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const results = await Job.aggregate([
      {
        $match: {
          start: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $lookup: {
          from: "jobitems", // Ensure this is the correct collection name
          localField: "jobId",
          foreignField: "jobId",
          as: "items",
        },
      },
      {
        $project: {
          _id: 1, // Include the Job ID
          jobId: 1, // Include the Job ID field
          start: 1, // Include the start date
          end: 1, // Include the end date
          status: 1, // Include job status
          typeEvent: 1, // Include type of event
          clientId: 1, // Include client ID
          facilityId: 1, // Include facility ID
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                itemId: "$$item.itemId", // Include the item ID from job items
                type: "$$item.type", // Include the type of item
                code: "$$item.code", // Include the code
                price: "$$item.price", // Include the price
              },
            },
          },
          totalHours: 1, // Include calculated total hours
        },
      },
    ]);

    res.status(200).send(results);
  } catch (error) {
    console.error("Error in aggregating jobs with items:", error);
    res.status(400).send("error getting job items");
  }
};
const aggregateJobsWithItemsbyId = async (req, res) => {
  const { jobId } = req.query;

  try {
    const results = await Job.aggregate([
      {
        $match: {
          jobId: jobId,
        },
      },
      {
        $lookup: {
          from: "jobitems", // Ensure this is the correct collection name
          localField: "jobId",
          foreignField: "jobId",
          as: "items",
        },
      },
      {
        $lookup: {
          from: "facilities", // Ensure this is the correct collection name
          localField: "facilityId",
          foreignField: "fmRecordId",
          as: "facility",
        },
      },
      {
        $unwind: "$facility", // Unwind to get a single document
      },
      {
        $project: {
          _id: 1, // Include the Job ID
          jobId: 1, // Include the Job ID field
          start: 1, // Include the start date
          end: 1, // Include the end date
          status: 1, // Include job status
          typeEvent: 1, // Include type of event
          clientId: 1, // Include client ID
          facilityId: 1, // Include facility ID
          facilityName: "$facility.facilityName", // Include the facility name from the facility collection
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                itemId: "$$item.itemId", // Include the item ID from job items
                jobItemId: "$$item.jobItemId", // Include the item ID from job items
                type: "$$item.type", // Include the type of item
                code: "$$item.code", // Include the code
                price: "$$item.price", // Include the price
              },
            },
          },
          totalHours: 1, // Include calculated total hours
        },
      },
    ]);

    res.status(200).send(results);
  } catch (error) {
    console.error("Error in aggregating jobs with items:", error);
    res.status(400).send("error getting job items");
  }
};

const timeblockRangeLookup = async (req, res) => {
  const { start, end, contextType, itemId } = req.query;

  console.log(start, end, contextType, itemId);

  if (!start || !end || !contextType || !itemId) {
    return res
      .status(400)
      .send({ message: "Missing required query parameters" });
  }

  try {
    const timeBlocks = await TimeBlock.find({
      contextType: contextType,
      itemId: itemId,
      start: { $lte: new Date(end) },
      end: { $gte: new Date(start) },
    });

    if (!timeBlocks.length) {
      return res
        .status(404)
        .send({ message: "No time blocks found within the specified range" });
    }

    console.log(typeof timeBlocks);
    res.status(200).send(timeBlocks);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
};

const findTimeBlockByContextAndRange = async (req, res) => {
  console.log("getting timeblocks for inventory");
  console.log(req.params);
  try {
    const timeblocks = await TimeBlock.findByContextAndRange(
      req.params.contextType,
      req.params.itemId,
      req.params.start,
      req.params.end
    );
    if (timeblocks.length === 0) {
      return res.status(200).send("No TimeBlocks found.");
    }
    res.status(200).send(timeblocks);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

const findTimeBlockByContextId = async (req, res) => {
  try {
    const timeblocks = await TimeBlock.findByContextId(
      req.params.contextType,
      req.params.contextKey
    );
    if (timeblocks.length === 0) {
      return res.status(200).send("No TimeBlocks found.");
    }
    res.status(200).send(timeblocks);
  } catch (error) {
    res.status(500).send("Server error: " + error.message);
  }
};

const aggregateJobsWithItemsbyIdWithAssemblies = async (req, res) => {
  const { jobId } = req.query;

  try {
    const results = await Job.aggregate([
      {
        $match: {
          jobId: jobId,
        },
      },
      {
        $lookup: {
          from: "jobitems", // Ensure this is the correct collection name
          localField: "jobId",
          foreignField: "jobId",
          as: "items",
        },
      },
      {
        $lookup: {
          from: "facilities", // Ensure this is the correct collection name
          localField: "facilityId",
          foreignField: "fmRecordId",
          as: "facility",
        },
      },
      {
        $unwind: "$facility", // Unwind to get a single document
      },
      {
        $project: {
          _id: 1, // Include the Job ID
          jobId: 1, // Include the Job ID field
          start: 1, // Include the start date
          end: 1, // Include the end date
          status: 1, // Include job status
          typeEvent: 1, // Include type of event
          clientId: 1, // Include client ID
          facilityId: 1, // Include facility ID
          facilityName: "$facility.facilityName", // Include the facility name from the facility collection
          items: {
            $map: {
              input: "$items",
              as: "item",
              in: {
                itemId: "$$item.itemId", // Include the item ID from job items
                jobItemId: "$$item.jobItemId", // Include the item ID from job items
                type: "$$item.type", // Include the type of item
                code: "$$item.code", // Include the code
                price: "$$item.price", // Include the price
              },
            },
          },
          totalHours: 1, // Include calculated total hours
        },
      },
    ]);

    res.status(200).send(results);
  } catch (error) {
    console.error("Error in aggregating jobs with items:", error);
    res.status(400).send("error getting job items");
  }
};

module.exports = {
  aggregateRunsOperationsJobs,
  aggregateRunstoJobstoOperations,
  getUserScheduleWorkWeek,
  getScheduleWorkWeek,
  aggregateJobsWithItems,
  aggregateJobsWithItemsbyId,
  timeblockRangeLookup,
  findTimeBlockByContextAndRange,
  findTimeBlockByContextId,
  aggregateJobsWithItemsbyIdWithAssemblies,
};
