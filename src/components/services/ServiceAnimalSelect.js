import { SERVICE_ANIMAL_NAMES } from "@/data/services-catalog";
import "./ServiceAnimalSelect.css";

const ServiceAnimalSelect = ({ value = [], onChange, suggestedAnimals = [] }) => {
  const options =
    suggestedAnimals.length > 0
      ? suggestedAnimals
      : SERVICE_ANIMAL_NAMES;

  const toggleAnimal = (animal) => {
    const exists = value.includes(animal);
    const next = exists
      ? value.filter((item) => item !== animal)
      : [...value, animal];
    onChange(next);
  };

  return (
    <div className="service-animal-select">
      <p className="service-animal-select-label">לאילו חיות השירות מתאים?</p>
      <div className="service-animal-select-grid">
        {options.map((animal) => {
          const active = value.includes(animal);
          return (
            <button
              key={animal}
              type="button"
              className={`service-animal-select-chip ${active ? "active" : ""}`}
              onClick={() => toggleAnimal(animal)}
              aria-pressed={active}
            >
              {animal}
            </button>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="service-animal-select-hint">
          אם לא תבחרו — השירות יוצג לכל סוגי החיות.
        </p>
      )}
    </div>
  );
};

export default ServiceAnimalSelect;
