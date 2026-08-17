import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetCard from "./PetCard";
import {
  FAVORITES_CHANGED_EVENT,
  getFavorites,
} from "@/data/pets";
import "./CategoryListings.css";

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => getFavorites());

  useEffect(() => {
    const syncFavorites = () => setFavorites(getFavorites());

    window.addEventListener(FAVORITES_CHANGED_EVENT, syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  return (
    <main className="category-page" dir="rtl">
      <section className="category-hero" style={{ backgroundImage: "url(/hero-pets.png)" }}>
        <div className="category-hero-overlay">
          <button
            type="button"
            className="category-back"
            onClick={() => navigate("/")}
          >
            ← חזרה לדף הבית
          </button>
          <h1>המועדפים שלי</h1>
          <p>כל החיות ששמרתם כדי לחזור אליהן אחר כך.</p>
        </div>
      </section>

      <section className="category-content">
        {favorites.length > 0 ? (
          <div className="listings-grid">
            {favorites.map((listing) => (
              <PetCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="category-empty">
            <h3>עדיין אין מועדפים</h3>
            <p>לחצו על הלב בכרטיס מודעה כדי לשמור אותה כאן.</p>
            <button
              type="button"
              className="category-reset"
              onClick={() => navigate("/")}
            >
              חזרה לחיפוש
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Favorites;
