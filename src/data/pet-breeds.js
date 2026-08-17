export const PET_BREED_OTHER = "אחר";

export const PET_BREEDS_BY_CATEGORY = {
  כלבים: [
    "גולדן רטריבר",
    "לברדור",
    "רועה גרמני",
    "רועה בלגי",
    "האסקי",
    "מלטז",
    "פודל",
    "יורקשייר",
    "שיצו",
    "ביגל",
    "בוקסר",
    "דוברמן",
    "רוטווילר",
    "צ׳יוואה",
    "סאמויד",
    "פומרניין",
    "רועה אוסטרלי",
    "פיטבול",
    "דלמטי",
    "מעורב",
    PET_BREED_OTHER,
  ],
  חתולים: [
    "פרסי",
    "סיאמי",
    "מיין קון",
    "בריטי קצר שיער",
    "סקוטיש פולד",
    "ספינקס",
    "רגדול",
    "בנגל",
    "חתול מעורב",
    "מעורב",
    PET_BREED_OTHER,
  ],
  ציפורים: [
    "קוקטייל",
    "תוכי",
    "תוכי אפריקאי",
    "כנרית",
    "ציפור אהבה",
    "זרזיר",
    "יונת נוי",
    "נאנדאי",
    PET_BREED_OTHER,
  ],
  דגים: [
    "גולדפיש",
    "גופי",
    "מולי",
    "פלטי",
    "דג קרב",
    "טטרה",
    "דיסקוס",
    "קוי",
    PET_BREED_OTHER,
  ],
  ארנבים: [
    "ארנב ננסי",
    "ננסי הולנדי",
    "הולנד לופ",
    "אנגורה",
    "ליאון הד",
    "דאווג",
    PET_BREED_OTHER,
  ],
  זוחלים: [
    "גקו מנומר",
    "בוגר זיקן",
    "נחש תירס",
    "צב",
    "ירבוע",
    "איגואנה",
    PET_BREED_OTHER,
  ],
  תרנגולות: [
    "תרנגול",
    "תרנגולת",
    "לגהיהורן",
    "ברווז",
    "אוז",
    "הודו",
    PET_BREED_OTHER,
  ],
  "חיות משק": [
    "עז",
    "כבש",
    "פרה",
    "חמור",
    "גמל",
    "חזיר",
    PET_BREED_OTHER,
  ],
  "חיות קטנות": [
    "אוגר",
    "אוגר מונגולי",
    "שרקן",
    "צינצילה",
    "חולדה",
    "עכבר",
    PET_BREED_OTHER,
  ],
};

export const getPetBreeds = (categoryName) =>
  PET_BREEDS_BY_CATEGORY[categoryName] || [PET_BREED_OTHER];

export const resolvePetBreed = (breed, breedCustom) => {
  if (breed !== PET_BREED_OTHER) return breed;
  return breedCustom?.trim() || PET_BREED_OTHER;
};

export const isOtherBreedSelection = (breed) => breed === PET_BREED_OTHER;
