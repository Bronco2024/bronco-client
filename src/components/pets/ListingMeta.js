import React from "react";
import "./ListingMeta.css";

const ListingMeta = ({ location, age, type, className = "" }) => {
  const items = [
    type ? { label: "סוג", value: type } : null,
    location ? { label: "אזור", value: location } : null,
    age ? { label: "גיל", value: age } : null,
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className={`listing-meta ${className}`.trim()}>
      {items.map((item) => (
        <span className="listing-meta-item" key={item.label}>
          <span className="listing-meta-label">{item.label}</span>
          <span className="listing-meta-value">{item.value}</span>
        </span>
      ))}
    </div>
  );
};

export default ListingMeta;
