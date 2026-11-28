import React, { useEffect, useMemo, useRef, useState } from "react";
import { AREA_OPTIONS, getCitiesByArea } from "@/data/city-areas";
import { withCurrentOption } from "@/helpers/select-options";
import { filterCitiesByQuery } from "@/helpers/city-search";
import "./CitySelect.css";

const CitySelect = ({
  value = "",
  onChange,
  required = true,
  label = "עיר",
  id = "location",
  name = "location",
  emptyLabel = "חפשו עיר או יישוב…",
  areaValue = "",
  onAreaChange,
  areaLabel = "אזור",
  areaId = "district",
  areaName = "district",
  enableAreaFilter = false,
  searchable = true,
}) => {
  // If district key is unknown, don't empty the city list — keep the saved city selectable.
  const citiesForArea =
    enableAreaFilter && areaValue
      ? getCitiesByArea(areaValue)
      : getCitiesByArea("");
  const cities = withCurrentOption(
    citiesForArea.length ? citiesForArea : getCitiesByArea(""),
    value
  );

  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const suggestions = useMemo(
    () => filterCitiesByQuery(cities, query, 100),
    [cities, query]
  );

  const emitChange = (nextValue) => {
    if (typeof onChange === "function") {
      onChange({
        target: { name, value: nextValue },
      });
    }
  };

  const pickCity = (city) => {
    setQuery(city);
    emitChange(city);
    setOpen(false);
  };

  if (!searchable) {
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
  }

  return (
    <div className="city-select" ref={rootRef}>
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
      <input
        id={id}
        name={name}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={`${id}-listbox`}
        autoComplete="address-level2"
        placeholder={emptyLabel}
        value={query}
        required={required}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          const next = event.target.value;
          setQuery(next);
          setOpen(true);
          // Keep form state in sync while typing; must match a city on submit.
          emitChange(next);
        }}
      />
      {open && suggestions.length > 0 && (
        <ul id={`${id}-listbox`} className="city-select-list" role="listbox">
          {suggestions.map((city) => (
            <li key={city} role="option">
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pickCity(city)}>
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim() && suggestions.length === 0 && (
        <p className="city-select-empty">לא נמצא יישוב תואם — נסו שם אחר</p>
      )}
    </div>
  );
};

export default CitySelect;
