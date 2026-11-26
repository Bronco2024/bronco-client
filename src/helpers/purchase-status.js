/** Buyer-facing store order status + delivery journey experience. */

export const PURCHASE_STATUS = {
  AWAITING_PAYMENT: "awaiting_payment",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SENT: "sent",
  DELIVERED: "delivered",
  CANCEL: "cancel",
};

export const PURCHASE_STATUS_LABELS = {
  [PURCHASE_STATUS.AWAITING_PAYMENT]: "ממתינים לתשלום",
  [PURCHASE_STATUS.PENDING]: "קיבלנו את ההזמנה",
  [PURCHASE_STATUS.CONFIRMED]: "אורזים בשבילכם",
  [PURCHASE_STATUS.SENT]: "בדרך אליכם",
  [PURCHASE_STATUS.DELIVERED]: "הגיע הביתה",
  [PURCHASE_STATUS.CANCEL]: "בוטל",
};

export const PURCHASE_STATUS_HINTS = {
  [PURCHASE_STATUS.AWAITING_PAYMENT]:
    "עוד רגע קטן — אחרי התשלום מתחילה החוויה עד הדלת.",
  [PURCHASE_STATUS.PENDING]:
    "ההזמנה אצלנו. בודקים הכל לפני שיוצאים לדרך.",
  [PURCHASE_STATUS.CONFIRMED]:
    "המוצרים נארזים בזהירות — עוד מעט יוצאים אליכם.",
  [PURCHASE_STATUS.SENT]:
    "השליח בדרך. תכינו מקום ליד הדלת ☺",
  [PURCHASE_STATUS.DELIVERED]:
    "הגיע הביתה. תודה שבחרתם ב־Petzo — תהנו!",
  [PURCHASE_STATUS.CANCEL]:
    "ההזמנה בוטלה. אנחנו כאן אם תרצו להזמין שוב.",
};

/** Ordered story from checkout to doorstep (excludes cancel). */
export const PURCHASE_JOURNEY_STEPS = [
  {
    id: "received",
    label: "ההזמנה התקבלה",
    shortLabel: "התקבלה",
    storyTitle: "התחלתם את הדרך",
    storyBody: "קיבלנו את ההזמנה שלכם. מכאן אנחנו מלווים עד הבית.",
    statuses: [
      PURCHASE_STATUS.AWAITING_PAYMENT,
      PURCHASE_STATUS.PENDING,
    ],
  },
  {
    id: "preparing",
    label: "אורזים בשבילכם",
    shortLabel: "אורזים",
    storyTitle: "מכינים את החבילה",
    storyBody: "בודקים, אורזים ומכינים את המוצרים ליציאה.",
    statuses: [PURCHASE_STATUS.CONFIRMED],
  },
  {
    id: "shipping",
    label: "בדרך אליכם",
    shortLabel: "בדרך",
    storyTitle: "המשלוח בדרך",
    storyBody: "החבילה יצאה — בדרך עד הדלת שלכם.",
    statuses: [PURCHASE_STATUS.SENT],
  },
  {
    id: "home",
    label: "הגיע הביתה",
    shortLabel: "בבית",
    storyTitle: "הגענו הביתה",
    storyBody: "המוצרים אצלכם. זו החוויה שרצינו לתת — פשוט וחם.",
    statuses: [PURCHASE_STATUS.DELIVERED],
  },
];

export const getPurchaseStatusLabel = (status) =>
  PURCHASE_STATUS_LABELS[status] || "סטטוס לא ידוע";

export const getPurchaseStatusHint = (status) =>
  PURCHASE_STATUS_HINTS[status] || "";

export const getPurchaseJourneyStep = (status) => {
  const index = getPurchaseJourneyIndex(status);
  if (index < 0) return null;
  return PURCHASE_JOURNEY_STEPS[index] || null;
};

export const getPurchaseJourneyIndex = (status) => {
  if (status === PURCHASE_STATUS.CANCEL) return -1;
  const idx = PURCHASE_JOURNEY_STEPS.findIndex((step) =>
    step.statuses.includes(status)
  );
  return idx >= 0 ? idx : 0;
};

export const formatPurchaseDate = (purchasedAt) => {
  if (!purchasedAt) return "";
  const date =
    typeof purchasedAt?.toDate === "function"
      ? purchasedAt.toDate()
      : purchasedAt?.seconds
        ? new Date(purchasedAt.seconds * 1000)
        : new Date(purchasedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("he-IL");
};

export const getPurchaseThumbnails = (purchase = {}, limit = 3) => {
  const items = Array.isArray(purchase.items) ? purchase.items : [];
  return items
    .map((item) => item?.photos?.[0] || item?.image || "")
    .filter(Boolean)
    .slice(0, limit);
};
