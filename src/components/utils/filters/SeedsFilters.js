import { useState } from "react";
import { SEEDS_TYPES, SEMEN_TYPES } from "@components/utils/constants/Constants";
import CitySelect from "@/components/pets/CitySelect";
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

                <CitySelect
                    value={filters.location}
                    onChange={handleFilterChange}
                    required={false}
                    emptyLabel="כל הערים"
                    areaValue={filters.district || ""}
                    enableAreaFilter
                />
                <select
                    name="sortBy"
                    value={filters.sortBy || "newest"}
                    onChange={handleFilterChange}
                >
                    <option value="newest">הכי חדשים</option>
                    <option value="priceAsc">מחיר מהנמוך לגבוה</option>
                    <option value="priceDesc">מחיר מהגבוה לנמוך</option>
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