import { useState } from "react";
import { BREEDS, ISRAEL_CITIES } from "@components/utils/constants/Constants";
import './HorseFilters.css'
import PriceFilters from "../../../my_components/price-filters/PriceFilters";

const HorseFilters = ({ filters, handleFilterChange, applyFilters, resetFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const togglePopup = () => setIsOpen(prev => !prev);

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

                <select
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                >
                    <option value="">כל הערים</option>
                    {ISRAEL_CITIES.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

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
                <PriceFilters
                    isOpen={isOpen}
                    togglePopup={togglePopup}
                    minPrice={filters.minPrice}
                    maxPrice={filters.maxPrice}
                    handleChange={handleFilterChange}
                />

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
                            <select name="location" value={filters.location} onChange={handleFilterChange}>
                                <option value="">כל הערים</option>
                                {ISRAEL_CITIES.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
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
                        <div className="mobile-price-row">
                            <PriceFilters
                                togglePopup={togglePopup}
                                minPrice={filters.minPrice}
                                maxPrice={filters.maxPrice}
                                handleChange={handleFilterChange}
                                forceOpen={true} // Force open for mobile view
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