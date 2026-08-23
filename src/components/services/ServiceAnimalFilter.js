import "./ServiceAnimalFilter.css";

const ServiceAnimalFilter = ({ animals = [], value, onChange }) => {
  if (!animals.length) return null;

  const options = [
    { id: "all", label: "כל החיות" },
    ...animals.map((animal) => ({ id: animal, label: animal })),
  ];

  return (
    <div className="service-animal-filter" role="group" aria-label="סינון לפי סוג חיה">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`service-animal-chip ${
            value === option.id ? "active" : ""
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ServiceAnimalFilter;
