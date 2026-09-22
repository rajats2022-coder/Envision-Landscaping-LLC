const FORMSPREE_ORIGIN = "https://formspree.io";
const FORM_ID_PATTERN = /^[A-Za-z0-9_-]{4,120}$/;

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

export function formspreeFields(data) {
  const firstName = clean(data.get("firstName"));
  const lastName = clean(data.get("lastName"));
  return {
    name: [firstName, lastName].filter(Boolean).join(" "),
    email: clean(data.get("email")).toLowerCase(),
    phone: normalizePhoneE164(data.get("phone")),
    service: clean(data.get("service")),
    message: buildEstimateSummary({
      service: data.get("service"),
      propertyLocation: data.get("propertyLocation"),
      timing: data.get("timing"),
      details: data.get("details"),
      sourcePage: data.get("sourcePage"),
    }),
    lead_source: "website",
    source_page: clean(data.get("sourcePage")),
    form_surface: "envision_estimate",
    website: clean(data.get("website")),
  };
}

function failureMessage(status) {
  if (status === 429) return "Too many requests were submitted. Please wait before trying again.";
  if (status >= 500 || status === 0) return "We could not confirm your request was saved. Your entries are still here; please try again or use the secure Jobber form below.";
  return "Review your details and try again. If the problem continues, use the secure Jobber form below.";
}

async function initialize() {
  const form = document.getElementById("envision-estimate-form");
  if (!form) return;
  const submit = form.querySelector('button[type="submit"]');
  const status = document.getElementById("estimate-form-status");
  const service = new URLSearchParams(location.search).get("service") || "";
  const serviceSelect = document.getElementById("estimate-service");
  if (service && [...serviceSelect.options].some((option) => option.value === service)) serviceSelect.value = service;
  document.getElementById("estimate-source-page").value = location.href.slice(0, 240);

  let configuration;
  function unavailable(message = "Online requests are temporarily unavailable. Please call (984) 338-6483 or use the secure Jobber form below.") {
    submit.disabled = true;
    status.textContent = message;
    status.className = "estimate-form-status error";
  }

  try {
    const response = await fetch("/api/leads", { headers: { Accept: "application/json" }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("configuration_unavailable");
    configuration = await response.json();
    if (configuration.formspreeEnabled !== true || !FORM_ID_PATTERN.test(configuration.formId || "")) throw new Error("configuration_unavailable");
    submit.disabled = false;
  } catch {
    unavailable();
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    let fields;
    try {
      fields = formspreeFields(new FormData(form));
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Review the form fields.";
      status.className = "estimate-form-status error";
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending request…";
    status.textContent = "Sending your request…";
    status.className = "estimate-form-status";
    try {
      const response = await fetch(`${FORMSPREE_ORIGIN}/f/${encodeURIComponent(configuration.formId)}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(fields),
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) {
        status.textContent = failureMessage(response.status);
        status.className = "estimate-form-status error";
        return;
      }
      window.s4TrackEvent?.("generate_lead", { form_id: "envision-estimate-form", service_intent: fields.service || "unspecified" });
      form.reset();
      document.getElementById("estimate-source-page").value = location.href.slice(0, 240);
      status.textContent = "Request received. Kyle will follow up to confirm fit, scope, and scheduling.";
      status.className = "estimate-form-status success";
    } catch {
      status.textContent = failureMessage(0);
      status.className = "estimate-form-status error";
    } finally {
      submit.textContent = "Send Estimate Request";
      submit.disabled = false;
    }
  });
}

if (typeof document !== "undefined") initialize();
