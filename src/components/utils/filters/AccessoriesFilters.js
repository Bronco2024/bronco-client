import { useState } from "react";
import { ACCESSORIES_TPYES, ISRAEL_CITIES } from "@components/utils/constants/Constants";
import './AccessoriesFilters.css'
import PriceFilters from "../../../my_components/price-filters/PriceFilters";

const AccessoriesFilters = ({ filters, handleFilterChange, applyFilters, resetFilters }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const togglePopup = () => setIsOpen(prev => !prev);

    return (
        <>
            <div className="accessories-filters-box desktop-only">
                <select
                    id="accessory"
                    name="accessory"
                    value={filters.accessory || ""}
                    onChange={handleFilterChange}
                    required
                >
                    <option value="">בחר סוג מוצר</option>
                    {ACCESSORIES_TPYES.map((accessory, index) => (
                        <option key={index} value={accessory}>
                            {accessory}
                        </option>
                    ))}
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
                    <span>סינון אביזרים</span>
                </button>

                {showFilters && (
                    <div className="accessories-filters-box mobile">
                        <div className="mobile-filter-row">
                            <select
                                id="accessory"
                                name="accessory"
                                value={filters.accessory || ""}
                                onChange={handleFilterChange}
                                required
                            >
                                <option value="">בחר סוג מוצר</option>
                                {ACCESSORIES_TPYES.map((accessory, index) => (
                                    <option key={index} value={accessory}>
                                        {accessory}
                                    </option>
                                ))}
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

export default AccessoriesFilters;