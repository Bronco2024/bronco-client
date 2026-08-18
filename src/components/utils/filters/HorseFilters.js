import { useState } from "react";
import { BREEDS } from "@components/utils/constants/Constants";
import CitySelect from "@/components/pets/CitySelect";
import "./HorseFilters.css";

const HorseFilters = ({ filters, handleFilterChange, applyFilters, resetFilters }) => {
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <>
            <div className="horses-filters-box desktop-only">
                <select
                    id="breed"
                    name="breed"
                    value={filters.breed || ""}
                    onChange={handleFilterChange}
                    required
                >
                    <option value="">גזע</option>
                    {BREEDS.map((breed, index) => (
                        <option key={index} value={breed}>
                            {breed}
                        </option>
                    ))}
                </select>

                <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                    <option value="">מין</option>
                    <option value="זכר">זכר</option>
                    <option value="נקבה">נקבה</option>
                </select>

                <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                    <option value="">תעודה</option>
                    <option value="yes">כן</option>
                    <option value="no">לא</option>
                </select>

                <CitySelect
                    value={filters.location}
                    onChange={handleFilterChange}
                    required={false}
                    emptyLabel="כל הערים"
                    areaValue={filters.district || ""}
                    enableAreaFilter
                />

                <select
                    name="age"
                    value={filters.age}
                    onChange={handleFilterChange}
                >
                    <option value="">כל הגילאים</option>
                    <option value="foal">סייח - עד 9 חודשים</option>
                    <option value="young">צעיר - 9 חודשים עד 24 חודשים</option>
                    <option value="adult">בוגר - 2 עד 7 שנים</option>
                    <option value="senior">מבוגר - מעל 7 שנים</option>
                </select>
                <select
                    name="sortBy"
                    value={filters.sortBy || "newest"}
                    onChange={handleFilterChange}
                >
                    <option value="newest">הכי חדשים</option>
                    <option value="priceAsc">מחיר מהנמוך לגבוה</option>
                    <option value="priceDesc">מחיר מהגבוה לנמוך</option>
                </select>
                <div className="horse-price-range">
                    <label htmlFor="horse-min-price">מחיר מ-</label>
                    <input
                        id="horse-min-price"
                        type="number"
                        name="minPrice"
                        min={0}
                        value={filters.minPrice || ""}
                        onChange={handleFilterChange}
                        placeholder="מינימום"
                    />
                    <label htmlFor="horse-max-price">עד</label>
                    <input
                        id="horse-max-price"
                        type="number"
                        name="maxPrice"
                        min={0}
                        value={filters.maxPrice === 999999 ? "" : filters.maxPrice}
                        onChange={handleFilterChange}
                        placeholder="מקסימום"
                    />
                </div>

                <button className="apply-filters" onClick={applyFilters}>חפש</button>
                <button className="reset-filters" onClick={resetFilters}>איפוס</button>
            </div>

            <div className="mobile-only">
                <button className="toggle-filters-btn" onClick={toggleFilters}>
                    <span style={{ fontSize: '1.4rem', marginRight: 8 }}>🔍</span>
                    <span>סינון סוסים</span>
                </button>

                {showFilters && (
                    <div className="horses-filters-box mobile">
                        <div className="mobile-filter-row">
                            <select name="breed" value={filters.breed} onChange={handleFilterChange}>
                                <option value="">גזע</option>
                                {BREEDS.map((breed, index) => (
                                    <option key={index} value={breed}>{breed}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mobile-filter-row">
                            <select name="gender" value={filters.gender} onChange={handleFilterChange}>
                                <option value="">מין</option>
                                <option value="זכר">זכר</option>
                                <option value="נקבה">נקבה</option>
                            </select>
                        </div>

                        <div className="mobile-filter-row">
                            <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                                <option value="">תעודה</option>
                                <option value="yes">כן</option>
                                <option value="no">לא</option>
                            </select>
                        </div>

                        <div className="mobile-filter-row">
                            <CitySelect
                                value={filters.location}
                                onChange={handleFilterChange}
                                required={false}
                                emptyLabel="כל הערים"
                                areaValue={filters.district || ""}
                                enableAreaFilter
                            />
                        </div>

                        <div className="mobile-filter-row">
                            <select name="age" value={filters.age} onChange={handleFilterChange}>
                                <option value="">כל הגילאים</option>
                                <option value="foal">סייח - עד 9 חודשים</option>
                                <option value="young">צעיר - 9 חודשים עד 24 חודשים</option>
                                <option value="adult">בוגר - 2 עד 7 שנים</option>
                                <option value="senior">מבוגר - מעל 7 שנים</option>
                            </select>
                        </div>
                        <div className="mobile-filter-row">
                            <select
                                name="sortBy"
                                value={filters.sortBy || "newest"}
                                onChange={handleFilterChange}
                            >
                                <option value="newest">הכי חדשים</option>
                                <option value="priceAsc">מחיר מהנמוך לגבוה</option>
                                <option value="priceDesc">מחיר מהגבוה לנמוך</option>
                            </select>
                        </div>
                        <div className="mobile-price-row horse-price-range">
                            <label htmlFor="horse-min-price-mobile">מחיר מ-</label>
                            <input
                                id="horse-min-price-mobile"
                                type="number"
                                name="minPrice"
                                min={0}
                                value={filters.minPrice || ""}
                                onChange={handleFilterChange}
                                placeholder="מינימום"
                            />
                            <label htmlFor="horse-max-price-mobile">עד</label>
                            <input
                                id="horse-max-price-mobile"
                                type="number"
                                name="maxPrice"
                                min={0}
                                value={filters.maxPrice === 999999 ? "" : filters.maxPrice}
                                onChange={handleFilterChange}
                                placeholder="מקסימום"
                            />
                        </div>

                        <div className="mobile-final-row">
                            <button className="apply-filters" onClick={applyFilters}>חפש</button>
                            <button className="reset-filters" onClick={resetFilters}>איפוס</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
};

export default HorseFilters;