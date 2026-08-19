import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import { FormatDateTimestampToDate } from "@components/utils/constants/Functions";
import "./ServicePage.css";

const fallbackImage = () => require("@/assets/no-image.jpg");
const formatCardPrice = (price) => {
  if (price === undefined || price === null || price === "") return "";
  if (typeof price === "number") return `₪${price.toLocaleString("he-IL")}`;
  if (typeof price === "string") {
    const trimmed = price.trim();
    if (!trimmed) return "";
    if (trimmed.includes("₪") || trimmed.includes("אימוץ")) return trimmed;
    const numeric = Number(trimmed.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(numeric) && numeric > 0) {
      return `₪${numeric.toLocaleString("he-IL")}`;
    }
    return trimmed;
  }
  return String(price);
};

export const AdGridCard = ({
  ad,
  title,
  onClick,
  children,
  verified = false,
}) => {
  const image = ad.photos?.[0] || fallbackImage();
  const heading = title || ad.title || ad.name || ad.category;

  const open = () => onClick?.(ad);

  return (
    <article
      className={`ads-page-card ${verified ? "verified" : ""}`}
      onClick={onClick ? open : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      role={onClick ? "link" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="ads-page-card-image">
        <img src={image} alt={heading} loading="lazy" />
        {ad.category && (
          <span className="ads-type-badge">{ad.category}</span>
        )}
        {ad.hasCertificate && (
          <span
            className="ads-certificate-badge"
            title="חיה עם תעודה מאושרת"
          >
            <FontAwesomeIcon icon={faCertificate} /> תעודה
          </span>
        )}
      </div>
      <div className="ads-page-card-body">
        <h2>{heading}</h2>
        {formatCardPrice(ad.price) && <strong>{formatCardPrice(ad.price)}</strong>}
        {children}
        <span>תאריך פרסום: {FormatDateTimestampToDate(ad.createdAt)}</span>
      </div>
    </article>
  );
};

const ServicePage = ({
  title,
  subtitle,
  heroImage,
  count,
  filters,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <main className="ads-page" dir="rtl">
      <section
        className="ads-page-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="ads-page-hero-overlay">
          <button
            type="button"
            className="ads-page-back"
            onClick={() => navigate("/")}
          >
            ← חזרה לדף הבית
          </button>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </section>

      <section className="ads-page-content">
        {filters}
        {typeof count === "number" && (
          <p className="ads-page-count">{count} מודעות</p>
        )}
        {children}
      </section>
    </main>
  );
};

export default ServicePage;
