import { useState } from "react";
import { SEEDS_TYPES, SEMEN_TYPES, DISTRICTS, DISTRICT_NAMES } from "@components/utils/constants/Constants";
import './SeedsFilters.css'
import PriceFilters from "../../../my_components/price-filters/PriceFilters";


const SeedsFilters = ({ filters, handleFilterChange, applyFilters, resetFilters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };
    const togglePopup = () => setIsOpen(prev => !prev);

    return (
        <>
            <div className="seeds-filters-box desktop-only">
                <select
                    name="seed_type"
                    value={filters.seed_type}
                    onChange={handleFilterChange}
                >
                    <option value="">סוג זרע</option>
                    {SEEDS_TYPES.map((seed, index) => (
                        <option key={index} value={seed}>
                            {seed}
                        </option>
                    ))}
                </select>

                <select
                    name="semen_type"
                    value={filters.semen_type}
                    onChange={handleFilterChange}
                >
                    <option value="">טרי/קפוא</option>
                    {SEMEN_TYPES.map((semen, index) => (
                        <option key={index} value={semen}>
                            {semen}
                        </option>
                    ))}
                </select>

                <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                    <option value="">תעודת הרבעה</option>
                    <option value="yes">כן</option>
                    <option value="no">לא</option>
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
                    <span>סינון זרעים</span>
                </button>

                {showFilters && (
                    <div className="seeds-filters-box mobile">
                        <div className="mobile-filter-row">

                            <select
                                name="seed_type"
                                value={filters.seed_type}
                                onChange={handleFilterChange}
                            >
                                <option value="">סוג זרע</option>
                                {SEEDS_TYPES.map((seed, index) => (
                                    <option key={index} value={seed}>
                                        {seed}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mobile-filter-row">
                            <select
                                name="semen_type"
                                value={filters.semen_type}
                                onChange={handleFilterChange}
                            >
                                <option value="">טרי/קפוא</option>
                                {SEMEN_TYPES.map((semen, index) => (
                                    <option key={index} value={semen}>
                                        {semen}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mobile-filter-row">
                            <select name="hasCertificate" value={filters.hasCertificate} onChange={handleFilterChange}>
                                <option value="">תעודת הרבעה</option>
                                <option value="yes">כן</option>
                                <option value="no">לא</option>
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

export default SeedsFilters;