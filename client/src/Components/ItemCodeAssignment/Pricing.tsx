import React, { useState } from "react";
import { PlusIcon, LeftCarrot, DownCarrot, XIcon } from "../../assets/icons";
import PriceForm from "./PriceForm";
import { PricingProps } from "../../../types";

const pricingDefault = {
  unitPrice: "",
  defaultQuantity: 1,
  minimumQuantity: 1,
  maximumQuantity: 10,
  basePrice: "",
  baseAdjust: "",
  baseDiscount: "",
  unitAdjust: "",
  unitDiscount: "",
  termFactor: {
    "2D": 1,
    "3D": 1,
    BW: 1,
    FW: 1,
    "10D": 1,
    M: 1,
  },
  level: "",
};

const Pricing: React.FC<PricingProps> = ({
  pricing,
  setPricing,
  pricingLevels,
  setPricingLevels,
  removedPricingLevels,
  setRemovedPricingLevels,
  levelNames,
}) => {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);

  const handlePricingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value);
    setPricing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPricing((prev) => ({
      ...prev,
      termFactor: {
        ...prev.termFactor,
        [name]: value,
      },
    }));
  };

  const addPricingLevel = () => {
    if (
      pricing.unitPrice &&
      pricing.defaultQuantity &&
      pricing.minimumQuantity &&
      pricing.level
    ) {
      const levelName = levelNames.find(
        (name) => name["_id"] === pricing.level
      )?.levelName;

      setPricingLevels([
        ...pricingLevels,
        { ...pricing, level: { _id: pricing.level, levelName } },
      ]);
      setPricing(pricingDefault);
    }
    console.log(pricingLevels);
  };

  const removePricingLevel = (level: string) => {
    const confirmed = window.confirm(
      "Do you want to remove this pricing data?"
    );

    if (confirmed) {
      const removedLevel = pricingLevels.find((p) => p.level._id === level);
      if (removedLevel && removedLevel._id) {
        setRemovedPricingLevels([...removedPricingLevels, removedLevel._id]);
      }
      setPricingLevels(pricingLevels.filter((p) => p.level._id !== level));
    }
  };

  const toggleExpandCollapse = (index: number) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  return (
    <div className="p-4 border border-green-300 rounded-lg bg-gray-50">
      <h2 className="mb-4 text-xl font-medium text-gray-700">Pricing</h2>
      <PriceForm
        pricing={pricing}
        handlePricingChange={handlePricingChange}
        handleTermFactorChange={handleTermFactorChange}
        levelNames={levelNames}
        addPricingLevel={addPricingLevel}
      />

      <div className="flex flex-wrap gap-4 mt-2">
        {pricingLevels.map((pricingLevel, index) => (
          <div
            key={index}
            className="relative flex flex-col w-full p-4 text-black transition-transform duration-500 bg-green-200 border border-green-500 rounded-md shadow-sm group"
          >
            <div className="flex items-center justify-start">
              <div className="text-lg font-semibold">
                {pricingLevel.level.levelName}
              </div>
              <button
                type="button"
                onClick={() => toggleExpandCollapse(index)}
                className="text-indigo-600 hover:text-indigo-900"
              >
                {expandedIndexes.includes(index) ? (
                  <DownCarrot style={"w-6 h-6"} color={"#000000"} />
                ) : (
                  <LeftCarrot style={"w-6 h-6"} color={"#000000"} />
                )}
              </button>
            </div>

            {expandedIndexes.includes(index) && (
              <PriceForm
                pricing={pricingLevel}
                handlePricingChange={(e) => {
                  const { name, value } = e.target;
                  setPricingLevels((prev) => {
                    const newPricingLevels = [...prev];
                    newPricingLevels[index] = {
                      ...newPricingLevels[index],
                      [name]: value,
                    };
                    return newPricingLevels;
                  });
                }}
                handleTermFactorChange={(e) => {
                  const { name, value } = e.target;
                  setPricingLevels((prev) => {
                    const newPricingLevels = [...prev];
                    newPricingLevels[index] = {
                      ...newPricingLevels[index],
                      termFactor: {
                        ...newPricingLevels[index].termFactor,
                        [name]: value,
                      },
                    };
                    return newPricingLevels;
                  });
                }}
                levelNames={levelNames}
                isEditing={true}
              />
            )}
            {pricingLevel.level.levelName !== "Standard" && (
              <button
                type="button"
                onClick={() => removePricingLevel(pricingLevel.level._id)}
                className="absolute text-indigo-600 top-2 right-2 hover:text-indigo-900"
              >
                <XIcon style={"w-6 h-6"} color={"#000000"} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
