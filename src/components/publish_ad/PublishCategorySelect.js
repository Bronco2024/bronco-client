import React from "react";
import { getPublishCategoryGroups } from "@/helpers/publish-categories";

/**
 * Grouped category picker for publish/update forms.
 * Pets, products, and services (by service group) — available to all verified users.
 * When servicesOnly, only service groups are shown (dedicated service publish).
 */
const PublishCategorySelect = ({
  value,
  onChange,
  isAdmin = false,
  servicesOnly = false,
  id = "category",
  name = "category",
  required = true,
}) => {
  const groups = getPublishCategoryGroups(isAdmin, { servicesOnly });

  return (
    <div className="publish-category-field">
      <label htmlFor={id}>
        {servicesOnly ? "סוג השירות" : "סוג המודעה"}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">
          {servicesOnly ? "בחרו סוג שירות" : "בחרו סוג מודעה"}
        </option>
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
        {servicesOnly
          ? "בחרו את תחום השירות שלכם — הפרטים למטה מותאמים לשירותים, לא למודעות מכירה."
          : "חיות למכירה/אימוץ, מוצרים, או שירות מקצועי — כל משתמש רשום יכול לפרסם."}
      </p>
    </div>
  );
};

export default PublishCategorySelect;
