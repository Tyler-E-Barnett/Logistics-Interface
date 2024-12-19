import { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, XIcon } from "../../assets/icons";
import CurrencyInput from "react-currency-input-field";

interface PricingLevelProps {
  index: number;
  pricingLevel: {
    unitPrice: string;
    defaultQuantity: string;
    minimumQuantity: string;
    itemId: string;
    levelName: string;
    id: string;
  };
  handlePricingLevelChange: (
    index: number,
    field: string,
    value: string
  ) => void;
  handleRemovePricingLevel: (index: number) => void;
}

const PricingLevel: React.FC<PricingLevelProps> = ({
  index,
  pricingLevel,
  handlePricingLevelChange,
  handleRemovePricingLevel,
}) => {
  const [levelNames, setLevelNames] = useState([]);

  useEffect(() => {
    const getLevelNames = async () => {
      const levelNames = await axios.get("/api/jobData/priceLevelName");
      setLevelNames(levelNames.data);
    };

    getLevelNames();
  }, []);

  return (
    <div className="relative p-4 mb-4 border border-green-500 rounded-md shadow-xl bg-secondary">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Unit Price
        </label>
        <CurrencyInput
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={pricingLevel.unitPrice}
          decimalsLimit={2}
          onValueChange={(value) =>
            handlePricingLevelChange(index, "unitPrice", value || "0")
          }
          prefix="$"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Default Quantity
        </label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={pricingLevel.defaultQuantity}
          onChange={(e) =>
            handlePricingLevelChange(index, "defaultQuantity", e.target.value)
          }
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Minimum Quantity
        </label>
        <input
          type="text"
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={pricingLevel.minimumQuantity}
          onChange={(e) =>
            handlePricingLevelChange(index, "minimumQuantity", e.target.value)
          }
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Level</label>
        <select
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={pricingLevel.levelName}
          onChange={(e) =>
            handlePricingLevelChange(index, "levelName", e.target.value)
          }
        >
          <option value="" disabled>
            Select Level Name
          </option>
          {levelNames.map((name) => (
            <option key={name["_id"]} value={name["_id"]}>
              {name.levelName}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="absolute top-0 right-0 flex items-center p-1 px-2 ml-2 text-white "
        onClick={() => handleRemovePricingLevel(index)}
      >
        <XIcon color={"#000000"} style={"h-6 w-6"} />
      </button>
    </div>
  );
};

export default PricingLevel;
