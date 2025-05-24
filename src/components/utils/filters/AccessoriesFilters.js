import { useState } from "react";
import { ACCESSORIES_TPYES, DISTRICTS, DISTRICT_NAMES } from "@components/utils/constants/Constants";
import './AccessoriesFilters.css'

const AccessoriesFilters = ({ filters, handleFilterChange, applyFilters, resetFilters }) => {

    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

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
                    name="district"
                    value={filters.district}
                    onChange={handleFilterChange}
                >
                    <option value="">בחר אזור</option>
                    {Object.keys(DISTRICTS).map((districtKey) => (
                        <option key={districtKey} value={districtKey}>
                            {DISTRICT_NAMES[districtKey]}
                        </option>
                    ))}
                </select>

                {filters.district && (
                    <>
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleFilterChange}
                        >
                            <option value="">בחר מיקום</option>
                            {DISTRICTS[filters.district].map((city, index) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                <input
                    type="number"
                    name="minPrice"
                    placeholder="מחיר מינימלי"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder="מחיר מקסימלי"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
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
                            <select name="district" value={filters.district} onChange={handleFilterChange}>
                                <option value="">בחר אזור</option>
                                {Object.keys(DISTRICTS).map((key) => (
                                    <option key={key} value={key}>{DISTRICT_NAMES[key]}</option>
                                ))}
                            </select>
                        </div>

                        {filters.district && (
                            <div className="mobile-filter-row">
                                <select name="location" value={filters.location} onChange={handleFilterChange}>
                                    <option value="">בחר מיקום</option>
                                    {DISTRICTS[filters.district].map((city, index) => (
                                        <option key={index} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mobile-final-row">
                            <input type="number" name="minPrice" placeholder="מחיר מינימלי" value={filters.minPrice} onChange={handleFilterChange} />
                            <input type="number" name="maxPrice" placeholder="מחיר מקסימלי" value={filters.maxPrice} onChange={handleFilterChange} />
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