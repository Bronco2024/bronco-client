const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const getEmailConfig = () => ({
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
  adminEmail: process.env.REACT_APP_ADMIN_EMAIL,
});

export const canSendAdminEmail = () => {
  const { serviceId, templateId, publicKey, adminEmail } = getEmailConfig();
  return Boolean(serviceId && templateId && publicKey && adminEmail);
};

export const sendPendingAdEmailToAdmin = async ({ adId, ad = {} }) => {
  if (!canSendAdminEmail() || !adId) return false;

  const { serviceId, templateId, publicKey, adminEmail } = getEmailConfig();

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: adminEmail,
      ad_id: adId,
      ad_title: ad.title || ad.name || ad.breed || ad.category || "מודעה חדשה",
      ad_category: ad.category || "",
      ad_city: ad.location || "",
      ad_price: String(ad.price || ""),
    },
  };

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.ok;
};
