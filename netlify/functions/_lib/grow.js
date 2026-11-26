/** Grow (Meshulam) Light API helpers for Netlify functions. */

const GROW_HOSTS = {
  sandbox: "https://sandbox.meshulam.co.il/api/light/server/1.0",
  live: "https://secure.meshulam.co.il/api/light/server/1.0",
};

/** Grow rejects many special characters — keep letters, digits, spaces, basic punctuation. */
const sanitizeGrowText = (value = "", { max = 120 } = {}) =>
  String(value || "")
    .replace(/[^\p{L}\p{N}\s.\-_/]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

const getGrowConfig = () => {
  const userId = process.env.GROW_USER_ID || "";
  const pageCode = process.env.GROW_PAGE_CODE || "";
  const apiKey = process.env.GROW_API_KEY || "";
  const envName = (process.env.GROW_ENV || "sandbox").toLowerCase();
  const baseUrl = GROW_HOSTS[envName] || GROW_HOSTS.sandbox;

  return {
    userId,
    pageCode,
    apiKey,
    envName,
    baseUrl,
    configured: Boolean(userId && pageCode),
  };
};

const appendForm = (form, key, value) => {
  if (value === undefined || value === null || value === "") return;
  form.append(key, String(value));
};

const postGrowForm = async (endpoint, fields) => {
  const { baseUrl } = getGrowConfig();
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => appendForm(form, key, value));

  const response = await fetch(`${baseUrl}/${endpoint}`, {
    method: "POST",
    body: form,
  });

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (_error) {
    throw new Error(`Grow returned non-JSON: ${text.slice(0, 200)}`);
  }
  return json;
};

const createGrowPaymentProcess = async ({
  sum,
  fullName,
  phone,
  email,
  description,
  successUrl,
  cancelUrl,
  notifyUrl,
  orderId,
}) => {
  const { userId, pageCode, apiKey } = getGrowConfig();
  if (!userId || !pageCode) {
    const error = new Error("Grow is not configured");
    error.code = "grow_not_configured";
    throw error;
  }

  const fields = {
    pageCode,
    userId,
    sum: Number(sum).toFixed(2),
    chargeType: 1,
    successUrl,
    cancelUrl,
    notifyUrl,
    description: sanitizeGrowText(description, { max: 80 }) || "Petzo store order",
    "pageField[fullName]": sanitizeGrowText(fullName) || "Petzo Customer",
    "pageField[phone]": String(phone || "").replace(/\D/g, "").slice(0, 15),
    "pageField[email]": sanitizeGrowText(email, { max: 80 }),
    cField1: sanitizeGrowText(orderId, { max: 64 }),
  };

  if (apiKey) fields.apiKey = apiKey;

  const result = await postGrowForm("createPaymentProcess", fields);
  if (String(result?.status) !== "1" || !result?.data?.url) {
    const message =
      result?.err?.message ||
      result?.err ||
      result?.data?.message ||
      "Grow createPaymentProcess failed";
    const error = new Error(typeof message === "string" ? message : JSON.stringify(message));
    error.code = "grow_create_failed";
    error.details = result;
    throw error;
  }

  return {
    url: result.data.url,
    processId: result.data.processId,
    processToken: result.data.processToken,
  };
};

const approveGrowTransaction = async (payload = {}) => {
  const { pageCode, apiKey } = getGrowConfig();
  const fields = {
    pageCode,
    ...payload,
  };
  if (apiKey) fields.apiKey = apiKey;
  return postGrowForm("approveTransaction", fields);
};

const getGrowPaymentProcessInfo = async ({ processId, processToken }) => {
  const { pageCode, apiKey } = getGrowConfig();
  const fields = { pageCode, processId, processToken };
  if (apiKey) fields.apiKey = apiKey;
  return postGrowForm("getPaymentProcessInfo", fields);
};

module.exports = {
  GROW_HOSTS,
  sanitizeGrowText,
  getGrowConfig,
  createGrowPaymentProcess,
  approveGrowTransaction,
  getGrowPaymentProcessInfo,
};
