/** Buyer-facing store order status + delivery journey. */

export const PURCHASE_STATUS = {
  AWAITING_PAYMENT: "awaiting_payment",
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SENT: "sent",
  DELIVERED: "delivered",
  CANCEL: "cancel",
};

export const PURCHASE_STATUS_LABELS = {
  [PURCHASE_STATUS.AWAITING_PAYMENT]: "ממתין לתשלום",
  [PURCHASE_STATUS.PENDING]: "ממתין לאישור",
  [PURCHASE_STATUS.CONFIRMED]: "בהכנה למשלוח",
  [PURCHASE_STATUS.SENT]: "בדרך אליכם",
  [PURCHASE_STATUS.DELIVERED]: "הגיע הביתה",
  [PURCHASE_STATUS.CANCEL]: "בוטל",
};

export const PURCHASE_STATUS_HINTS = {
  [PURCHASE_STATUS.AWAITING_PAYMENT]: "השלימו תשלום כדי שנתחיל להכין את ההזמנה.",
  [PURCHASE_STATUS.PENDING]: "קיבלנו את ההזמנה — מאשרים ומכינים למשלוח.",
  [PURCHASE_STATUS.CONFIRMED]: "ההזמנה אושרה ואורזים את המוצרים.",
  [PURCHASE_STATUS.SENT]: "השליח בדרך — המשלוח בדרך עד הדלת.",
  [PURCHASE_STATUS.DELIVERED]: "המשלוח הגיע. תודה שקניתם ב־Petzo!",
  [PURCHASE_STATUS.CANCEL]: "ההזמנה בוטלה. אפשר לפנות אלינו אם צריך עזרה.",
};

/** Ordered journey from checkout to doorstep (excludes cancel). */
export const PURCHASE_JOURNEY_STEPS = [
  {
    id: "received",
    label: "הזמנה התקבלה",
    shortLabel: "התקבלה",
    statuses: [
      PURCHASE_STATUS.AWAITING_PAYMENT,
      PURCHASE_STATUS.PENDING,
    ],
  },
  {
    id: "preparing",
    label: "בהכנה למשלוח",
    shortLabel: "בהכנה",
    statuses: [PURCHASE_STATUS.CONFIRMED],
  },
  {
    id: "shipping",
    label: "בדרך אליכם",
    shortLabel: "בדרך",
    statuses: [PURCHASE_STATUS.SENT],
  },
  {
    id: "home",
    label: "הגיע הביתה",
    shortLabel: "בבית",
    statuses: [PURCHASE_STATUS.DELIVERED],
  },
];

export const getPurchaseStatusLabel = (status) =>
  PURCHASE_STATUS_LABELS[status] || "סטטוס לא ידוע";

export const getPurchaseStatusHint = (status) =>
  PURCHASE_STATUS_HINTS[status] || "";

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
