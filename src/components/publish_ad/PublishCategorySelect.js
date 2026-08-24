import React from "react";
import { getPublishCategoryGroups } from "@/helpers/publish-categories";

/**
 * Grouped category picker for publish/update forms.
 * Pets, products, and services (by service group) — available to all verified users.
 */
const PublishCategorySelect = ({
  value,
  onChange,
  isAdmin = false,
  id = "category",
  name = "category",
  required = true,
}) => {
  const groups = getPublishCategoryGroups(isAdmin);

  return (
    <div className="publish-category-field">
      <label htmlFor={id}>סוג המודעה</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">בחרו סוג מודעה</option>
        {groups.map((group) => (
          <optgroup key={group.id} label={group.label}>
            {group.options.map((option) => (
              <option key={`${group.id}-${option.label}`} value={option.label}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="publish-category-hint">
        חיות למכירה/אימוץ, מוצרים, או שירות מקצועי — כל משתמש רשום יכול לפרסם.
      </p>
    </div>
  );
};

export default PublishCategorySelect;
