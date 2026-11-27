import React from "react";
import "./ListingCardMedia.css";

/**
 * Full photo visible (contain) with a soft blurred fill so cards look even
 * instead of empty side gutters. One network image — blur uses CSS background.
 */
const ListingCardMedia = ({
  src,
  alt = "",
  className = "",
  children,
  priority = false,
}) => {
  const imageSrc = src || "";
  const style = imageSrc
    ? { "--listing-media-src": `url("${String(imageSrc).replace(/"/g, "%22")}")` }
    : undefined;

  return (
    <div
      className={`listing-card-media ${className}`.trim()}
      style={style}
    >
      {imageSrc ? (
        <div className="listing-card-media-bg" aria-hidden="true" />
      ) : null}
      <img
        className="listing-card-media-fg"
        src={imageSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" } : {})}
      />
      {children}
    </div>
  );
};

export default ListingCardMedia;
