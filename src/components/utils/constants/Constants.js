import { PET_CATEGORIES } from "@/data/pets";
import ISRAEL_CITIES from "@/data/israel-cities";
import { SITE_NAME } from "@/data/site-config";

export { PET_CATEGORIES, ISRAEL_CITIES };

export const BREEDS = [
    "ערבי מערוב קו ",
    "ערבי מצרי",
    "פריזן",
    "קווטר",
    "טורבדריד",
    "סינגל פוט",
    "טנסי",
    "אנדלוסי",
    "אפלוסה",
    "מיזורי פוקס טרוטר",
    "פיינט",
    "פוני",
    "פוני וולש",
    "פוני שטלנד",
    "אחר",
];

export const CATEGORIES = [
    ...PET_CATEGORIES.map(({ path, name }) => ({ path, label: name })),
    { path: '/seeds', label: 'זרע' },
    { path: '/accessories', label: 'אביזרים' },
];

export const SERVICE_CATEGORIES = [
    { path: '/veterinarians', label: 'וטרינרים' },
    { path: '/transport', label: 'הסעות' },
    { path: '/boarding', label: 'פנסיון' },
    { path: '/pet-sitting', label: 'שמירה בבית' },
    { path: '/groomers', label: 'מספרות' },
    { path: '/training', label: 'אילוף והתנהגות' },
    { path: '/schools', label: 'בתי ספר' },
    { path: '/breeders', label: 'מפרזילים' },
    { path: '/exhibitors', label: 'מציגים' },
    { path: '/trips', label: 'טיולים' },
    { path: '/shows-and-competitions', label: 'תצוגות ותחרויות' },
    { path: '/our-products', label: 'חנות' },
];

export const EXTENDED_CATEGORIES = [
    ...CATEGORIES,
    ...SERVICE_CATEGORIES,
];

export const SERVICE_CATEGORY_LABELS = SERVICE_CATEGORIES.map(({ label }) => label);

export const isServiceCategory = (categoryName) =>
    SERVICE_CATEGORY_LABELS.includes(categoryName);

export const SEED_ANIMAL_TYPES = [
    "סוסים",
    "כלבים",
    "חתולים",
    "חיות משק",
];

export const SEED_TYPES_BY_ANIMAL = {
    "סוסים": ["ערבי מעורב קו", "ערבי מצרי", "אחר"],
    "כלבים": ["לברדור", "רועה גרמני", "גולדן רטריבר", "פודל", "אחר"],
    "חתולים": ["בריטי קצר שיער", "סקוטי", "סיאמי", "מיין קון", "אחר"],
    "חיות משק": ["בקר", "צאן", "עיזים", "אחר"],
};

export const SEEDS_TYPES = Array.from(
    new Set(Object.values(SEED_TYPES_BY_ANIMAL).flat())
);

export const getSeedTypesByAnimal = (animalType) =>
    SEED_TYPES_BY_ANIMAL[animalType] || SEEDS_TYPES;

export const SEMEN_TYPES = [
    "זרע טרי",
    "זרע קפוא"
]

export const ACCESSORIES_TPYES = [
    "קערות ומתקני שתייה",
    "רצועות וקולרים",
    "כלובים",
    "מיטות ומזרנים",
    "צעצועים",
    "תיבות נשיאה",
    "מוצרי טיפוח",
    "ביגוד לחיות",
    "מזרקות מים",
    "אקווריום ואביזרים",
    "טרריום ואביזרים לזוחלים",
    "אוכפים וציוד רכיבה",
    "קרון",
    "גדרות ושערים",
    "GPS ומעקב",
    "אחר",
]

export const DISTRICTS = {
    north: ["רמת הגולן", "ראש פינה ועמק החולה", "גליל עליון", "עכו נהריה והסביבה", " כרמיאל והסביבה", "קריות", "חיפה", "כנרת", "גליל תחתון", "נצרת - שפרעם"],
    hadera: ["יקנעם, טבעון", "עפולה והעמקים", "זכרון יעקב וחוף הכרמל", "קיסריה", "בית שאן", "רמות מנשה", "חדרה"],
    jordan: ["ישובי שומרון", "אריאל וישובי יהודה", "בקעת הירדן, ים המלח", "גוש עציון"],
    sharon: ["נתניה", "רעננה וכפר סבא", "הוד השרון", "רמת השרון והרצליה"],
    center: ["ראש העין", "בני ברק וגבעת שמואל", "פתח תקווה", "רמת גן וגבעתיים", "תל אביב יפו", "בקעת אונו", "חולון ובת ים", "שוהם", "ראשון לציון", "רמלה - לוד", "מודיעין"],
    shefla: ["נס ציונה ורחובות", "גדרה - יבנה", "אשדוד, אשקלון", "קרית גת", "השפלה"],
    jerusalem: ["הרי יהודה, מברשת", "ירושלים", "מעלה אדומים", "בית שמש"],
    south: ["באר שבע", "הנגב", "אילת"]
}

export const DISTRICT_NAMES = {
    north: "צפון",
    hadera: "חדרה",
    jordan: "יהודה ושומרון ובקעת הירדן",
    sharon: "שרון",
    center: "מרכז",
    shefla: "שפלה",
    jerusalem: "ירושלים",
    south: "דרום"
};

export const ADS_PER_PAGE = 25;

export const CARDS = [
    {
        title: `ברוכים הבאים ל-${SITE_NAME}`,
        text: "המקום שמחבר בין חיות מחמד, אנשים ושירותים — עם חיפוש חכם ומודעות מאושרות"
    },
    {
        title: "מכירה ואימוץ",
        text: "מצאו כלבים, חתולים וחיות נוספות למכירה או לאימוץ, במקום אחד ומסודר"
    },
    {
        title: "פרסום מודעה בקלות",
        text: "העלו מודעה עם תמונות, מחיר ופרטי קשר — והצוות יאשר אותה לפני הפרסום"
    },
    {
        title: "חיפוש לפי עיר וגזע",
        text: "סננו לפי סוג חיה, גזע, אזור, עיר ומחיר כדי להגיע בדיוק למה שאתם מחפשים"
    },
    {
        title: "שירותים מסביב לחיות",
        text: "וטרינרים, פנסיונים, מספרות ואביזרים — כל מה שצריך אחרי שמצאתם חבר חדש"
    },
    {
        title: "קהילה איכותית",
        text: "מפרסמים, מאמצים ואנשי מקצוע מכל הארץ במקום אחד"
    },
];

export const ABOUTUS_FEATURES = [
    {
        title: "חיות מחמד למכירה",
        subtitle: "כלבים, חתולים וכל סוגי החיות — במקום אחד ומסודר",
        icon: "paw",
    },
    {
        title: "אימוץ אחראי",
        subtitle: "חיות שמחכות לבית חם, עם פרטים ברורים ליצירת קשר",
        icon: "heart",
    },
    {
        title: "אבזרים וציוד",
        subtitle: "מזון, צעצועים וציוד לכל חיה",
        icon: "box",
    },
    {
        title: "וטרינרים מומלצים",
        subtitle: "שירותים רפואיים מקצועיים לחיות מחמד",
        icon: "stethoscope",
    },
    {
        title: "פנסיון וטיפול",
        subtitle: "מקומות אמינים לשהייה זמנית ולטיפול שוטף",
        icon: "house",
    },
    {
        title: "קהילה איכותית",
        subtitle: "מפרסמים, מאמצים ואנשי מקצוע מכל הארץ",
        icon: "users",
    },
    {
        title: "פרסום מודעות",
        subtitle: "העלו מודעה עם תמונות, מחיר ופרטי קשר בקלות",
        icon: "plus",
    },
    {
        title: "חנות ושירותים",
        subtitle: "כל מה שצריך אחרי שמצאתם חבר חדש",
        icon: "store",
    }
];