import React from "react";
import { AREA_OPTIONS, getCitiesByArea } from "@/data/city-areas";

const CitySelect = ({
  value = "",
  onChange,
  required = true,
  label = "עיר",
  id = "location",
  name = "location",
  emptyLabel = "בחר עיר",
  areaValue = "",
  onAreaChange,
  areaLabel = "אזור",
  areaId = "district",
  areaName = "district",
  enableAreaFilter = false,
}) => {
  const cities = getCitiesByArea(areaValue);

  return (
    <>
      {enableAreaFilter && (
        <>
          <label htmlFor={areaId}>{areaLabel}</label>
          <select
            id={areaId}
            name={areaName}
            value={areaValue}
            onChange={onAreaChange || onChange}
          >
            {AREA_OPTIONS.map((option) => (
              <option key={option.value || "all-areas"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      )}

      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">{emptyLabel}</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
    </>
  );
};

export default CitySelect;
