import React from "react";
import ISRAEL_CITIES from "@/data/israel-cities";

const CitySelect = ({
  value = "",
  onChange,
  required = true,
  label = "עיר",
  id = "location",
  name = "location",
  emptyLabel = "בחר עיר",
}) => (
  <>
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">{emptyLabel}</option>
      {ISRAEL_CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </>
);

export default CitySelect;
