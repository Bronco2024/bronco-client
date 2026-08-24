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
  SERVICE_LABELS.includes(categoryName) || categoryName === "חנות";

/** Service labels every verified publisher can use (not admin-only store). */
export const PUBLIC_SERVICE_CATEGORIES = SERVICES_CATALOG.map((service) => ({
  path: service.path,
  label: service.category,
}));

export const getPublishCategoryGroups = (isAdmin = false) => {
  const products = isAdmin
    ? [...PRODUCT_CATEGORIES, STORE_CATEGORY]
    : PRODUCT_CATEGORIES;

  const serviceGroups = SERVICE_GROUPS.map((group) => ({
    id: `service-${group.id}`,
    label: `שירותים · ${group.label}`,
    options: SERVICES_CATALOG.filter((service) => service.group === group.id).map(
      (service) => ({
        path: service.path,
        label: service.category,
      })
    ),
  })).filter((group) => group.options.length > 0);

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

export const resolvePublishCategoryFromQuery = ({ category, slug } = {}) => {
  if (slug) {
    const fromSlug = SERVICES_CATALOG.find((service) => service.slug === slug);
    if (fromSlug) return fromSlug.category;
  }

  if (!category) return "";

  const decoded = decodeURIComponent(String(category)).trim();
  if (isPublishServiceCategory(decoded) || getServiceByCategory(decoded)) {
    return decoded;
  }

  const byName = PET_CATEGORIES.find((pet) => pet.name === decoded);
  if (byName) return byName.name;

  if (["זרע", "אביזרים", "חנות"].includes(decoded)) return decoded;

  return "";
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
