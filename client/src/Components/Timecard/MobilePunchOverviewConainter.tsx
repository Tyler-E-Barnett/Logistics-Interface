import DataFetcher from "../Common/DataFetcher";
import MobilePunchCard from "./MobilePunchCard";
import MobileTimeline from "./MobileTimeline";

function MobilePunchOverviewContainer() {
  // Helper function to format time without seconds
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex items-start justify-start w-full h-[1200px] rounded border-2 border-gray-300 px-4">
      <div className="h-full overflow-x-scroll w-96">
        <div className="flex flex-col items-center justify-start w-full gap-4 p-4 mt-2 rounded">
          <DataFetcher url={"/api/timecard/punchesToday"}>
            {(data) =>
              data?.map((item) => (
                <MobilePunchCard
                  key={item._id}
                  item={item}
                  formatTime={formatTime}
                />
              ))
            }
          </DataFetcher>
        </div>
      </div>
      <div className="w-full ml-2">
        <MobileTimeline />
      </div>
    </div>
  );
}

export default MobilePunchOverviewContainer;
