export const SERVICE_ANIMAL_NAMES = [
  "כלבים",
  "חתולים",
  "סוסים",
  "ציפורים",
  "דגים",
  "ארנבים",
  "זוחלים",
  "תרנגולות",
  "חיות משק",
  "חיות קטנות",
];

export const SERVICE_ANIMAL_FILTERS = [
  { id: "all", label: "כל החיות", shortLabel: "הכל" },
  ...SERVICE_ANIMAL_NAMES.map((name) => ({
    id: name,
    label: name,
    shortLabel: name,
  })),
];

export const SERVICE_GROUPS = [
  {
    id: "essential",
    label: "שירותים חיוניים",
    description: "בריאות, הסעות וטיפול יומיומי — לכל סוגי החיות",
  },
  {
    id: "care",
    label: "שמירה וטיפוח",
    description: "פנסיון, שמירה בבית ומספרות מקצועיות",
  },
  {
    id: "training",
    label: "אילוף ולימוד",
    description: "התנהגות, רכיבה ובתי ספר מקצועיים",
  },
  {
    id: "equine",
    label: "מקצועי לסוסים",
    description: "פרזול, מציגים ותחרויות מהשורה הראשונה",
  },
  {
    id: "experiences",
    label: "חוויות ואירועים",
    description: "טיולים, תצוגות ותחרויות",
  },
];

export const SERVICES_CATALOG = [
  {
    slug: "veterinarians",
    path: "/veterinarians",
    name: "וטרינרים",
    subtitle: "רופאים וטיפול מקצועי — מכלבים ועד חיות משק",
    category: "וטרינרים",
    group: "essential",
    animals: [
      "כלבים",
      "חתולים",
      "סוסים",
      "ציפורים",
      "דגים",
      "זוחלים",
      "ארנבים",
      "חיות משק",
      "חיות קטנות",
      "תרנגולות",
    ],
    icon: "stethoscope",
    accent: "#2563eb",
    image: "/services/veterinarian.jpg",
    featured: true,
  },
  {
    slug: "transport",
    path: "/transport",
    name: "הסעות חיות",
    subtitle: "העברה בטוחה לוטרינר, פנסיון או בית חדש",
    category: "הסעות",
    group: "essential",
    animals: [
      "כלבים",
      "חתולים",
      "סוסים",
      "ציפורים",
      "ארנבים",
      "חיות משק",
      "חיות קטנות",
      "תרנגולות",
    ],
    icon: "truck",
    accent: "#0d9488",
    image: "/services/boarding.jpg",
    featured: true,
    isNew: true,
  },
  {
    slug: "boarding",
    path: "/boarding",
    name: "פנסיון",
    subtitle: "מקומות אמינים לשהייה זמנית",
    category: "פנסיון",
    group: "care",
    animals: ["כלבים", "חתולים", "ארנבים", "ציפורים", "חיות קטנות"],
    icon: "house",
    accent: "#7c3aed",
    image: "/services/boarding.jpg",
    featured: true,
  },
  {
    slug: "pet-sitting",
    path: "/pet-sitting",
    name: "שמירה בבית",
    subtitle: "מישהו שדואג לחיה שלכם בבית — בזמן שאתם בחוץ",
    category: "שמירה בבית",
    group: "care",
    animals: ["כלבים", "חתולים", "ארנבים", "ציפורים", "חיות קטנות", "דגים", "זוחלים"],
    icon: "heart",
    accent: "#db2777",
    image: "/services/groomers.jpg",
    featured: true,
    isNew: true,
  },
  {
    slug: "groomers",
    path: "/groomers",
    name: "מספרות",
    subtitle: "טיפוח, תספורת וטיפול חיצוני",
    category: "מספרות",
    group: "care",
    animals: ["כלבים", "חתולים", "סוסים"],
    icon: "scissors",
    accent: "#ea580c",
    image: "/services/groomers.jpg",
    featured: true,
  },
  {
    slug: "training",
    path: "/training",
    name: "אילוף והתנהגות",
    subtitle: "כלבים, חתולים, ציפורים — התנהגות טובה מתחילה כאן",
    category: "אילוף והתנהגות",
    group: "training",
    animals: ["כלבים", "חתולים", "ציפורים", "סוסים"],
    icon: "graduation-cap",
    accent: "#4f46e5",
    image: "/services/school.jpg",
    featured: true,
    isNew: true,
  },
  {
    slug: "schools",
    path: "/schools",
    name: "בתי ספר לרכיבה",
    subtitle: "לימוד ואימון לכל הרמות",
    category: "בתי ספר",
    group: "training",
    animals: ["סוסים"],
    icon: "school",
    accent: "#0891b2",
    image: "/services/school.jpg",
  },
  {
    slug: "breeders",
    path: "/breeders",
    name: "מפרזילים",
    subtitle: "טיפול ואיזון מקצועי לסוסים",
    category: "מפרזילים",
    group: "equine",
    animals: ["סוסים"],
    icon: "hammer",
    accent: "#92400e",
    image: "/listings/arabian-horse.jpg",
  },
  {
    slug: "exhibitors",
    path: "/exhibitors",
    name: "מציגים",
    subtitle: "אנשי מקצוע מהתחום",
    category: "מציגים",
    group: "equine",
    animals: ["סוסים"],
    icon: "award",
    accent: "#b45309",
    image: "/listings/arabian-horse.jpg",
  },
  {
    slug: "trips",
    path: "/trips",
    name: "טיולים",
    subtitle: "חוויות עם חיות בטבע",
    category: "טיולים",
    group: "experiences",
    animals: ["כלבים", "סוסים", "חיות משק"],
    icon: "mountain",
    accent: "#059669",
    image: "/listings/goat.jpg",
  },
  {
    slug: "shows-and-competitions",
    path: "/shows-and-competitions",
    name: "תצוגות ותחרויות",
    subtitle: "אירועים קרובים להשתתף ולהתרגש",
    category: "תצוגות ותחרויות",
    group: "experiences",
    animals: ["סוסים", "כלבים", "ציפורים"],
    icon: "trophy",
    accent: "#ca8a04",
    image: "/listings/arabian-horse.jpg",
  },
];

export const getServiceByPath = (path) =>
  SERVICES_CATALOG.find((service) => service.path === path);

export const getServiceByCategory = (categoryName) =>
  SERVICES_CATALOG.find((service) => service.category === categoryName);

export const getServiceBySlug = (slug) =>
  SERVICES_CATALOG.find((service) => service.slug === slug);

export const getFeaturedServices = () =>
  SERVICES_CATALOG.filter((service) => service.featured);

export const getServicesByGroup = (groupId) =>
  SERVICES_CATALOG.filter((service) => service.group === groupId);

export const getServicesForAnimal = (animalId) => {
  if (!animalId || animalId === "all") {
    return SERVICES_CATALOG;
  }

  return SERVICES_CATALOG.filter((service) =>
    service.animals.includes(animalId)
  );
};

export const adMatchesServiceAnimal = (ad, animalId) => {
  if (!animalId || animalId === "all") return true;

  const animals = ad?.service_animals;
  if (!Array.isArray(animals) || animals.length === 0) return true;

  return animals.includes(animalId);
};

export const filterAdsByServiceAnimal = (ads, animalId) => {
  if (!animalId || animalId === "all") return ads;
  return ads.filter((ad) => adMatchesServiceAnimal(ad, animalId));
};

export const SITE_SERVICES_FROM_CATALOG = SERVICES_CATALOG.map(
  ({ path, name, subtitle, image, animals, featured, isNew }) => ({
    path,
    name,
    subtitle,
    image,
    animals,
    featured,
    isNew,
  })
);
