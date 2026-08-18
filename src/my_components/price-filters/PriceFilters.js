// PriceFilters.jsx
import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./PriceFilters.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export default function PriceFilters({
  isOpen,
  togglePopup,
  minPrice,
  maxPrice,
  handleChange,
  forceOpen = false,//This is for mobile view, to force the popup to be open without clicking the button
}) {
  const MIN = 0;
  const MAX = 999999;

  const handleSliderChange = ([newMin, newMax]) => {
    handleChange({ target: { name: "minPrice", value: newMin } });
    handleChange({ target: { name: "maxPrice", value: newMax } });
  };

  const open = forceOpen ? true : isOpen;


  return (
    <div className="price-filter-container">
      {!forceOpen && (
        <button className="toggle-price-btn" onClick={togglePopup}>
          <span>מחיר</span>
          <FontAwesomeIcon
            icon={isOpen ? faChevronUp : faChevronDown}
            className="icon"
            size={"xs"}
          />
        </button>
      )}

      {open && (
        <div className="price-popup">
          <div className="inputs-row">
            <input
              type="number"
              name="minPrice"
              placeholder="מחיר מינימלי"
              value={minPrice}
              onChange={(e) =>
                handleChange({
                  target: { name: "minPrice", value: Number(e.target.value) },
                })
              }
            />
            <span style={{ alignContent: 'center', fontSize: '1rem' }}> - </span>
            <input
              type="number"
              name="maxPrice"
              placeholder="מחיר מקסימלי"
              value={maxPrice}
              onChange={(e) =>
                handleChange({
                  target: { name: "maxPrice", value: Number(e.target.value) },
                })
              }
            />
          </div>

          <div className="slider-wrapper">
            <Slider
              range
              min={MIN}
              max={MAX}
              value={[Number(minPrice) || 0, Number(maxPrice) || MAX]}
              onChange={handleSliderChange}
              allowCross={false}
              styles={{
                rail: { backgroundColor: "#ccc", height: 6 },
                track: { backgroundColor: "#4CAF50", height: 6 },
                handle: {
                  borderColor: "#4CAF50",
                  height: 20,
                  width: 20,
                  marginTop: -7,
                  backgroundColor: "#fff",
                },
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
