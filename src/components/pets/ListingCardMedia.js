import React from "react";
import "./ListingCardMedia.css";

/**
 * Full photo visible (contain) with a soft blurred fill so cards look even
 * instead of empty side gutters.
 */
const ListingCardMedia = ({
  src,
  alt = "",
  className = "",
  children,
}) => {
  const imageSrc = src || "";

  return (
    <div className={`listing-card-media ${className}`.trim()}>
      {imageSrc ? (
        <img
          className="listing-card-media-bg"
          src={imageSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      ) : null}
      <img
        className="listing-card-media-fg"
        src={imageSrc}
        alt={alt}
        loading="lazy"
      />
      {children}
    </div>
  );
};

export default ListingCardMedia;
