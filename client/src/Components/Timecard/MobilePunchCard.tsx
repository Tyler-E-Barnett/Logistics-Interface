import axios from "axios";
import { useEffect, useState } from "react";

const MobilePunchCard = ({ item, formatTime }) => {
  const [userName, setUserName] = useState("");

  const getUsername = async (id) => {
    try {
      const response = await axios.get(`/api/personnel/microsoft/${id}`);
      return response.data.displayName; // Assuming the API returns an object with a 'name' field
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await getUsername(item.userId);
      setUserName(name);
    };

    fetchUserName();
  }, [item.userId]);

  return (
    <div className="flex min-h-24 flex-col w-full md:w-auto p-2 text-center group bg-secondary rounded-lg shadow-lg duration-500 transition-all border transform hover:scale-105 border-secondaryVarLight sm:w-1/2 lg:w-[250px] overflow-hidden">
      <div className="mb-2">
        <div className="text-sm font-bold text-secondaryVar">{userName}</div>
        <div className="text-sm text-secondaryVar">
          <span className="font-semibold">Run#</span> {item.runNumber}
        </div>
      </div>
      <div className="flex justify-center gap-1">
        <div className="flex flex-col p-1 rounded-lg  shadow-sm  group-hover:max-h-[200px] max-h-[28px] overflow-hidden transition-max-height duration-500 ease-in-out">
          <div className="text-sm font-bold text-primary">
            {formatTime(item.timeStampIn)}
          </div>
          <div className="text-xs transition-opacity duration-500 opacity-0 text-onSecondary group-hover:opacity-100">
            {item.locationIn.address}
          </div>
        </div>
        {item.locationOut && (
          <div className="flex flex-col p-1 rounded-lg  shadow-sm  group-hover:max-h-[200px] max-h-[28px] overflow-hidden transition-max-height duration-500 ease-in-out">
            <div className="text-sm font-bold text-primaryVar">
              {formatTime(item.timeStampOut)}
            </div>
            <div className="text-xs transition-opacity duration-500 opacity-0 text-onSecondary group-hover:opacity-100">
              {item.locationOut.address}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobilePunchCard;
