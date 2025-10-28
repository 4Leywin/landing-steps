import { init, send } from "@emailjs/browser";

// Prefer environment vars (Vite): VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_xxx";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_xxx";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "public_key_xxx";

// Initialize with public key (safe to expose)
try {
  init(PUBLIC_KEY);
} catch (e) {
  // ignore init errors in environments where import.meta.env isn't available
  console.warn("EmailJS init failed or skipped:", e);
}

/**
 * Generic send wrapper. Returns the promise from EmailJS send.
 * templateParams: object with variables expected by your EmailJS template.
 * options: optional overrides for serviceId/templateId/publicKey
 */
export function sendEmail(templateParams = {}, options = {}) {
  const serviceId = options.serviceId || SERVICE_ID;
  const templateId = options.templateId || TEMPLATE_ID;
  const publicKey = options.publicKey || PUBLIC_KEY;
  return send(serviceId, templateId, templateParams, publicKey);
}

/**
 * Convenience method to send a VIP card email.
 * It forwards all fields present in formData so the EmailJS template can
 * reference them. Expected keys in formData: name, telefono, email, visits,
 * whatsapp, therapist, receptionist, comment, opinion, etc.
 * branding: { nombre }
 * recipientEmail: string
 */
export async function sendVipCardEmail(
  formData = {},
  branding = {},
  recipientEmail,
  options = {}
) {
  // normalize to simple values the template can use
  const safeData = Object.fromEntries(
    Object.entries(formData || {}).map(([k, v]) => [
      k,
      v == null ? "" : String(v),
    ])
  );

  const templateParams = {
    to_email: recipientEmail,
    brand_name: branding?.nombre || "",
    ...safeData,
  };

  return sendEmail(templateParams, options);
}

export default { sendEmail, sendVipCardEmail };
