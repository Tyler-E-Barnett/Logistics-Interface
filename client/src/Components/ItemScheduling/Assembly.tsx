const Assembly = ({ assembly, isUnavailable }) => {
  return (
    <div
      className={`flex transition-transform duration-300 hover:scale-105 flex-col justify-center w-full p-2 mb-2 rounded shadow ${
        isUnavailable ? "bg-red-100" : "bg-green-100"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 ">
        <div className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded">
          {assembly.assemblyId}
        </div>
        <div
          className={`px-3 py-1 text-sm font-medium rounded ${
            assembly.status !== "Working" && assembly.status !== "Usable"
              ? "bg-red-500 text-white"
              : "bg-green-500 text-white"
          }`}
        >
          {assembly.status}
        </div>
      </div>
      {assembly.timeblocks &&
        assembly.timeblocks.map((block) => (
          <div key={block._id} className="p-2 mt-2 rounded bg-gray-50">
            {isUnavailable ? (
              <div className="text-red-500">
                <span className="font-bold">Unavailable</span> - assigned to
                job# {block.contextKey} from{" "}
                {new Date(block.start).toLocaleString("en-US")} to{" "}
                {new Date(block.end).toLocaleString("en-US")}
              </div>
            ) : (
              <div className="text-blue-500">
                assigned to this job from{" "}
                {new Date(block.start).toLocaleString("en-US")} to{" "}
                {new Date(block.end).toLocaleString("en-US")}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Assembly;
