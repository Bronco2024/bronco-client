import React from "react";
import {
  getPetBreeds,
  isOtherBreedSelection,
} from "@/data/pet-breeds";

const BreedSelect = ({
  category,
  breed = "",
  breedCustom = "",
  onChange,
  required = true,
  label = "גזע / סוג",
}) => {
  const breeds = getPetBreeds(category);

  return (
    <>
      <label htmlFor="breed">{label}</label>
      <select
        id="breed"
        name="breed"
        value={breed}
        onChange={onChange}
        required={required}
      >
        <option value="">בחר גזע / סוג</option>
        {breeds.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {isOtherBreedSelection(breed) && (
        <>
          <label htmlFor="breedCustom">פרט את הגזע / הסוג</label>
          <input
            id="breedCustom"
            name="breedCustom"
            value={breedCustom}
            onChange={onChange}
            required
          />
        </>
      )}
    </>
  );
};

export default BreedSelect;
