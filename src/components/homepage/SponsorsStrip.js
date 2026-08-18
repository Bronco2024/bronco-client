import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import "./SponsorsStrip.css";

const SponsorsStrip = () => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sponsors"));
        const items = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .filter((item) => item.photo);

        const rank = { gold: 0, silver: 1, bronze: 2 };
        items.sort(
          (a, b) => (rank[a.sponsor] ?? 9) - (rank[b.sponsor] ?? 9)
        );
        setSponsors(items);
      } catch {
        setSponsors([]);
      }
    };

    fetchSponsors();
  }, []);

  if (sponsors.length === 0) return null;

  return (
    <section className="sponsors-strip" aria-label="ספונסורים">
      <div className="section-header">
        <span className="section-kicker">ספונסורים</span>
        <h2>השותפים שלנו</h2>
        <p>מותגים ושירותים מומלצים לחיות מחמד</p>
      </div>
      <div className="sponsors-strip-row">
        {sponsors.map((sponsor) => {
          const card = (
            <div className={`sponsors-strip-card sponsors-strip-card--${sponsor.sponsor || "standard"}`}>
              <img src={sponsor.photo} alt="" />
            </div>
          );

          if (!sponsor.link) return <div key={sponsor.id}>{card}</div>;

          return (
            <a
              key={sponsor.id}
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ספונסור"
            >
              {card}
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default SponsorsStrip;
