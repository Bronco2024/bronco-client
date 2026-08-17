import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FAVORITES_CHANGED_EVENT,
  isFavoriteListing,
  toggleFavoriteListing,
} from "@/data/pets";
import "./PetCard.css";

const PetCard = ({ listing, showAdoptionBadge = false }) => {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(() =>
    isFavoriteListing(listing.id)
  );

  useEffect(() => {
    const syncFavorite = () => {
      setFavorited(isFavoriteListing(listing.id));
    };

    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
    window.addEventListener("storage", syncFavorite);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorite);
      window.removeEventListener("storage", syncFavorite);
    };
  }, [listing.id]);

  const handleFavorite = (event) => {
    event.stopPropagation();
    setFavorited(toggleFavoriteListing(listing));
  };

  const openListing = () => navigate("/item", { state: { ad: listing } });

  return (
    <article
      className="listing-card"
      onClick={openListing}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openListing();
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className="listing-image">
        <img src={listing.image || listing.photos?.[0]} alt={listing.name} loading="lazy" />

        <button
          className={`favorite ${favorited ? "active" : ""}`}
          type="button"
          aria-label={favorited ? "הסר מהמועדפים" : "הוסף למועדפים"}
          onClick={handleFavorite}
        >
          {favorited ? "♥" : "♡"}
        </button>

        <span className="listing-type">{listing.type}</span>

        {(showAdoptionBadge || listing.forAdoption) && (
          <span className="listing-adoption-badge">לאימוץ</span>
        )}
      </div>

      <div className="listing-content">
        <h3>{listing.name}</h3>

        <div className="listing-details">
          <span>📍 {listing.location}</span>
          <span>🕒 {listing.age}</span>
        </div>

        <strong>{listing.price}</strong>
      </div>
    </article>
  );
};

export default PetCard;
