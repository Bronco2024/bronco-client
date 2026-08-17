import { PET_CATEGORIES } from "@/data/pets";
import ISRAEL_CITIES from "@/data/israel-cities";

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

export const EXTENDED_CATEGORIES = [
    ...CATEGORIES,
    { path: '/boarding', label: 'פנסיון' },
    { path: '/groomers', label: 'מספרות' },
    { path: '/veterinarians', label: 'וטרינרים' },
    { path: '/exhibitors', label: 'מציגים' },
    { path: '/breeders', label: 'מפרזילים' },
    { path: '/schools', label: 'בתי ספר' },
    { path: '/trips', label: 'טיולים' },
    { path: '/shows-and-competitions', label: 'תצוגות ותחריות' },
    { path: '/our-products', label: 'חנות' },
]

export const SEEDS_TYPES = [
    "ערבי מעורב קו",
    "ערבי מצרי",
    "אחר"
];

export const SEMEN_TYPES = [
    "זרע טרי",
    "זרע קפוא"
]

export const ACCESSORIES_TPYES = [
    "קרון",
    "תאים",
    "עמדת בדיקה",
    "מכונת אוכל אוטומטית",
    "אוכפים",
    "קסדות",
    "בגדים לרכיבה",
    "מוצרי רכיבה",
    "אחר"
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
        title: "ברוכים הבאים למרכז הסוסים שלנו",
        text: "גלה הכל על סוסים — מכירה, גידול, ותכנון חוויות רכיבה בלתי נשכחות"
    },
    {
        title: "קנייה ומכירת סוסים",
        text: "התחל לעיין ולהעלות סוסים למכירה. התחבר עם מוכרים אמינים ומצא את הסוס המושלם שלך"
    },
    {
        title: "גידול סוסים",
        text: "גלו תוכניות גידול, קווים גנטיים, והתחברו עם מגדלים מנוסים באזורכם"
    },
    {
        title: "טיולי רכיבה על סוסים",
        text: "תכנן טיולי רכיבה ציוריים והרפתקאות, בין אם אתה מחפש רכיבת סוף שבוע או נופש מלא"
    },
    {
        title: "בתי ספר לרכיבה",
        text: "מצא בתי ספר לרכיבה מהמובילים ברמות שונות. למד ממדריכים מוסמכים ושפר את כישוריך"
    },
    {
        title: "תחרויות והופעות",
        text: "הישאר מעודכן על תחרויות סוסים ואירועים קרובים. הצג את כישוריך או תמוך במועדפים שלך"
    },
    {
        title: "חנויות וציוד",
        text: "גלו חנויות ואביזרים לרכיבה, ציוד סוסים וכל דבר אחר — הכל במקום אחד"
    },
    {
        title: "וטרינרים וסיוע רפואי",
        text: "מצא וטרינרים מוסמכים, קבל ייעוץ רפואי מקצועי, ושמור על בריאות הסוס שלך במיטבה"
    },
    {
        title: "צור קשר עם המוכרים ישירות",
        text: "השתמש בכלים המובנים שלנו כדי ליצור קשר בצורה בטוחה ומהירה עם המוכרים והספקים"
    },
]

export const ABOUTUS_FEATURES = [
    {
        title: "חיות מחמד למכירה",
        subtitle: "כלבים, חתולים וכל סוגי החיות — במקום אחד ומסודר",
        icon: require('@/assets/aboutus/horse.png')
    },
    {
        title: "אימוץ אחראי",
        subtitle: "חיות שמחכות לבית חם, עם פרטים ברורים ליצירת קשר",
        icon: require('@/assets/aboutus/trip.png')
    },
    {
        title: "אבזרים וציוד",
        subtitle: "מזון, צעצועים וציוד לכל חיה",
        icon: require('@/assets/aboutus/tool-box.png')
    },
    {
        title: "וטרינרים מומלצים",
        subtitle: "שירותים רפואיים מקצועיים לחיות מחמד",
        icon: require('@/assets/aboutus/veterinarian.png')
    },
    {
        title: "פנסיון וטיפול",
        subtitle: "מקומות אמינים לשהייה זמנית ולטיפול שוטף",
        icon: require('@/assets/aboutus/supplier.png')
    },
    {
        title: "קהילה איכותית",
        subtitle: "מפרסמים, מאמצים ואנשי מקצוע מכל הארץ",
        icon: require('@/assets/aboutus/competition.png')
    },
    {
        title: "פרסום מודעות",
        subtitle: "העלו מודעה עם תמונות, מחיר ופרטי קשר בקלות",
        icon: require('@/assets/aboutus/horse-rider.png')
    },
    {
        title: "חנות ושירותים",
        subtitle: "כל מה שצריך אחרי שמצאתם חבר חדש",
        icon: require('@/assets/aboutus/products.png')
    }
];