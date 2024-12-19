function ItemBlock({ items }) {
  const findLength = (start, end) => {
    const timeStart = new Date(start);
    const timeEnd = new Date(end);
    const length = timeEnd - timeStart;

    return length / 3600000;
  };

  function typeColor(type) {
    if (type === "Shop") {
      return "bg-blue-500";
    }
    if (type === "timeOff") {
      return "bg-red-500";
    }
    if (type === "runShift") {
      return "bg-green-500";
    }
    if (type === "jobShift") {
      return "bg-yellow-500";
    }

    return "bg-gray-500";
  }

  console.log(items.items);
  return (
    <>
      {items.items.map((block) => {
        const width = findLength(block.timeStampStart, block.timeStampEnd) * 10;

        console.log(" block", JSON.stringify(block));
        return (
          <div className="flex p-1" key={block.timeBlockPrimaryKey}>
            <div
              className={typeColor(block.contextType)}
              style={{ width: width }}
            >
              {findLength(block.timeStampStart, block.timeStampEnd)}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ItemBlock;
