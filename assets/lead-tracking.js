// Interaction signals only. Jobber submissions require provider-confirmed evidence.
const servicePaths = Object.freeze({
  '/services/landscape-design-planting': 'landscape-projects',
  '/services/spring-fall-cleanups': 'fall-cleanup',
  '/services/leaf-removal': 'leaf-removal',
  '/services/christmas-light-installation': 'christmas-lighting',
  '/services/lawn-maintenance': 'lawn-maintenance',
  '/services/landscape-maintenance': 'landscape-maintenance',
  '/services/mulch-pine-straw': 'mulch-pine-straw',
  '/services/aeration-overseeding': 'aeration-overseeding',
})
const intents = new Set(Object.values(servicePaths))
export const normalizeIntent = (value) => intents.has(value) ? value : 'unspecified'
const pathOf = (url) => url.pathname.replace(/\/$/, '') || '/'
const citySuffixes = new Set(['cary-nc', 'apex-nc', 'morrisville-nc', 'fuquay-varina-nc', 'holly-springs-nc', 'durham-nc', 'garner-nc'])
export const serviceIntentForPath = (path) => {
  const normalized = path.replace(/\/$/, '')
  if (servicePaths[normalized]) return servicePaths[normalized]
  const lastSlash = normalized.lastIndexOf('/')
  return citySuffixes.has(normalized.slice(lastSlash + 1))
    ? servicePaths[normalized.slice(0, lastSlash)] || 'unspecified'
    : 'unspecified'
}

export function interactionFor({ href, pageUrl, explicitIntent, rememberedIntent }) {
  let page, destination
  try {
    page = new URL(pageUrl)
    destination = new URL(href, page)
  } catch { return null }
  const intent = [explicitIntent, serviceIntentForPath(page.pathname), rememberedIntent]
    .map(normalizeIntent).find((value) => value !== 'unspecified') || 'unspecified'
  const sameSite = destination.origin === page.origin
  let event, interactionType
  if (destination.protocol === 'tel:') {
    event = 'phone_click'
    interactionType = 'phone_link'
  } else if (destination.protocol === 'https:' && destination.hostname === 'clienthub.getjobber.com') {
    event = 'estimate_start'
    interactionType = 'jobber_fallback'
  } else if (sameSite && pathOf(destination) === '/contact') {
    event = 'estimate_start'
    interactionType = 'contact_link'
  } else if (sameSite && destination.hash === '#jobber-request') {
    event = 'estimate_start'
    interactionType = 'request_anchor'
  } else { return null }
  // No URL, query string, free text, chat message, phone number, or form data.
  return { event, service_intent: intent, interaction_type: interactionType }
}

export function initLeadTracking(document, window) {
  window.dataLayer = window.dataLayer || []
  const storageKey = 'envision_service_intent'
  const remember = (value) => {
    if (normalizeIntent(value) === 'unspecified') return
    try { window.sessionStorage.setItem(storageKey, value) } catch { /* Optional storage. */ }
  }
  const readIntent = () => {
    try { return normalizeIntent(window.sessionStorage.getItem(storageKey)) } catch { return 'unspecified' }
  }
  remember(serviceIntentForPath(window.location.pathname))
  document.addEventListener('click', (clickEvent) => {
    const link = clickEvent.target?.closest?.('a[href]')
    if (!link) return
    const href = link.getAttribute('href') || ''
    const explicitIntent = link.closest('[data-service-intent]')?.dataset.serviceIntent
    const interaction = interactionFor({ href, pageUrl: window.location.href, explicitIntent, rememberedIntent: readIntent() })
    if (interaction) window.dataLayer.push(interaction)
    try {
      const destination = new URL(href, window.location.href)
      if (destination.origin === window.location.origin) remember(serviceIntentForPath(destination.pathname))
    } catch { /* Invalid links do not interrupt navigation. */ }
    remember(explicitIntent)
  })
}
