import ISRAEL_CITIES from "./israel-cities";

export const FAVORITES_STORAGE_KEY = "pets_bones_favorites";
export const FAVORITES_CHANGED_EVENT = "pets-favorites-changed";

export const PET_LOCATIONS = ISRAEL_CITIES;

export const PET_CATEGORIES = [
  {
    slug: "dogs",
    path: "/dogs",
    name: "כלבים",
    type: "כלב",
    image: "/dogs.jpg",
    subtitle: "מצאו את הכלב שמתאים לכם",
  },
  {
    slug: "cats",
    path: "/cats",
    name: "חתולים",
    type: "חתול",
    image: "/cats.jpg",
    subtitle: "חתולים למכירה ולאימוץ",
  },
  {
    slug: "horses",
    path: "/horses",
    name: "סוסים",
    type: "סוס",
    image: "/horses.jpg",
    subtitle: "סוסים וסייחים מכל הגזעים",
    useExistingPage: true,
  },
  {
    slug: "birds",
    path: "/birds",
    name: "ציפורים",
    type: "ציפור",
    image: "/birds.jpg",
    subtitle: "תוכים וציפורי נוי",
  },
  {
    slug: "fish",
    path: "/fish",
    name: "דגים",
    type: "דג",
    image: "/fish.jpg",
    subtitle: "דגי נוי לאקווריום",
  },
  {
    slug: "rabbits",
    path: "/rabbits",
    name: "ארנבים",
    type: "ארנב",
    image: "/rabbits.jpg",
    subtitle: "ארנבים ננסיים ומשפחתיים",
  },
  {
    slug: "reptiles",
    path: "/reptiles",
    name: "זוחלים",
    type: "זוחל",
    image: "/reptiles.jpg",
    subtitle: "לטאות, נחשים וזוחלים",
  },
  {
    slug: "chickens",
    path: "/chickens",
    name: "תרנגולות",
    type: "עופות",
    image: "/chickens.jpg",
    subtitle: "תרנגולות ועופות חצר",
  },
  {
    slug: "farm-animals",
    path: "/farm-animals",
    name: "חיות משק",
    type: "חיית משק",
    image: "/farm-animals.jpg",
    subtitle: "עיזים, כבשים וחיות משק",
  },
  {
    slug: "small-animals",
    path: "/small-animals",
    name: "חיות קטנות",
    type: "חיה קטנה",
    image: "/small-animals.jpg",
    subtitle: "אוגרים, שרקנים וחיות כיס",
  },
];

export const ACCESSORIES_CATEGORY = {
  slug: "accessories",
  path: "/accessories",
  name: "אביזרים",
  type: "אביזר",
  image: "/accessories-hero.png",
  subtitle: "צעצועים, כלובים וכל מה שחיית המחמד צריכה",
  useExistingPage: true,
};

export const MARKETPLACE_CATEGORIES = [
  ...PET_CATEGORIES,
  ACCESSORIES_CATEGORY,
];

export const SITE_SERVICES = [
  {
    path: "/veterinarians",
    name: "וטרינרים",
    subtitle: "רופאים וטיפול מקצועי לחיות מחמד",
    image: "/services/veterinarian.jpg",
  },
  {
    path: "/boarding",
    name: "פנסיון",
    subtitle: "מקומות אמינים לשהייה זמנית",
    image: "/services/boarding.jpg",
  },
  {
    path: "/groomers",
    name: "מספרות",
    subtitle: "טיפוח, תספורת וטיפול חיצוני לחיות",
    image: "/services/groomers.jpg",
  },
  {
    path: "/seeds",
    name: "זרע",
    subtitle: "לגידול מקצועי ומתקדם",
    image: "/listings/goat.jpg",
  },
  {
    path: "/exhibitors",
    name: "מציגים",
    subtitle: "אנשי מקצוע מהתחום",
    image: "/listings/arabian-horse.jpg",
  },
  {
    path: "/breeders",
    name: "מפרזילים",
    subtitle: "טיפול ואיזון מקצועי",
    image: "/listings/arabian-horse.jpg",
  },
  {
    path: "/schools",
    name: "בתי ספר",
    subtitle: "לימוד ואימון לכל הרמות",
    image: "/services/school.jpg",
  },
  {
    path: "/trips",
    name: "טיולים",
    subtitle: "חוויות עם חיות בטבע",
    image: "/listings/goat.jpg",
  },
  {
    path: "/shows-and-competitions",
    name: "תצוגות ותחרויות",
    subtitle: "אירועים קרובים להשתתף ולהתרגש",
    image: "/listings/arabian-horse.jpg",
  },
];

const listing = (data) => ({
  contact: data.contact || "צוות Pets & Bones",
  phoneNumber: data.phoneNumber || "0547926338",
  photos: data.photos || [data.image],
  title: data.title || data.name,
  source: "catalog",
  hasCertificate: Boolean(data.hasCertificate),
  createdAt: data.createdAt || { seconds: 1735689600 },
  ...data,
});

export const PET_LISTINGS = [
  listing({
    id: "dog-1",
    name: "גור גולדן רטריבר",
    type: "כלב",
    category: "כלבים",
    location: "תל אביב",
    age: "3 חודשים",
    breed: "גולדן רטריבר",
    gender: "זכר",
    hasCertificate: true,
    price: "4,500 ₪",
    image: "/listings/golden-retriever.jpg",
    description:
      "גור גולדן רטריבר חברותי, מחוסן ומטופל. מתאים למשפחה עם ילדים ומחפש בית חם.",
  }),
  listing({
    id: "dog-2",
    name: "לברדור בוגר",
    type: "כלב",
    category: "כלבים",
    location: "חיפה",
    age: "2 שנים",
    breed: "לברדור",
    gender: "נקבה",
    hasCertificate: true,
    price: "3,200 ₪",
    image: "/listings/labrador.jpg",
    description:
      "לברדור רגועה ומחונכת. רגילה לבית, מסתדרת עם ילדים ואוהבת טיולים.",
  }),
  listing({
    id: "dog-3",
    name: "מעורב קטן",
    type: "כלב",
    category: "כלבים",
    location: "ראשון לציון",
    age: "8 חודשים",
    breed: "מעורב",
    gender: "זכר",
    price: "1,200 ₪",
    image: "/listings/mixed-dog.jpg",
    description:
      "כלב מעורב אנרגטי וחכם. מתאים לבית עם חצר ולבעלים שאוהבים פעילות.",
  }),
  listing({
    id: "cat-1",
    name: "חתול בריטי",
    type: "חתול",
    category: "חתולים",
    location: "ירושלים",
    age: "2.5 חודשים",
    breed: "בריטי קצר שיער",
    gender: "נקבה",
    hasCertificate: true,
    price: "2,200 ₪",
    image: "/listings/british-cat.jpg",
    description:
      "גורת חתולים בריטית רכה ומתוקה, מחוסנת ומוכנה לבית חדש.",
  }),
  listing({
    id: "cat-2",
    name: "חתול פרסי",
    type: "חתול",
    category: "חתולים",
    location: "רמת גן",
    age: "1 שנה",
    breed: "פרסי",
    gender: "זכר",
    price: "1,800 ₪",
    image: "/listings/persian-cat.jpg",
    description: "חתול פרסי רגוע, רגיל לדירה ומסתדר מצוין עם בני בית.",
  }),
  listing({
    id: "horse-1",
    name: "סוס צעיר",
    type: "סוס",
    category: "סוסים",
    location: "חיפה",
    age: "2 שנים",
    breed: "ערבי",
    gender: "זכר",
    hasCertificate: true,
    price: "12,000 ₪",
    image: "/listings/arabian-horse.jpg",
    description: "סוס ערבי צעיר עם מבנה יפה. מתאים לרכיבה ולגידול.",
  }),
  listing({
    id: "bird-1",
    name: "תוכי צבעוני",
    type: "ציפור",
    category: "ציפורים",
    location: "רמת גן",
    age: "8 חודשים",
    breed: "קוקטייל",
    gender: "זכר",
    price: "250 ₪",
    image: "/listings/cockatiel.jpg",
    description: "תוכי קוקטייל ידידותי, רגיל לכלוב גדול ולתשומת לב.",
  }),
  listing({
    id: "bird-2",
    name: "זוג יונים",
    type: "ציפור",
    category: "ציפורים",
    location: "אשדוד",
    age: "1 שנה",
    breed: "יונת נוי",
    gender: "זוג",
    price: "180 ₪",
    image: "/listings/doves.jpg",
    description: "זוג יוני נוי בריאות, מתאימות לגינה או למרפסת סגורה.",
  }),
  listing({
    id: "fish-1",
    name: "דג נוי",
    type: "דג",
    category: "דגים",
    location: "נתניה",
    age: "6 חודשים",
    breed: "גולדפיש",
    price: "30 ₪",
    image: "/listings/goldfish.jpg",
    description: "דגי נוי לאקווריום ביתי. נמכרים לבד או כקבוצה קטנה.",
  }),
  listing({
    id: "fish-2",
    name: "דגי קוי",
    type: "דג",
    category: "דגים",
    location: "הרצליה",
    age: "1 שנה",
    breed: "קוי",
    price: "120 ₪",
    image: "/listings/koi.jpg",
    description: "דגי קוי צבעוניים לבריכת נוי. בריאים ומותאמים לאקלים מקומי.",
  }),
  listing({
    id: "rabbit-1",
    name: "ארנב ננסי",
    type: "ארנב",
    category: "ארנבים",
    location: "ראשון לציון",
    age: "4 חודשים",
    breed: "ננסי הולנדי",
    gender: "נקבה",
    price: "350 ₪",
    image: "/listings/netherland-dwarf.jpg",
    description: "ארנבת ננסית עדינה, רגילה לידיים ומתאימה לילדים בהשגחה.",
  }),
  listing({
    id: "rabbit-2",
    name: "ארנב לופ",
    type: "ארנב",
    category: "ארנבים",
    location: "פתח תקווה",
    age: "6 חודשים",
    breed: "הולנד לופ",
    gender: "זכר",
    price: "420 ₪",
    image: "/listings/lop-rabbit.jpg",
    description: "ארנב לופ עם אוזניים שמוטות, שקט וחברותי.",
  }),
  listing({
    id: "reptile-1",
    name: "לטאה מיוחדת",
    type: "זוחל",
    category: "זוחלים",
    location: "פתח תקווה",
    age: "1 שנה",
    breed: "גקו מנומר",
    gender: "זכר",
    price: "600 ₪",
    image: "/listings/leopard-gecko.jpg",
    description: "גקו מנומר בריא, כולל מידע בסיסי על תנאי גידול.",
  }),
  listing({
    id: "chicken-1",
    name: "תרנגולות",
    type: "עופות",
    category: "תרנגולות",
    location: "אשדוד",
    age: "7 חודשים",
    breed: "לגיהורן",
    price: "180 ₪",
    image: "/listings/hens.jpg",
    description: "תרנגולות מטילות לחצר ביתית. נמכרות כזוג או יותר.",
  }),
  listing({
    id: "farm-1",
    name: "חיות משק",
    type: "חיית משק",
    category: "חיות משק",
    location: "באר שבע",
    age: "1 שנה",
    breed: "עז",
    gender: "נקבה",
    price: "1,500 ₪",
    image: "/listings/goat.jpg",
    description: "עיזים צעירות למשק ביתי. מתאימות לחלב ולגידול.",
  }),
  listing({
    id: "small-1",
    name: "חיה קטנה",
    type: "חיה קטנה",
    category: "חיות קטנות",
    location: "הרצליה",
    age: "5 חודשים",
    breed: "שרקן",
    gender: "זכר",
    price: "200 ₪",
    image: "/listings/guinea-pig.jpg",
    description: "שרקן ידידותי, רגיל לכלוב מרווח ולמגע עדין.",
  }),
];

export const ADOPTION_PETS = [
  listing({
    id: "adopt-1",
    name: "כלב מחפש בית",
    type: "כלב",
    category: "כלבים",
    location: "תל אביב",
    age: "8 חודשים",
    breed: "מעורב",
    gender: "זכר",
    price: "לאימוץ",
    image: "/listings/adopt-dog.jpg",
    forAdoption: true,
    description:
      "כלב מתוק שמחפש בית לכל החיים. מחוסן, מסורס ומוכן לאימוץ אחראי.",
  }),
  listing({
    id: "adopt-2",
    name: "חתול מתוק",
    type: "חתול",
    category: "חתולים",
    location: "ירושלים",
    age: "1 שנה",
    breed: "מעורב",
    gender: "נקבה",
    price: "לאימוץ",
    image: "/listings/adopt-cat.jpg",
    forAdoption: true,
    description: "חתולה ביתית, מעוקרת ומחפשת ספה שקטה ומשפחה אוהבת.",
  }),
  listing({
    id: "adopt-3",
    name: "ארנב קטן",
    type: "ארנב",
    category: "ארנבים",
    location: "חיפה",
    age: "5 חודשים",
    breed: "ננסי",
    gender: "נקבה",
    price: "לאימוץ",
    image: "/listings/adopt-rabbit.jpg",
    forAdoption: true,
    description: "ארנבת קטנה שגדלה בבית ומחפשת כלוב גדול וידיים עדינות.",
  }),
  listing({
    id: "adopt-4",
    name: "תוכי צבעוני",
    type: "ציפור",
    category: "ציפורים",
    location: "רמת גן",
    age: "10 חודשים",
    breed: "קוקטייל",
    gender: "זכר",
    price: "לאימוץ",
    image: "/listings/adopt-bird.jpg",
    forAdoption: true,
    description: "תוכי חברותי שרגיל לאנשים ומחפש בית עם סבלנות וזמן.",
  }),
];

export const isPetMarketplaceCategory = (label) =>
  PET_CATEGORIES.some((category) => category.name === label);

export const getCategoryBySlug = (slug) =>
  PET_CATEGORIES.find((category) => category.slug === slug);

export const getCategoryByName = (name) =>
  PET_CATEGORIES.find((category) => category.name === name);

export const getListingsByCategory = (categoryName) =>
  PET_LISTINGS.filter((item) => item.category === categoryName);

export const getAdDisplayName = (ad) =>
  ad?.name ||
  ad?.title ||
  ad?.breed ||
  ad?.seed_type ||
  ad?.accessory ||
  ad?.category ||
  "מודעה";

export const getAdDisplayImage = (ad) =>
  ad?.image || ad?.photos?.[0] || "/hero-pets.png";

/** Adoption listings are always free to publish and renew — never charge for them. */
export const ADOPTION_IS_ALWAYS_FREE = true;

export const isAdoptionListing = (ad) => {
  if (!ad) return false;
  if (ad.forAdoption) return true;
  const price = String(ad.price ?? "").trim();
  return price === "לאימוץ" || price === "אימוץ";
};

export const formatListingAge = (ad) => {
  if (!ad) return "";
  if (ad.age) return ad.age;

  if (typeof ad.ageInMonths === "number") {
    const years = Math.floor(ad.ageInMonths / 12);
    const months = ad.ageInMonths % 12;
    if (years && months) {
      const yearLabel = years === 1 ? "שנה" : `${years} שנים`;
      return `${yearLabel} ו-${months} חודשים`;
    }
    if (years) return years === 1 ? "שנה" : `${years} שנים`;
    return `${months} חודשים`;
  }

  const years = Number(ad.ageYears) || 0;
  const months = Number(ad.ageMonths) || 0;
  if (!years && !months) return "";
  if (years && months) {
    const yearLabel = years === 1 ? "שנה" : `${years} שנים`;
    return `${yearLabel} ו-${months} חודשים`;
  }
  if (years) return years === 1 ? "שנה" : `${years} שנים`;
  return `${months} חודשים`;
};

export const formatListingPrice = (ad) => {
  if (isAdoptionListing(ad)) return "לאימוץ";
  if (ad?.price === undefined || ad?.price === null || ad?.price === "") return "";
  if (typeof ad.price === "string" && (ad.price.includes("₪") || ad.price.includes("אימוץ"))) {
    return ad.price;
  }
  return `₪${ad.price}`;
};

export const getListingType = (ad) =>
  ad?.type || getCategoryByName(ad?.category)?.type || ad?.category || "";

export const normalizeMarketplaceAd = (ad) => {
  const name = getAdDisplayName(ad);
  const image = getAdDisplayImage(ad);
  const forAdoption = isAdoptionListing(ad);

  return {
    ...ad,
    name,
    title: ad.title || name,
    image,
    photos: ad.photos?.length ? ad.photos : [image],
    type: getListingType(ad),
    age: formatListingAge(ad),
    price: formatListingPrice(ad),
    forAdoption,
    source: ad.source || "firebase",
  };
};

export const mergeMarketplaceListings = (liveAds = [], catalogAds = []) => {
  const normalizedLive = liveAds.map((ad) =>
    normalizeMarketplaceAd({ ...ad, source: ad.source || "firebase" })
  );
  const liveIds = new Set(normalizedLive.map((ad) => String(ad.id)));
  const catalog = catalogAds
    .map((ad) => normalizeMarketplaceAd({ ...ad, source: ad.source || "catalog" }))
    .filter((ad) => !liveIds.has(String(ad.id)));

  return [...normalizedLive, ...catalog];
};

export const getCatalogPool = ({ categoryName, adoptionOnly = false } = {}) => {
  if (adoptionOnly) return ADOPTION_PETS;
  if (categoryName) return getListingsByCategory(categoryName);
  return PET_LISTINGS;
};

export const getSimilarListings = (listingItem, limit = 6) => {
  if (!listingItem) return [];

  const pool = listingItem.forAdoption ? ADOPTION_PETS : PET_LISTINGS;

  return pool
    .filter(
      (item) =>
        item.id !== listingItem.id && item.category === listingItem.category
    )
    .slice(0, limit);
};

export const filterListings = (
  listings,
  { searchText = "", location = "", category = "" } = {}
) => {
  const text = searchText.trim().toLowerCase();

  return listings.filter((item) => {
    const matchesText =
      !text ||
      [item.name, item.title, item.type, item.category, item.location, item.breed, item.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text));

    const matchesLocation = !location || item.location === location;
    const matchesCategory = !category || item.category === category;

    return matchesText && matchesLocation && matchesCategory;
  });
};

export const getFavorites = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(
      localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]"
    );
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

export const isFavoriteListing = (id) =>
  getFavorites().some((item) => String(item.id) === String(id));

export const toggleFavoriteListing = (listingItem) => {
  const favorites = getFavorites();
  const exists = favorites.some(
    (item) => String(item.id) === String(listingItem.id)
  );
  const updated = exists
    ? favorites.filter((item) => String(item.id) !== String(listingItem.id))
    : [...favorites, listingItem];

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  }

  return !exists;
};
