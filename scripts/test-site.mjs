import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = 3197
const baseUrl = `http://127.0.0.1:${port}`
const jobberEmbedId = '152dfe43-b7b8-4665-b208-c0f34dac1803-2057108'
const jobberEmbedCss = 'https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css'
const jobberEmbedScript =
  'https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js'
const jobberFormUrl =
  'https://clienthub.getjobber.com/client_hubs/152dfe43-b7b8-4665-b208-c0f34dac1803/public/work_request/embedded_work_request_form?form_id=2057108'
const server = spawn(process.execPath, ['serve.mjs'], {
  cwd: root,
  env: { ...process.env, ENVISION_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})

const extractBalancedElement = (html, startIndex, tagName) => {
  const tagPattern = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi')
  tagPattern.lastIndex = startIndex
  let depth = 0
  for (let match = tagPattern.exec(html); match; match = tagPattern.exec(html)) {
    const tag = match[0]
    if (tag.startsWith('</')) {
      depth -= 1
      if (depth === 0) {
        return { html: html.slice(startIndex, tagPattern.lastIndex), start: startIndex, end: tagPattern.lastIndex }
      }
    } else if (!tag.endsWith('/>')) {
      depth += 1
    }
  }
  return null
}

const findElementByClass = (html, className) => {
  const openingTagPattern = /<([a-z][\w:-]*)\b[^>]*>/gi
  for (let match = openingTagPattern.exec(html); match; match = openingTagPattern.exec(html)) {
    const classes = match[0].match(/\bclass\s*=\s*(["'])(.*?)\1/i)?.[2]?.split(/\s+/) || []
    if (!classes.includes(className)) continue
    return extractBalancedElement(html, match.index, match[1])
  }
  return null
}

const imageSources = (html) =>
  [...html.matchAll(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/gi)].map(([, , src]) => src)

const isRealFinishedProjectImage = (src) =>
  src.startsWith('/assets/images/projects/') && !/(?:^|[\/_\-.])(?:before|during)(?:[\/_\-.]|$)/i.test(src)

const expectedServices = [
  ['lawn-maintenance', 'Lawn Maintenance'],
  ['landscape-maintenance', 'Landscape Maintenance'],
  ['aeration-overseeding', 'Aeration & Overseeding'],
  ['spring-fall-cleanups', 'Spring & Fall Cleanups'],
  ['mulch-pine-straw', 'Mulch & Pine Straw'],
  ['landscape-design-planting', 'Design & Planting'],
]
const expectedAreas = [
  ['raleigh-nc', 'Raleigh'],
  ['cary-nc', 'Cary'],
  ['apex-nc', 'Apex'],
  ['morrisville-nc', 'Morrisville'],
  ['fuquay-varina-nc', 'Fuquay-Varina'],
  ['holly-springs-nc', 'Holly Springs'],
  ['durham-nc', 'Durham'],
  ['garner-nc', 'Garner'],
]
const expectedServicePath = (serviceSlug, areaSlug) =>
  areaSlug === 'raleigh-nc'
    ? `/services/${serviceSlug}`
    : `/services/${serviceSlug}/${areaSlug}`

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('Local server did not become ready')
}

try {
  await waitForServer()

  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
  const paths = [...sitemap.matchAll(/<loc>https:\/\/envisionlandscapingllc\.com([^<]*)<\/loc>/g)].map(
    ([, pathname]) => pathname || '/'
  )
  if (paths.length !== 64) throw new Error(`sitemap has ${paths.length} pages; expected 64`)

  let assertions = 0
  const pageHtml = new Map()
  for (const pathname of paths) {
    const response = await fetch(`${baseUrl}${pathname}`)
    const html = await response.text()
    pageHtml.set(pathname, html)
    if (response.status !== 200) throw new Error(`${pathname} returned ${response.status}`)
    if (!html.includes('<h1')) throw new Error(`${pathname} has no h1`)
    if (!html.includes('https://envisionlandscapingllc.com')) {
      throw new Error(`${pathname} is missing production URL metadata`)
    }
    if (!html.includes('/assets/concierge.js') || !html.includes('data-concierge')) {
      throw new Error(`${pathname} is missing the Envision concierge`)
    }
    if (!html.includes('mailto:Kyle@envisionlandscapingllc.com')) {
      throw new Error(`${pathname} is missing Kyle's email link`)
    }
    if (!html.includes('ChIJ3xWsRgz1rIkR7xzJrM3_Fy0')) {
      throw new Error(`${pathname} is missing the connected Google place ID`)
    }
    if (html.includes('ChIJjRfUHps6RysRA6PtjRQlYYc')) {
      throw new Error(`${pathname} contains the stale Google place ID`)
    }
    if (html.includes('sms:+19843386483')) {
      throw new Error(`${pathname} contains the retired SMS form handoff`)
    }
    if (
      html.includes('openingHoursSpecification') ||
      html.includes('Monday–Sunday, 8:00 AM–12:00 AM') ||
      html.includes('Mon–Sun: 8 AM–12 AM') ||
      html.includes('8 AM to midnight') ||
      html.includes('Published hours')
    ) {
      throw new Error(`${pathname} contains unconfirmed published hours`)
    }
    if (html.includes('Chapel Hill')) {
      throw new Error(`${pathname} contains a service-area claim not configured on the connected Google Business Profile`)
    }
    if (pathname === '/') {
      const homeIntro = findElementByClass(html, 'intro')
      if (!homeIntro?.html.includes('/assets/images/projects/landscape-entry-after.jpg')) {
        throw new Error('homepage intro is not using its approved bright finished-property photo')
      }
      assertions += 1
    }
    for (const removedService of ['Commercial Lawn Care', 'Hardscaping & Pavers', 'Holiday Lighting']) {
      if (html.includes(removedService)) {
        throw new Error(`${pathname} contains removed service ${removedService}`)
      }
    }
    for (const syntheticAsset of [
      'hero-truck-v1.jpg',
      'envision-truck-cutout-v2.png',
      'service-cleanup-crew-v2.jpg',
      'service-commercial-v2.jpg',
      'service-hardscaping-v2.jpg',
      'service-holiday-lighting-v2.jpg',
      'service-landscape-maintenance-v2.jpg',
      'service-lawn-crew-v2.jpg',
      'service-mulch-crew-v2.jpg',
      'service-planting-v2.jpg',
    ]) {
      if (html.includes(syntheticAsset)) {
        throw new Error(`${pathname} references synthetic image asset ${syntheticAsset}`)
      }
    }
    assertions += 9

    if (html.toLowerCase().includes('formspree')) {
      throw new Error(`${pathname} still references Formspree`)
    }
    if (!html.includes(`href="${jobberEmbedCss}"`)) {
      throw new Error(`${pathname} is missing the Jobber embed stylesheet`)
    }

    const jobberShellCount = (html.match(/data-jobber-request/g) || []).length
    const expectsJobber = !['/privacy', '/terms'].includes(pathname)
    if (jobberShellCount !== (expectsJobber ? 1 : 0)) {
      throw new Error(`${pathname} has ${jobberShellCount} Jobber embeds; expected ${expectsJobber ? 1 : 0}`)
    }
    if (jobberShellCount) {
      if ((html.match(new RegExp(`<div id="${jobberEmbedId}"`, 'g')) || []).length !== 1) {
        throw new Error(`${pathname} Jobber mount ID is missing or duplicated`)
      }
      if (
        !html.includes(
          `<script src="${jobberEmbedScript}" clienthub_id="${jobberEmbedId}" form_url="${jobberFormUrl}"></script>`,
        )
      ) {
        throw new Error(`${pathname} Jobber embed has the wrong script, account, or form URL`)
      }
      if (!html.includes(`href="${jobberFormUrl}"`)) {
        throw new Error(`${pathname} is missing the direct Jobber fallback link`)
      }
    }
    assertions += 5

    if (pathname.startsWith('/services/')) {
      const jobCards = (html.match(/<article class="service-job-card/g) || []).length
      const serviceSlug = pathname.split('/')[2]
      const expectedJobCards = serviceSlug === 'landscape-maintenance' ? 3 : 4
      if (jobCards !== expectedJobCards) {
        throw new Error(`${pathname} has ${jobCards} service-job cards; expected ${expectedJobCards}`)
      }
      const serviceHero = findElementByClass(html, 'service-page-hero')
      if (!serviceHero) {
        throw new Error(`${pathname} is missing its service-page hero`)
      }
      const heroImages = imageSources(serviceHero.html)
      if (heroImages.length !== 1 || !isRealFinishedProjectImage(heroImages[0])) {
        throw new Error(
          `${pathname} service hero must contain exactly one finished /assets/images/projects/ image; found ${heroImages.join(', ') || 'none'}`,
        )
      }
      if (
        pathname === '/services/aeration-overseeding' &&
        heroImages[0] !== '/assets/images/projects/aeration-overseeding-hero.jpg'
      ) {
        throw new Error(`${pathname} is not using the client-selected finished lawn photo in its hero`)
      }
      if (
        serviceHero.html.includes('data-before-after') ||
        serviceHero.html.includes('before-after-range') ||
        serviceHero.html.includes('service-page-hero-slider')
      ) {
        throw new Error(`${pathname} contains a before-and-after interaction inside its service hero`)
      }
      if (!html.includes('"hasOfferCatalog"')) {
        throw new Error(`${pathname} is missing its offer catalog schema`)
      }
      for (const [, image] of html.matchAll(/<article class="service-job-card[\s\S]*?<img src="([^"]+)"/g)) {
        if (/(?:before|during|seasonal-cleanup)/i.test(image)) {
          throw new Error(`${pathname} uses non-finished ${image} as a standalone service-job image`)
        }
      }
      assertions += 6
    }
  }

  for (const [serviceSlug, serviceTitle] of expectedServices) {
    const serviceHubPath = `/services/${serviceSlug}`
    const serviceHubHtml = pageHtml.get(serviceHubPath) || ''
    for (const [areaSlug, areaName] of expectedAreas) {
      const pathname = expectedServicePath(serviceSlug, areaSlug)
      const html = pageHtml.get(pathname)
      const expectedHeading = `${serviceTitle} in ${areaName}, NC`
      if (!html) throw new Error(`${pathname} is missing from the service-location matrix`)
      if (!html.includes(`<h1>${expectedHeading}</h1>`)) {
        throw new Error(`${pathname} is missing exact h1 "${expectedHeading}"`)
      }
      if (!html.includes(`<title>${expectedHeading} |`)) {
        throw new Error(`${pathname} title does not lead with its exact service and city`)
      }
      if (!serviceHubHtml.includes(`href="${pathname}"`)) {
        throw new Error(`${serviceHubPath} does not link to ${pathname}`)
      }
      const schemas = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
        .map(([, json]) => JSON.parse(json))
      const serviceData = schemas.find((schema) => schema['@type'] === 'Service')
      const servedNames = Array.isArray(serviceData?.areaServed)
        ? serviceData.areaServed.map((area) => area?.name)
        : [serviceData?.areaServed?.name].filter(Boolean)
      if (serviceData?.name !== expectedHeading || servedNames.length !== 1 || servedNames[0] !== `${areaName}, NC`) {
        throw new Error(`${pathname} has mismatched localized Service schema`)
      }
      if (!schemas.some((schema) => schema['@type'] === 'BreadcrumbList')) {
        throw new Error(`${pathname} is missing BreadcrumbList schema`)
      }
      if (areaSlug !== 'raleigh-nc') {
        const areaHubPath = `/service-areas/${areaSlug}`
        if (!(pageHtml.get(areaHubPath) || '').includes(`href="${pathname}"`)) {
          throw new Error(`${areaHubPath} does not link to ${pathname}`)
        }
      }
      assertions += areaSlug === 'raleigh-nc' ? 6 : 7
    }
  }

  for (const [pathname, before, after] of [
    ['/services/landscape-maintenance', 'walkway-refresh-before.jpg', 'walkway-refresh-after.jpg'],
    ['/services/aeration-overseeding', 'backyard-makeover-before.jpg', 'backyard-makeover-after.jpg'],
    ['/services/spring-fall-cleanups', 'front-refresh-before.jpg', 'front-refresh-after.jpg'],
  ]) {
    const html = await fetch(`${baseUrl}${pathname}`).then((response) => response.text())
    const serviceHero = findElementByClass(html, 'service-page-hero')
    const belowHero = serviceHero ? html.slice(serviceHero.end) : ''
    const proof = findElementByClass(belowHero, 'service-proof')
    if (!proof) {
      throw new Error(`${pathname} is missing its below-hero service-proof section`)
    }
    const slider = findElementByClass(proof.html, 'service-proof-slider')
    const proofImages = slider ? imageSources(slider.html) : []
    if (
      !slider ||
      !slider.html.includes('data-before-after') ||
      !slider.html.includes('before-after-range') ||
      !proofImages.some((src) => src.endsWith(`/${before}`)) ||
      !proofImages.some((src) => src.endsWith(`/${after}`))
    ) {
      throw new Error(`${pathname} service-proof is missing its correct interactive pair (${before} / ${after})`)
    }
    assertions += 6
  }

  for (const asset of [
    '/assets/styles.css',
    '/assets/site.js',
    '/assets/concierge.js',
    '/assets/vendor/maplibre-gl.css',
    '/assets/vendor/maplibre-gl.js',
    '/assets/images/hero-home.jpg',
  ]) {
    const response = await fetch(`${baseUrl}${asset}`)
    if (!response.ok) throw new Error(`${asset} returned ${response.status}`)
    assertions += 1
  }

  const missing = await fetch(`${baseUrl}/this-page-should-not-exist`)
  const missingHtml = await missing.text()
  if (missing.status !== 404 || !missingHtml.includes('Page Not Found')) {
    throw new Error('Custom 404 response failed')
  }
  assertions += 2

  const home = await fetch(baseUrl).then((response) => response.text())
  const homeHero = findElementByClass(home, 'home-hero')
  if (!homeHero) throw new Error('Homepage hero is missing')
  if (
    homeHero.html.includes('data-before-after') ||
    homeHero.html.includes('before-after-range') ||
    homeHero.html.includes('home-hero-slider')
  ) {
    throw new Error('Homepage hero must use a clean finished image, not a before-and-after slider')
  }
  const homeHeroVisual = findElementByClass(homeHero.html, 'home-hero-visual')
  const homeHeroImages = homeHeroVisual ? imageSources(homeHeroVisual.html) : []
  if (homeHeroImages.length !== 1 || homeHeroImages[0] !== '/assets/images/projects/finished-lawn-wide.jpg') {
    throw new Error('Homepage hero visual must use only /assets/images/projects/finished-lawn-wide.jpg')
  }
  assertions += 4
  if (!home.includes('meta name="google-site-verification" content="-LK9I0YqBf9eNzXHW7bNKepdZbfF2hQ2-NrThUllYmA"')) {
    throw new Error('Homepage Search Console verification tag is missing')
  }
  if (!home.includes('data-area-slug="garner-nc"') || home.includes('data-area-slug="chapel-hill-nc"')) {
    throw new Error('Homepage service-area signals do not match the connected Google Business Profile')
  }
  assertions += 2

  const gallery = await fetch(`${baseUrl}/gallery`).then((response) => response.text())
  const featuredStory = findElementByClass(gallery, 'project-story')
  if (!featuredStory) throw new Error('Gallery featured project is missing')
  const featuredImages = imageSources(featuredStory.html).map((src) => src.split('/').pop())
  const expectedStageImages = [
    'backyard-makeover-during-2.jpg',
    'backyard-makeover-before.jpg',
    'backyard-makeover-after.jpg',
  ]
  if (
    featuredImages.length !== expectedStageImages.length ||
    expectedStageImages.some((image, index) => featuredImages[index] !== image)
  ) {
    throw new Error(`Gallery featured stages have the wrong order: ${featuredImages.join(', ')}`)
  }
  assertions += 4

  console.log(`HTTP smoke tests passed: ${paths.length} pages and ${assertions} assertions.`)
} finally {
  server.kill('SIGTERM')
}
