export const defaultConciergeConfig = Object.freeze({
  phone: '+19843386483',
  phoneDisplay: '(984) 338-6483',
  email: 'Kyle@envisionlandscapingllc.com',
  googleReviews:
    'https://www.google.com/maps/search/?api=1&query=Envision%20Landscaping%20LLC&query_place_id=ChIJjRfUHps6RysRA6PtjRQlYYc',
  googleWriteReview:
    'https://search.google.com/local/writereview?placeid=ChIJjRfUHps6RysRA6PtjRQlYYc',
})

const serviceMatches = [
  {
    intent: 'lawn',
    label: 'Lawn maintenance',
    pattern: /\b(mow|mowing|grass|lawn|edge|edging|string trim|overgrown yard)\b/i,
  },
  {
    intent: 'commercial',
    label: 'Commercial lawn care',
    pattern: /\b(commercial|business|property manager|hoa|office|storefront|managed property)\b/i,
  },
  {
    intent: 'landscape-maintenance',
    label: 'Landscape maintenance',
    pattern: /\b(hedges?|shrubs?|prun(?:e|ing|ed)|weeds?|garden beds?|bed maintenance|landscape maintenance)\b/i,
  },
  {
    intent: 'cleanup',
    label: 'Spring and fall cleanup',
    pattern: /\b(leaf|leaves|cleanup|clean up|sticks?|branches?|storm debris|fall cleanup|spring cleanup)\b/i,
  },
  {
    intent: 'mulch',
    label: 'Mulch and pine straw',
    pattern: /\b(mulch|pine straw|pine-straw|bed material)\b/i,
  },
  {
    intent: 'planting',
    label: 'Design and planting',
    pattern: /\b(planting|plant flowers|tree planting|shrub installation|sod|landscape design|new bed)\b/i,
  },
  {
    intent: 'hardscape',
    label: 'Hardscaping and pavers',
    pattern: /\b(paver|patio|walkway|retaining wall|fire pit|driveway|outdoor kitchen|hardscape)\b/i,
  },
  {
    intent: 'holiday',
    label: 'Holiday lighting',
    pattern: /\b(holiday lights?|christmas lights?|roofline lights?|seasonal lights?|light installation)\b/i,
  },
]

const serviceResponses = {
  lawn: {
    text: 'Lawn maintenance can include recurring mowing, edging, string trimming, and blowing hard surfaces clean. For an overgrown lawn, send photos so Kyle can confirm the reset scope.',
    href: '/services/lawn-maintenance',
    label: 'View lawn maintenance',
  },
  commercial: {
    text: 'Commercial lawn care is scoped around the property, access, high-visibility areas, and operating schedule. Recurring grounds care, bed maintenance, and seasonal resets can be discussed together.',
    href: '/services/commercial-lawn-care',
    label: 'View commercial care',
  },
  'landscape-maintenance': {
    text: 'Landscape maintenance covers the details beyond mowing, including shrub and hedge trimming, garden-bed cleanup, edge definition, visible weed removal, and seasonal debris care.',
    href: '/services/landscape-maintenance',
    label: 'View landscape maintenance',
  },
  cleanup: {
    text: 'Seasonal cleanups can combine leaf clearing, small stick and storm-debris collection, garden-bed cleanup, and selected shrub or perennial cutbacks. The estimate depends on volume and access.',
    href: '/services/spring-fall-cleanups',
    label: 'View seasonal cleanups',
  },
  mulch: {
    text: 'Mulch and pine-straw work can include bed preparation, hardwood mulch or pine-straw installation, edge definition, even coverage, and cleanup of nearby hard surfaces.',
    href: '/services/mulch-pine-straw',
    label: 'View mulch and pine straw',
  },
  planting: {
    text: 'Design and planting projects can start with a landscape consultation, then move into trees, shrubs, flower or perennial beds, sod installation, or lawn repair based on the property.',
    href: '/services/landscape-design-planting',
    label: 'View design and planting',
  },
  hardscape: {
    text: 'Hardscape consultations can cover paver patios, walkways, retaining features, fire pits, driveways, and outdoor-living ideas. These projects normally require a property review before quoting.',
    href: '/services/hardscaping-pavers',
    label: 'View hardscaping',
  },
  holiday: {
    text: 'Holiday-lighting requests can include roofline lighting, tree and shrub accents, entry highlights, and a property-specific display plan. Kyle confirms current seasonal availability.',
    href: '/services/holiday-lighting',
    label: 'View holiday lighting',
  },
}

const action = (label, href) => ({ label, href })

export function normalizeMessage(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9@&+.'-]+/g, ' ')
    .trim()
}

export function detectService(value) {
  const input = normalizeMessage(value)
  return serviceMatches.find((service) => service.pattern.test(input)) || null
}

export function classifyIntent(value) {
  const input = normalizeMessage(value)
  if (!input) return 'empty'
  if (/(?:\bfire\b(?!\s*pit)|\b(power line|gas leak|medical emergency|dangerous tree|tree on (a )?(house|car|road))\b)/.test(input)) return 'urgent'
  if (/\b(cancel|reschedule|move|change).*(appointment|visit|service|booking)|\bappointment.*(cancel|reschedule|change)\b/.test(input)) return 'schedule-change'
  if (/\b(complaint|damage|problem with|not happy|missed|did not show|callback)\b/.test(input)) return 'customer-care'
  if (/\b(leave|write|post|add).*(google )?review|review.*(leave|write|post)\b/.test(input)) return 'leave-review'
  if (/\b(reviews?|ratings?|testimonials?|feedback)\b/.test(input)) return 'reviews'
  if (/\b(weather|rain|raining|storm delay|same day|today|available|availability|how soon|when can)\b/.test(input)) return 'availability'
  if (/\b(hour|open|close|closing|weekend|sunday|saturday)\b/.test(input)) return 'hours'
  if (/\b(serve|service area|my area|zip|city|location|raleigh|cary|apex|morrisville|fuquay|holly springs|durham|chapel hill)\b/.test(input)) return 'area'
  if (/\b(estimate|quote|cost|price|pricing|how much|budget)\b/.test(input)) return 'estimate'
  if (/\b(power wash(?:ing)?|pressure wash(?:ing)?|soft wash(?:ing)?|hard wash(?:ing)?|gutter clean(?:ing)?|roof clean(?:ing)?|irrigation|sprinkler|fertiliz(?:e|ing|ation)|pest control|snow removal|tree removal|stump grind(?:ing)?|grading)\b/.test(input)) return 'unlisted-service'
  if (/\b(coupons?|discounts?|specials?|promos?|promotions?|offer code|current offer|deals?)\b/.test(input)) return 'offers'
  if (/\b(invoice|bill|billing|payment|pay|deposit|financing|refund)\b/.test(input)) return 'billing'
  if (/\b(license|licensed|insured|insurance|certificate|warranty|guarantee)\b/.test(input)) return 'credentials'
  if (/\b(photos?|pictures?|portfolio|gallery|before and after|work examples)\b/.test(input)) return 'gallery'
  if (/\b(job|career|hiring|application|work for)\b/.test(input)) return 'careers'
  if (/\b(email|e mail|contact|call|phone|text|message|reach kyle)\b/.test(input)) return 'contact'
  if (/\b(who owns|owner|kyle|about|company story)\b/.test(input)) return 'about'
  const service = detectService(input)
  if (service) return service.intent
  if (/\b(service|services|what do you do|help me choose|not sure|landscaping|yard work)\b/.test(input)) return 'service-picker'
  if (/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(input)) return 'greeting'
  if (/\b(thanks|thank you|appreciate|perfect|great)\b/.test(input)) return 'thanks'
  return 'fallback'
}

export function responseFor(value, config = defaultConciergeConfig) {
  const intent = classifyIntent(value)
  const contactActions = [
    action('Call Kyle', `tel:${config.phone}`),
    action('Email Kyle', `mailto:${config.email}`),
  ]

  if (serviceResponses[intent]) {
    const service = serviceResponses[intent]
    return {
      intent,
      text: service.text,
      actions: [action(service.label, service.href), action('Request an estimate', '/contact')],
    }
  }

  switch (intent) {
    case 'empty':
      return { intent, text: 'Type a question or choose one of the suggested options below.', actions: [] }
    case 'greeting':
      return {
        intent,
        text: 'Hi — I can help you choose a service, check the published service area, prepare an estimate request, or reach Kyle directly. What does the property need?',
        actions: [action('Browse services', '/services'), action('Request an estimate', '/contact')],
      }
    case 'thanks':
      return {
        intent,
        text: 'You’re welcome. If you are ready, I can help prepare the next step for Kyle.',
        actions: [action('Request an estimate', '/contact'), action('Email Kyle', `mailto:${config.email}`)],
      }
    case 'service-picker':
      return {
        intent,
        text: 'Envision’s published services are lawn maintenance, commercial lawn care, landscape maintenance, spring and fall cleanups, mulch and pine straw, design and planting, hardscaping and pavers, and holiday lighting. Tell me what you see in the yard and I’ll narrow it down.',
        actions: [action('Compare all services', '/services'), action('See completed work', '/gallery')],
      }
    case 'area':
      return {
        intent,
        text: 'The published service area includes Raleigh, Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Chapel Hill. Kyle confirms the exact address, travel fit, and project scope before scheduling.',
        actions: [action('Check service areas', '/service-areas'), action('Ask Kyle about my address', `mailto:${config.email}?subject=${encodeURIComponent('Service-area question')}`)],
      }
    case 'estimate':
      return {
        intent,
        text: 'I can prepare a project summary for text or email. First, what service or yard problem do you need help with?',
        actions: [action('View the estimate form', '/contact')],
        startEstimate: true,
      }
    case 'availability':
      return {
        intent,
        text: 'I cannot see Kyle’s live route, weather decisions, or appointment calendar. Contact Envision for the latest availability or an update on an existing visit.',
        actions: contactActions,
      }
    case 'hours':
      return {
        intent,
        text: 'Envision’s published hours are Monday through Sunday, 8:00 AM to 12:00 AM. Live response and service availability still need to be confirmed directly.',
        actions: contactActions,
      }
    case 'reviews':
      return {
        intent,
        text: 'You can read Envision’s current customer feedback on the verified Google Maps profile or browse the five-star review highlights on this site.',
        actions: [action('Open Google reviews', config.googleReviews), action('Reviews on this site', '/reviews')],
      }
    case 'leave-review':
      return {
        intent,
        text: 'Thank you for supporting Envision. Google may ask you to sign in before you can leave a review.',
        actions: [action('Leave a Google review', config.googleWriteReview), action('Open Google profile', config.googleReviews)],
      }
    case 'offers':
      return {
        intent,
        text: 'The site currently shows WELCOME15 for 15% off a first lawn-care service package and SEASON50 for $50 off a seasonal maintenance package. Kyle must confirm eligibility, conditions, and availability.',
        actions: [action('View current offers', '/#special-offers'), action('Ask about eligibility', `mailto:${config.email}?subject=${encodeURIComponent('Offer eligibility question')}`)],
      }
    case 'schedule-change':
      return {
        intent,
        text: 'I cannot access or change the live schedule. Contact Kyle directly with your name, property address, and current appointment details.',
        actions: contactActions,
      }
    case 'customer-care':
      return {
        intent,
        text: 'I’m sorry the visit needs attention. I cannot view customer records, so please contact Kyle with the property address, service date, and a short description. Photos are helpful by email.',
        actions: [action('Email Kyle', `mailto:${config.email}?subject=${encodeURIComponent('Service follow-up')}`), action('Call Kyle', `tel:${config.phone}`)],
      }
    case 'billing':
      return {
        intent,
        text: 'I cannot access invoices, balances, payment methods, financing, or refunds. Kyle can answer account-specific questions securely.',
        actions: contactActions,
      }
    case 'credentials':
      return {
        intent,
        text: 'The website does not publish documentation for licensing, insurance, warranties, or certificates. Ask Kyle for the current documents or terms needed for your property.',
        actions: contactActions,
      }
    case 'gallery':
      return {
        intent,
        text: 'The gallery shows Envision lawn, landscape, cleanup, planting, hardscape, and seasonal work. For a project similar to yours, email photos of the property to Kyle.',
        actions: [action('Open the gallery', '/gallery'), action('Email property photos', `mailto:${config.email}`)],
      }
    case 'careers':
      return {
        intent,
        text: 'The website does not list current openings. Email Kyle with your name, experience, availability, and the kind of work you are seeking.',
        actions: [action('Email Kyle', `mailto:${config.email}?subject=${encodeURIComponent('Employment inquiry')}`)],
      }
    case 'contact':
      return {
        intent,
        text: `You can call or text ${config.phoneDisplay}, email ${config.email}, or use the contact page to prepare a detailed request.`,
        actions: [...contactActions, action('Contact page', '/contact')],
      }
    case 'about':
      return {
        intent,
        text: 'Envision Landscaping LLC is an owner-led Raleigh-area lawn and landscape company. Kyle Young works directly with customers from the first conversation through the project walkthrough.',
        actions: [action('About Envision', '/about'), action('Contact Kyle', '/contact')],
      }
    case 'unlisted-service':
      return {
        intent,
        text: 'That work is not in Envision’s current published service list, so I do not want to promise it. Kyle can confirm whether it fits the crew or whether you need a different specialist.',
        actions: contactActions,
      }
    case 'urgent':
      return {
        intent,
        text: 'This website is not an emergency service. If anyone is in danger or a utility line is involved, move to a safe location and contact 911 or the appropriate utility first. Contact Kyle only after the immediate hazard is handled.',
        actions: [action('Call Envision', `tel:${config.phone}`)],
      }
    default:
      return {
        intent: 'fallback',
        text: 'I may not have enough verified information to answer that correctly. Rephrase it with the service, city, and property need, or contact Kyle for a direct answer.',
        actions: [action('Browse services', '/services'), ...contactActions],
      }
  }
}

export function buildEstimateHandoff(quote, config = defaultConciergeConfig) {
  const service = String(quote.service || 'Not specified').trim()
  const location = String(quote.location || 'Not specified').trim()
  const details = String(quote.details || 'Not specified').trim()
  const message = [
    'Hi Envision Landscaping, I would like a free estimate.',
    `Service or yard need: ${service}`,
    `Property location: ${location}`,
    `Project details and timing: ${details}`,
  ].join('\n')

  return {
    summary: `I prepared a request for ${service} at ${location}. Review the message and add your name, phone number, photos, or measurements before sending it.`,
    actions: [
      action('Send by text', `sms:${config.phone}?body=${encodeURIComponent(message)}`),
      action(
        'Email Kyle',
        `mailto:${config.email}?subject=${encodeURIComponent(`Estimate request: ${service}`)}&body=${encodeURIComponent(message)}`,
      ),
      action('Open full estimate form', '/contact'),
    ],
  }
}

function initConcierge() {
  const root = document.querySelector('[data-concierge]')
  if (!root) return

  const config = {
    phone: root.dataset.phone || defaultConciergeConfig.phone,
    phoneDisplay: root.dataset.phoneDisplay || defaultConciergeConfig.phoneDisplay,
    email: root.dataset.email || defaultConciergeConfig.email,
    googleReviews: root.dataset.googleReviews || defaultConciergeConfig.googleReviews,
    googleWriteReview: root.dataset.googleWriteReview || defaultConciergeConfig.googleWriteReview,
  }
  const launcher = root.querySelector('.concierge-launcher')
  const panel = root.querySelector('.concierge-panel')
  const closeButton = root.querySelector('.concierge-close')
  const log = root.querySelector('[data-concierge-log]')
  const form = root.querySelector('[data-concierge-form]')
  const input = form?.querySelector('input')
  const suggestions = root.querySelector('[data-concierge-suggestions]')
  const state = { quoteStep: null, quote: {} }
  let closeTimer

  if (!launcher || !panel || !closeButton || !log || !form || !input) return

  const appendMessage = (role, text, actions = []) => {
    const message = document.createElement('article')
    message.className = `concierge-message concierge-message-${role}`
    const paragraph = document.createElement('p')
    paragraph.textContent = text
    message.append(paragraph)

    if (actions.length) {
      const actionRow = document.createElement('div')
      actionRow.className = 'concierge-message-actions'
      actions.forEach((item) => {
        const link = document.createElement('a')
        link.href = item.href
        link.textContent = item.label
        if (/^https?:/i.test(item.href)) {
          link.target = '_blank'
          link.rel = 'noopener'
        }
        actionRow.append(link)
      })
      message.append(actionRow)
    }

    log.append(message)
    log.scrollTop = log.scrollHeight
  }

  const resetQuote = () => {
    state.quoteStep = null
    state.quote = {}
  }

  const handleQuoteStep = (rawMessage) => {
    const normalized = normalizeMessage(rawMessage)
    if (/\b(cancel|stop|start over|never mind|nevermind)\b/.test(normalized)) {
      resetQuote()
      return {
        text: 'The estimate draft was cleared. What else can I help with?',
        actions: [action('Browse services', '/services')],
      }
    }

    if (state.quoteStep === 'service') {
      state.quote.service = rawMessage.trim()
      state.quoteStep = 'location'
      return {
        text: 'What city, ZIP code, or property address should Kyle use to check the service area?',
        actions: [action('See published service areas', '/service-areas')],
      }
    }

    if (state.quoteStep === 'location') {
      state.quote.location = rawMessage.trim()
      state.quoteStep = 'details'
      return {
        text: 'What should be done, how large is the area, and when are you hoping to have it completed? Mention access issues or visible debris too.',
        actions: [],
      }
    }

    state.quote.details = rawMessage.trim()
    const handoff = buildEstimateHandoff(state.quote, config)
    resetQuote()
    return { text: handoff.summary, actions: handoff.actions }
  }

  const answerMessage = (rawMessage) => {
    appendMessage('user', rawMessage)

    if (state.quoteStep) {
      const result = handleQuoteStep(rawMessage)
      window.setTimeout(() => appendMessage('bot', result.text, result.actions), 180)
      return
    }

    const answer = responseFor(rawMessage, config)
    if (answer.startEstimate) {
      const matchedService = detectService(rawMessage)
      if (matchedService) {
        state.quote.service = matchedService.label
        state.quoteStep = 'location'
        answer.text = `I’ll start the request with ${matchedService.label}. What city, ZIP code, or property address should Kyle check?`
      } else {
        state.quoteStep = 'service'
      }
    }
    window.setTimeout(() => appendMessage('bot', answer.text, answer.actions), 180)
  }

  const setOpen = (isOpen) => {
    window.clearTimeout(closeTimer)
    launcher.setAttribute('aria-expanded', String(isOpen))
    launcher.setAttribute(
      'aria-label',
      isOpen ? 'Close Envision service assistant' : 'Open Envision service assistant',
    )
    if (isOpen) {
      panel.hidden = false
      window.requestAnimationFrame(() => panel.classList.add('is-open'))
      window.setTimeout(() => input.focus(), 120)
      return
    }
    panel.classList.remove('is-open')
    closeTimer = window.setTimeout(() => {
      panel.hidden = true
    }, 240)
    launcher.focus()
  }

  launcher.addEventListener('click', () => setOpen(launcher.getAttribute('aria-expanded') !== 'true'))
  closeButton.addEventListener('click', () => setOpen(false))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false)
  })

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const value = input.value.trim()
    if (!value) return
    input.value = ''
    answerMessage(value)
  })

  suggestions?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-concierge-prompt]')
    if (!button) return
    answerMessage(button.dataset.conciergePrompt || button.textContent || '')
  })

  appendMessage(
    'bot',
    'Hi — I’m Envision’s website concierge. Tell me what is happening at the property, and I’ll point you to the right service or help prepare a request for Kyle.',
    [action('Browse services', '/services'), action('Email Kyle', `mailto:${config.email}`)],
  )
}

if (typeof document !== 'undefined') initConcierge()
