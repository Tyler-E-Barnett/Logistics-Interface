import useFetchData from "../Hooks/useFetchData";
import LoadingSpinner from "../assets/LoadingSpinner";
import ItemBlock from "./ItemBlock";

function ScheduleInterface() {
  const { data, loading, error } = useFetchData(
    "api/filemaker/timeblocks/Scheduling/timeblocks"
  );

  if (loading)
    return (
      <div className="flex items-center justify-center m-auto h-96">
        <div className="m-auto animate-spin spin-slow">
          <LoadingSpinner />
        </div>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="">
      {data &&
        data.map((items) => (
          <div key={items.itemId} className="flex p-4 m-2">
            <div className="text-xl font-bold">{items.itemId}</div>
            <ItemBlock items={items} />
          </div>
        ))}
    </div>
  );
}

export default ScheduleInterface;
