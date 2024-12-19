import DataFetcher from "../../Components/Common/DataFetcher";

const AssemblyAvailability = ({ contextType, itemId }) => {
  const toDate = (date) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleString();
  };
  return (
    <div className="overflow-y-scroll">
      <DataFetcher url={`/api/inventory/assignment/${contextType}/${itemId}`}>
        {(data) => (
          <div className="flex items-center justify-center gap-4">
            {data?.map((item) => (
              <div className="text-xs">{`${toDate(item.start)} - ${toDate(
                item.end
              )}`}</div>
            ))}
          </div>
        )}
      </DataFetcher>
    </div>
  );
};

export default AssemblyAvailability;
