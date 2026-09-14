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

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  const enabled = process.env.S4_PUBLIC_NATIVE_INTAKE_ENABLED === "true";
  const formKey = process.env.S4_PUBLIC_INTAKE_FORM_KEY?.trim() || "";
  const siteKey = process.env.S4_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

  if (req.method === "POST" && enabled) {
    return res.status(409).json({
      error: "Please reload the estimate form to use the current intake.",
    });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!enabled) {
    return res.status(200).json({ consentCaptureEnabled: false });
  }
  if (
    !/^[A-Za-z0-9_-]{32,120}$/.test(formKey) ||
    !/^[A-Za-z0-9_-]{10,200}$/.test(siteKey)
  ) {
    return res.status(503).json({ error: "Intake configuration unavailable" });
  }

  const host = publicHost(req);
  if (!PUBLIC_HOSTS.has(host)) {
    return res.status(403).json({
      error: "Public intake is unavailable on this hostname",
    });
  }
  try {
    const result = await fetch(
      `https://app.s4aiagency.com/api/forms/${encodeURIComponent(formKey)}`,
      {
        headers: { Accept: "application/json", Origin: `https://${host}` },
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!result.ok) {
      return res.status(503).json({ error: "Intake unavailable" });
    }
    const disclosures = await result.json();
    if (
      typeof disclosures.emailServiceDisclosure !== "string" ||
      !disclosures.emailServiceDisclosure.trim() ||
      typeof disclosures.smsServiceDisclosure !== "string" ||
      !disclosures.smsServiceDisclosure.trim()
    ) {
      return res.status(503).json({ error: "Intake disclosures unavailable" });
    }
    return res.status(200).json({
      consentCaptureEnabled: true,
      formKey,
      siteKey,
      emailServiceDisclosure: disclosures.emailServiceDisclosure,
      smsServiceDisclosure: disclosures.smsServiceDisclosure,
    });
  } catch {
    return res.status(503).json({ error: "Intake unavailable" });
  }
}
