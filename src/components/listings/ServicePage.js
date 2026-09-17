import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate } from "@fortawesome/free-solid-svg-icons";
import { FormatDateTimestampToDate } from "@components/utils/constants/Functions";
import { formatListingPrice, isAdoptionListing } from "@/data/pets";
import ListingSearchField from "@/components/listings/ListingSearchField";
import { ServiceListingCard } from "@/components/listings/ServiceListingCard";
import "./ServicePage.css";

const fallbackImage = () => require("@/assets/no-image.jpg");

export { ServiceListingCard };

export const AdGridCard = ({
  ad,
  title,
  onClick,
  children,
  verified = false,
}) => {
  const image = ad.photos?.[0] || fallbackImage();
  const heading = title || ad.title || ad.name || ad.category;
  const priceLabel = formatListingPrice(ad);
  const showAdoption = isAdoptionListing(ad);

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
        {showAdoption && (
          <span className="ads-adoption-badge">לאימוץ</span>
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
        {Array.isArray(ad.service_animals) && ad.service_animals.length > 0 && (
          <div className="ads-service-animals">
            {ad.service_animals.slice(0, 3).map((animal) => (
              <span key={animal}>{animal}</span>
            ))}
          </div>
        )}
        {priceLabel && <strong>{priceLabel}</strong>}
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
  searchText = "",
  onSearchChange,
  children,
  countLabel = "מודעות",
}) => {
  const navigate = useNavigate();

  return (
    <main className="ads-page ads-page--services" dir="rtl">
      <section
        className="ads-page-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="ads-page-hero-overlay">
          <button
            type="button"
            className="ads-page-back"
            onClick={() => navigate("/services")}
          >
            ← חזרה לשירותים
          </button>
          <p className="ads-page-kicker">מרכז השירותים</p>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </section>

      <section className="ads-page-content">
        {(filters || onSearchChange) && (
          <div className="ads-page-filters">
            {onSearchChange && (
              <form
                className="category-search ads-page-search"
                onSubmit={(event) => event.preventDefault()}
              >
                <ListingSearchField
                  id={`${title}-search`}
                  value={searchText}
                  onChange={onSearchChange}
                  placeholder="חיפוש שירות, אזור או ספק…"
                />
              </form>
            )}
            {filters}
          </div>
        )}
        {typeof count === "number" && (
          <p className="ads-page-count">
            {count} {countLabel}
          </p>
        )}
        {children}
      </section>
    </main>
  );
};

export default ServicePage;
