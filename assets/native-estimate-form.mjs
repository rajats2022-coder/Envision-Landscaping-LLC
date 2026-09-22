const INTAKE_ORIGIN = "https://app.s4aiagency.com";
const FORM_KEY_PATTERN = /^[A-Za-z0-9_-]{32,120}$/;
const SITE_KEY_PATTERN = /^[A-Za-z0-9_-]{10,200}$/;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizePhoneE164(value) {
  const raw = clean(value);
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (/^\+[1-9][0-9]{7,14}$/.test(raw)) return raw;
  throw new TypeError("Enter a valid phone number, including the area code.");
}

export function buildEstimateSummary(fields) {
  const summary = [
    ["Service requested", fields.service],
    ["Property location", fields.propertyLocation],
    ["Preferred timing", fields.timing],
    ["Project details", fields.details],
    ["Source page", fields.sourcePage],
  ]
    .filter(([, value]) => clean(value))
    .map(([label, value]) => `${label}: ${clean(value)}`)
    .join("\n");
  if (summary.length < 5 || summary.length > 4000) {
    throw new TypeError("Project details must use 5 to 4,000 characters.");
  }
  return summary;
}

function failureMessage(status, code) {
  if (status === 429) return "Too many requests were submitted. Please wait before trying again.";
  if (status === 409) return "This request conflicts with an earlier attempt. Refresh the page before sending a new request.";
  if (code === "captcha_invalid") return "The security check expired. Complete it again before submitting.";
  if (status === 503 || code === "network_error") return "We could not confirm your request was saved. Your entries are still here; complete the security check to retry safely.";
  return "Review your details and complete the security check before trying again.";
}

async function jsonReply(response) {
  try { return await response.json(); } catch { return {}; }
}

async function initialize() {
  const form = document.getElementById("envision-estimate-form");
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  const status = document.getElementById("estimate-form-status");
  const permissions = document.getElementById("reply-permissions");
  const emailDisclosure = document.getElementById("email-disclosure");
  const challenge = document.getElementById("turnstile-challenge");
  const service = new URLSearchParams(location.search).get("service") || "";
  const serviceSelect = document.getElementById("estimate-service");
  if (service && [...serviceSelect.options].some((option) => option.value === service)) serviceSelect.value = service;
  document.getElementById("estimate-source-page").value = location.href.slice(0, 240);

  let configuration;
  let captchaToken = "";
  let widgetId;
  let pendingFingerprint = "";
  let idempotencyKey = "";

  function unavailable(message = "Online requests are temporarily unavailable. Please call (984) 338-6483 or email Kyle@envisionlandscapingllc.com.") {
    submit.disabled = true;
    status.textContent = message;
    status.className = "estimate-form-status error";
  }

  try {
    const response = await fetch("/api/leads", { headers: { Accept: "application/json" }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("configuration_unavailable");
    configuration = await response.json();
    if (configuration.consentCaptureEnabled !== true || !FORM_KEY_PATTERN.test(configuration.formKey || "") || !SITE_KEY_PATTERN.test(configuration.siteKey || "") || !clean(configuration.emailServiceDisclosure)) throw new Error("configuration_unavailable");
    emailDisclosure.textContent = configuration.emailServiceDisclosure;
    permissions.hidden = false;
  } catch {
    unavailable();
    return;
  }

  try {
    await new Promise((resolve, reject) => {
      if (window.turnstile) return resolve();
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    widgetId = window.turnstile.render(challenge, {
      sitekey: configuration.siteKey,
      action: "client-lead",
      callback(token) {
        captchaToken = typeof token === "string" ? token : "";
        submit.disabled = !captchaToken;
        status.textContent = "";
        status.className = "estimate-form-status";
      },
      "expired-callback"() {
        captchaToken = "";
        submit.disabled = true;
        status.textContent = "The security check expired. Complete it again.";
        status.className = "estimate-form-status error";
      },
      "error-callback"() { unavailable(); },
    });
  } catch {
    unavailable();
    return;
  }

  form.addEventListener("input", () => {
    const fingerprint = new URLSearchParams(new FormData(form)).toString();
    if (pendingFingerprint && fingerprint !== pendingFingerprint) {
      pendingFingerprint = "";
      idempotencyKey = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!captchaToken || submit.disabled) return;
    const data = new FormData(form);
    const fingerprint = new URLSearchParams(data).toString();
    if (!idempotencyKey || pendingFingerprint !== fingerprint) {
      pendingFingerprint = fingerprint;
      idempotencyKey = crypto.randomUUID();
    }
    let payload;
    try {
      const phone = normalizePhoneE164(data.get("phone"));
      payload = {
        firstName: clean(data.get("firstName")),
        lastName: clean(data.get("lastName")),
        email: clean(data.get("email")).toLowerCase(),
        phone,
        message: buildEstimateSummary({ service: data.get("service"), propertyLocation: data.get("propertyLocation"), timing: data.get("timing"), details: data.get("details"), sourcePage: data.get("sourcePage") }),
        emailServiceConsent: data.get("emailServiceConsent") === "on",
        smsServiceConsent: data.get("smsServiceConsent") === "on",
        turnstileToken: captchaToken,
        idempotencyKey,
        website: clean(data.get("website")),
      };
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Review the form fields.";
      status.className = "estimate-form-status error";
      return;
    }

    submit.disabled = true;
    submit.textContent = "Saving request…";
    status.textContent = "Saving your request…";
    status.className = "estimate-form-status";
    try {
      const response = await fetch(`${INTAKE_ORIGIN}/api/forms/${encodeURIComponent(configuration.formKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      const reply = await jsonReply(response);
      if (response.status !== 202 || reply.accepted !== true) {
        status.textContent = failureMessage(response.status, reply.error || "");
        status.className = "estimate-form-status error";
        captchaToken = "";
        window.turnstile.reset(widgetId);
        return;
      }
      window.s4TrackEvent?.("generate_lead", { form_id: "envision-estimate-form", service_intent: clean(data.get("service")) || "unspecified" });
      form.reset();
      pendingFingerprint = "";
      idempotencyKey = "";
      captchaToken = "";
      window.turnstile.reset(widgetId);
      status.textContent = "Request saved. Kyle will follow up to confirm fit, scope, and scheduling.";
      status.className = "estimate-form-status success";
    } catch {
      status.textContent = failureMessage(0, "network_error");
      status.className = "estimate-form-status error";
      captchaToken = "";
      window.turnstile.reset(widgetId);
    } finally {
      submit.textContent = "Send Estimate Request";
      submit.disabled = !captchaToken;
    }
  });
}

if (typeof document !== "undefined") initialize();
