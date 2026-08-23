import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPlus,
  faStethoscope,
  faTruck,
  faHouse,
  faHeart,
  faScissors,
  faGraduationCap,
  faSchool,
  faHammer,
  faAward,
  faMountain,
  faTrophy,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";
import useSeo from "@/hooks/useSeo";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/data/site-config";
import {
  SERVICE_ANIMAL_FILTERS,
  SERVICE_GROUPS,
  getServicesForAnimal,
} from "@/data/services-catalog";
import "./ServicesHub.css";

const SERVICE_ICONS = {
  stethoscope: faStethoscope,
  truck: faTruck,
  house: faHouse,
  heart: faHeart,
  scissors: faScissors,
  "graduation-cap": faGraduationCap,
  school: faSchool,
  hammer: faHammer,
  award: faAward,
  mountain: faMountain,
  trophy: faTrophy,
};

const ServicesHub = () => {
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState("all");

  useSeo({
    title: `שירותים לכל החיות | ${SITE_NAME}`,
    description: `${SITE_DESCRIPTION} — וטרינרים, פנסיון, הסעות, אילוף ועוד.`,
    url: `${SITE_URL}/services`,
  });

  const visibleServices = useMemo(
    () => getServicesForAnimal(selectedAnimal),
    [selectedAnimal]
  );

  const groupedSections = useMemo(
    () =>
      SERVICE_GROUPS.map((group) => ({
        ...group,
        services: visibleServices.filter((service) => service.group === group.id),
      })).filter((group) => group.services.length > 0),
    [visibleServices]
  );

  const openService = (service) => {
    const animalQuery =
      selectedAnimal !== "all" ? `?animal=${encodeURIComponent(selectedAnimal)}` : "";
    navigate(`${service.path}${animalQuery}`);
  };

  return (
    <main className="services-hub" dir="rtl">
      <section className="services-hub-hero">
        <div className="services-hub-hero-glow" aria-hidden="true" />
        <div className="services-hub-hero-inner">
          <button
            type="button"
            className="services-hub-back"
            onClick={() => navigate("/")}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>חזרה לדף הבית</span>
          </button>

          <span className="services-hub-kicker">
            <FontAwesomeIcon icon={faPaw} />
            מרכז השירותים
          </span>
          <h1>
            כל מה שחיית המחמד
            <span>צריכה — במקום אחד</span>
          </h1>
          <p>
            בחרו סוג חיה וגלו שירותים מותאמים: וטרינרים, פנסיון, הסעות, אילוף
            ועוד.
          </p>

          <button
            type="button"
            className="services-hub-publish"
            onClick={() => navigate("/publish_ad")}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>פרסמו שירות</span>
          </button>
        </div>
      </section>

      <section className="services-hub-filters" aria-label="סינון לפי סוג חיה">
        <div className="services-hub-filters-inner">
          {SERVICE_ANIMAL_FILTERS.map((animal) => (
            <button
              key={animal.id}
              type="button"
              className={`services-hub-animal-pill ${
                selectedAnimal === animal.id ? "active" : ""
              }`}
              onClick={() => setSelectedAnimal(animal.id)}
            >
              {animal.label}
            </button>
          ))}
        </div>
      </section>

      <section className="services-hub-content">
        {groupedSections.map((group) => (
          <div className="services-hub-group" key={group.id}>
            <div className="services-hub-group-header">
              <h2>{group.label}</h2>
              <p>{group.description}</p>
            </div>

            <div className="services-hub-grid">
              {group.services.map((service) => {
                const icon = SERVICE_ICONS[service.icon] || faPaw;

                return (
                  <article
                    key={service.slug}
                    className="services-hub-card"
                    style={{ "--service-accent": service.accent }}
                    onClick={() => openService(service)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openService(service);
                      }
                    }}
                    role="link"
                    tabIndex={0}
                  >
                    {service.isNew && (
                      <span className="services-hub-badge-new">חדש</span>
                    )}

                    <div
                      className="services-hub-card-icon"
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon icon={icon} />
                    </div>

                    <h3>{service.name}</h3>
                    <p>{service.subtitle}</p>

                    <div className="services-hub-card-animals">
                      {service.animals.slice(0, 4).map((animal) => (
                        <span key={animal}>{animal}</span>
                      ))}
                      {service.animals.length > 4 && (
                        <span>+{service.animals.length - 4}</span>
                      )}
                    </div>

                    <span className="services-hub-card-cta">לפרטים ←</span>
                  </article>
                );
              })}
            </div>
          </div>
        ))}

        {groupedSections.length === 0 && (
          <div className="services-hub-empty">
            <h3>לא נמצאו שירותים לסוג חיה זה</h3>
            <p>נסו לבחור קטגוריה אחרת או פרסמו שירות חדש.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ServicesHub;
