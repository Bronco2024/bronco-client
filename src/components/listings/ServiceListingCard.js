import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { FormatDateTimestampToDate } from "@components/utils/constants/Functions";
import { formatListingPrice } from "@/data/pets";
import { getServiceByCategory } from "@/data/services-catalog";

const fallbackImage = () => require("@/assets/no-image.jpg");

/**
 * Provider-style card for service listings — distinct from marketplace ad tiles.
 */
export const ServiceListingCard = ({ ad, onClick }) => {
  const service = getServiceByCategory(ad.category);
  const accent = service?.accent || "#0f766e";
  const image = ad.photos?.[0] || service?.image || fallbackImage();
  const heading = ad.title || service?.name || ad.category || "שירות";
  const priceLabel = formatListingPrice(ad);
  const animals = Array.isArray(ad.service_animals) ? ad.service_animals : [];

  const open = () => onClick?.(ad);

  return (
    <article
      className="service-listing-card"
      style={{ "--service-accent": accent }}
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
      <div className="service-listing-card-media">
        <img src={image} alt={heading} loading="lazy" />
      </div>

      <div className="service-listing-card-body">
        <div className="service-listing-card-meta">
          <span className="service-listing-kind">
            <FontAwesomeIcon icon={faBriefcase} />
            שירות
          </span>
          {ad.category && (
            <span className="service-listing-category">{ad.category}</span>
          )}
        </div>

        <h2>{heading}</h2>

        {animals.length > 0 && (
          <div className="service-listing-animals">
            {animals.slice(0, 4).map((animal) => (
              <span key={animal}>{animal}</span>
            ))}
            {animals.length > 4 && (
              <span>+{animals.length - 4}</span>
            )}
          </div>
        )}

        <div className="service-listing-card-footer">
          <div className="service-listing-card-facts">
            {ad.location && (
              <span>
                <FontAwesomeIcon icon={faLocationDot} />
                {ad.location}
              </span>
            )}
            <span>פורסם {FormatDateTimestampToDate(ad.createdAt)}</span>
          </div>
          {priceLabel ? (
            <strong className="service-listing-rate">{priceLabel}</strong>
          ) : (
            <strong className="service-listing-rate service-listing-rate--ask">
              לתיאום מחיר
            </strong>
          )}
        </div>
      </div>
    </article>
  );
};

export default ServiceListingCard;
