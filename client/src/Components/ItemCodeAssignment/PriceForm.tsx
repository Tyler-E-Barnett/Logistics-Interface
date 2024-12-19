import React from "react";
import { PlusIcon } from "../../assets/icons";
import { PriceFormProps } from "../../../types";

const PriceForm: React.FC<PriceFormProps> = ({
  pricing,
  handlePricingChange,
  handleTermFactorChange,
  levelNames,
  addPricingLevel,
  isEditing = false,
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow ">
      {!isEditing && (
        <h2 className="font-medium text-gray-700 text-md">Price Entry</h2>
      )}

      {!isEditing && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Select a Level
          </label>
          <select
            name="level"
            value={pricing.level}
            onChange={handlePricingChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="" disabled>
              Select a Level...
            </option>
            {levelNames.map((name) => (
              <option key={name["_id"]} value={name["_id"]}>
                {name.levelName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Price
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="unitPrice"
              value={pricing.unitPrice}
              onChange={handlePricingChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default Quantity
          </label>
          <input
            type="number"
            name="defaultQuantity"
            value={pricing.defaultQuantity}
            onChange={handlePricingChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Quantity
          </label>
          <input
            type="number"
            name="minimumQuantity"
            value={pricing.minimumQuantity}
            onChange={handlePricingChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Maximum Quantity
          </label>
          <input
            type="number"
            name="maximumQuantity"
            value={pricing.maximumQuantity}
            onChange={handlePricingChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Base Price
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="basePrice"
              value={pricing.basePrice}
              onChange={handlePricingChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Base Adjust
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="baseAdjust"
              value={pricing.baseAdjust}
              onChange={handlePricingChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Base Discount
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="baseDiscount"
              value={pricing.baseDiscount}
              onChange={handlePricingChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Adjust
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="unitAdjust"
              value={pricing.unitAdjust}
              onChange={handlePricingChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit Discount
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="unitDiscount"
              value={pricing.unitDiscount}
              onChange={handlePricingChange}
              className="block w-full border border-gray-300 rounded-md shadow-sm pl-7 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Client Description
        </label>
        <textarea
          name="clientDescription"
          value={pricing.clientDescription || ""}
          onChange={handlePricingChange}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={1}
        />
      </div>

      <h3 className="mt-4 text-lg font-medium text-gray-700">Term Factor</h3>
      <div className="grid grid-cols-6 gap-6 mt-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">2D</label>
          <input
            type="number"
            name="2D"
            value={pricing.termFactor["2D"]}
            onChange={handleTermFactorChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">3D</label>
          <input
            type="number"
            name="3D"
            value={pricing.termFactor["3D"]}
            onChange={handleTermFactorChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">BW</label>
          <input
            type="number"
            name="BW"
            value={pricing.termFactor.BW}
            onChange={handleTermFactorChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">FW</label>
          <input
            type="number"
            name="FW"
            value={pricing.termFactor.FW}
            onChange={handleTermFactorChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">10D</label>
          <input
            type="number"
            name="10D"
            value={pricing.termFactor["10D"]}
            onChange={handleTermFactorChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">M</label>
          <input
            type="number"
            name="M"
            value={pricing.termFactor.M}
            onChange={handleTermFactorChange}
            className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      {!isEditing && (
        <div className="flex justify-end p-1 mt-2 space-x-2 rounded">
          <button
            type="button"
            onClick={addPricingLevel}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon
              style={"w-10 h-10 rounded-full hover:bg-sky-100"}
              color={"#5046e6"}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceForm;
