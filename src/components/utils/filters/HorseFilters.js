import { useState } from "react";
import { BREEDS, DISTRICTS, DISTRICT_NAMES } from "@components/utils/constants/Constants";
import './HorseFilters.css'

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

                        <div className="mobile-filter-row">
                            <select name="age" value={filters.age} onChange={handleFilterChange}>
                                <option value="">כל הגילאים</option>
                                <option value="foal">גור - עד 9 חודשים</option>
                                <option value="young">צעיר - 9 חודשים עד 24 חודשים</option>
                                <option value="adult">בוגר - 2 עד 7 שנים</option>
                                <option value="senior">מבוגר - מעל 7 שנים</option>
                            </select>
                        </div>
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

export default HorseFilters;