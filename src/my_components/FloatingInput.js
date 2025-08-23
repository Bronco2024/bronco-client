import React from 'react';
import './FloatingInput.css';

const FloatingInput = ({ label, value, onChange, type = 'text', placeholder = '', min, max, id }) => {

    return (
        <div className="input-floating">
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                required
                placeholder={placeholder}
            />
            <label htmlFor="ageYears">{label}</label>
        </div>
    )
}

export default FloatingInput;