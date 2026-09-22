const PUBLIC_HOSTS = new Set([
  "envisionlandscapingllc.com",
  "www.envisionlandscapingllc.com",
]);

function publicHost(req) {
  const forwarded = req.headers?.["x-forwarded-host"];
  const raw =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded) ||
    req.headers?.host ||
    "";
  return raw.split(",", 1)[0].trim().toLowerCase().replace(/:\d+$/, "");
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const enabled = process.env.ENVISION_FORMSPREE_INTAKE_ENABLED === "true";
  const formId = process.env.ENVISION_FORMSPREE_FORM_ID?.trim() || "";
  if (!enabled) {
    return res.status(200).json({ formspreeEnabled: false });
  }
  if (!/^[A-Za-z0-9_-]{4,120}$/.test(formId)) {
    return res.status(503).json({ error: "Intake configuration unavailable" });
  }
  if (!PUBLIC_HOSTS.has(publicHost(req))) {
    return res.status(403).json({ error: "Public intake is unavailable on this hostname" });
  }
  return res.status(200).json({ formspreeEnabled: true, formId });
}
