import { PET_CATEGORIES } from "../data/pets";
import {
  SERVICE_GROUPS,
  SERVICES_CATALOG,
  getServiceByCategory,
} from "../data/services-catalog";

const PRODUCT_CATEGORIES = [
  { path: "/seeds", label: "זרע" },
  { path: "/accessories", label: "אביזרים" },
];

const STORE_CATEGORY = { path: "/our-products", label: "חנות" };

const SERVICE_LABELS = SERVICES_CATALOG.map((service) => service.category);

export const isPublishServiceCategory = (categoryName) =>
  SERVICE_LABELS.includes(categoryName);

/** Service labels every verified publisher can use (not admin-only store). */
export const PUBLIC_SERVICE_CATEGORIES = SERVICES_CATALOG.map((service) => ({
  path: service.path,
  label: service.category,
}));

const getServicePublishGroups = () =>
  SERVICE_GROUPS.map((group) => ({
    id: `service-${group.id}`,
    label: `שירותים · ${group.label}`,
    options: SERVICES_CATALOG.filter((service) => service.group === group.id).map(
      (service) => ({
        path: service.path,
        label: service.category,
      })
    ),
  })).filter((group) => group.options.length > 0);

export const getPublishCategoryGroups = (isAdmin = false, { servicesOnly = false } = {}) => {
  const serviceGroups = getServicePublishGroups();
  if (servicesOnly) return serviceGroups;

  const products = isAdmin
    ? [...PRODUCT_CATEGORIES, STORE_CATEGORY]
    : PRODUCT_CATEGORIES;

  return [
    {
      id: "pets",
      label: "חיות מחמד",
      options: PET_CATEGORIES.map(({ path, name }) => ({
        path,
        label: name,
      })),
    },
    {
      id: "products",
      label: "מוצרים",
      options: products,
    },
    ...serviceGroups,
  ];
};

export const resolvePublishCategoryFromQuery = ({
  category,
  slug,
  type,
} = {}) => {
  if (slug) {
    const fromSlug = SERVICES_CATALOG.find((service) => service.slug === slug);
    if (fromSlug) return fromSlug.category;
  }

  if (!category) {
    // type=service only opens service-mode publish (no default category).
    return type === "service" ? "" : "";
  }

  const decoded = decodeURIComponent(String(category)).trim();
  if (isPublishServiceCategory(decoded) || getServiceByCategory(decoded)) {
    return decoded;
  }

  const byName = PET_CATEGORIES.find((pet) => pet.name === decoded);
  if (byName) return byName.name;

  if (["זרע", "אביזרים", "חנות"].includes(decoded)) return decoded;

  return "";
};

export const isServicePublishMode = ({ type, category, slug } = {}) => {
  if (type === "service") return true;
  if (slug && SERVICES_CATALOG.some((service) => service.slug === slug)) {
    return true;
  }
  if (category) {
    const decoded = decodeURIComponent(String(category)).trim();
    return isPublishServiceCategory(decoded);
  }
  return false;
};

export const getServicePublishCopy = (categoryName) => {
  const service = getServiceByCategory(categoryName);
  if (!service) {
    return {
      titlePlaceholder: "כותרת השירות",
      hint: "מלאו פרטים ברורים כדי שלקוחות ימצאו אתכם.",
      priceLabel: "מחיר / תעריף (אופציונלי)",
    };
  }

  return {
    titlePlaceholder: `לדוגמה: ${service.name} באזור שלכם`,
    hint: service.subtitle,
    priceLabel: "מחיר / תעריף (אופציונלי)",
  };
};
