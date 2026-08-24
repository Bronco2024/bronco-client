import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faHeart,
  faHouse,
  faPaw,
  faPlus,
  faStethoscope,
  faStore,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ABOUTUS_FEATURES } from "@components/utils/constants/Constants";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/data/site-config";
import useSeo from "@/hooks/useSeo";
import InfoPageShell from "../InfoPageShell";

const FEATURE_ICONS = {
  paw: faPaw,
  heart: faHeart,
  box: faBoxOpen,
  stethoscope: faStethoscope,
  house: faHouse,
  users: faUsers,
  plus: faPlus,
  store: faStore,
};

const AboutUs = () => {
  useSeo({
    title: `אודותינו | ${SITE_NAME}`,
    description: `${SITE_NAME} — לוח מודעות לחיות מחמד, אימוץ ושירותים בישראל.`,
    url: `${SITE_URL}/about-us`,
    image: "/hero-pets.png",
  });

  return (
    <InfoPageShell
      title="אודותינו"
      subtitle="הבית של חיות המחמד — מודעות, אימוץ ושירותים במקום אחד."
      currentPath="/about-us"
    >
      <article className="info-page-card">
        <div className="info-page-about-lead">
          <figure className="info-page-about-image">
            <img src="/hero-pets.png" alt={SITE_NAME} loading="lazy" />
          </figure>
          <div className="info-page-about-copy">
            <h2>{SITE_NAME} – הבית של חיות המחמד</h2>
            <p>
              {SITE_NAME} היא פלטפורמה ישראלית שמחברת בין אנשים, חיות מחמד
              ושירותים. כאן אפשר למצוא מודעות למכירה ולאימוץ, לפרסם חיה, ולגלות
              וטרינרים, פנסיונים, אילוף, הובלה ואביזרים מכל הארץ.
            </p>
            <p>
              המטרה שלנו פשוטה: לעשות את החיפוש והפרסום ברורים, בטוחים
              ואחראיים יותר — לטובת החיות ולטובת האנשים שמחפשים בית או שירות.
            </p>
            <div className="info-page-about-actions">
              <Link to="/publish_ad" className="info-page-btn info-page-btn--primary">
                פרסמו מודעה
              </Link>
              <Link to="/adoption" className="info-page-btn info-page-btn--ghost">
                למרכז האימוץ
              </Link>
            </div>
          </div>
        </div>

        <div className="info-page-about-grid">
          {ABOUTUS_FEATURES.map((feature) => (
            <div className="info-page-feature" key={feature.title}>
              <span className="info-page-feature-icon" aria-hidden="true">
                <FontAwesomeIcon icon={FEATURE_ICONS[feature.icon] || faPaw} />
              </span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="info-page-closing">
          אנחנו מאמינים בשקיפות, באחריות כלפי החיות, ובקהילה שמחברת בין אנשים
          שאוהבים אותן באמת. {SITE_NAME} הוא לא רק לוח מודעות — זה מקום מפגש.
          <br />
          <strong>ברוכים הבאים ל־{SITE_NAME}, המקום שבו מתחיל הסיפור הבא.</strong>
        </p>

        <div className="info-page-section">
          <div className="info-page-contact">
            <p>
              לשאלות או שיתופי פעולה:{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </div>
        </div>
      </article>
    </InfoPageShell>
  );
};

export default AboutUs;
