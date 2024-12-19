import { useState } from "react";
import JobItem from "./JobItem";

function JobItemsContainer({ items }) {
  const [activeJobItemId, setActiveJobItemId] = useState(null);

  return (
    <div className="flex flex-col gap-3 ml-4">
      {items &&
        items.map((item, index) => (
          <div key={index} className="">
            <JobItem
              item={item}
              isActive={activeJobItemId === item.jobItemId}
              onClick={() => setActiveJobItemId(item.jobItemId)}
            />
          </div>
        ))}
    </div>
  );
}

export default JobItemsContainer;
