import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const findings = []

const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath))

const sitemap = read('sitemap.xml')
const urls = [...sitemap.matchAll(/<loc>https:\/\/envisionlandscapingllc\.com([^<]*)<\/loc>/g)].map(
  ([, pathname]) => pathname || '/'
)

const pagePath = (pathname) => {
  if (pathname === '/') return 'index.html'
  const clean = pathname.replace(/^\/|\/$/g, '')
  return path.extname(clean) ? clean : `${clean}.html`
}

const stripFragments = (href) => href.split('#')[0].split('?')[0]

for (const pathname of urls) {
  const relativePath = pagePath(pathname)
  if (!exists(relativePath)) {
    findings.push(`${pathname}: missing ${relativePath}`)
    continue
  }

  const html = read(relativePath)
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() || ''
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]?.trim() || ''
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]?.trim() || ''
  const h1Count = (html.match(/<h1(?:\s|>)/g) || []).length

  if (!title || title.length > 65) findings.push(`${pathname}: title length ${title.length}`)
  if (!description || description.length > 165) {
    findings.push(`${pathname}: meta description length ${description.length}`)
  }
  const expectedCanonical = `https://envisionlandscapingllc.com${pathname === '/' ? '/' : pathname}`
  if (canonical !== expectedCanonical) {
    findings.push(`${pathname}: canonical ${canonical || 'missing'}; expected ${expectedCanonical}`)
  }
  if (h1Count !== 1) findings.push(`${pathname}: expected one h1, found ${h1Count}`)
  if (!['/privacy', '/terms'].includes(pathname) && !html.includes('<script type="application/ld+json">')) {
    findings.push(`${pathname}: missing JSON-LD`)
  }
  if (!html.includes('/assets/styles.css')) findings.push(`${pathname}: missing shared stylesheet`)
  if (!html.includes('/assets/site.js')) findings.push(`${pathname}: missing shared interaction script`)

  for (const [, src, alt] of html.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/g)) {
    if (!alt.trim()) findings.push(`${pathname}: image ${src} has empty alt text`)
    if (src.startsWith('/') && !exists(src.slice(1))) {
      findings.push(`${pathname}: missing image ${src}`)
    }
  }

  for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const clean = stripFragments(href)
    if (!clean || clean === '/' || !clean.startsWith('/') || clean.startsWith('//')) continue
    if (clean.startsWith('/assets/')) continue
    const target = pagePath(clean)
    if (!exists(target)) findings.push(`${pathname}: broken internal link ${href}`)
  }
}

for (const required of [
  '404.html',
  'assets/site.js',
  'assets/styles.css',
  'assets/vendor/maplibre-gl.css',
  'assets/vendor/maplibre-gl.js',
  'favicon.svg',
  'robots.txt',
  'sitemap.xml',
  'privacy.html',
]) {
  if (!exists(required)) findings.push(`missing required file: ${required}`)
}

const home = read('index.html')
for (const field of ['name', 'phone', 'service', 'location']) {
  if (!new RegExp(`<[^>]+name="${field}"`).test(home)) findings.push(`quote form missing ${field}`)
}
if (!home.includes('data-quote-form')) findings.push('homepage quote form is not wired')
if (!home.includes('href="tel:+19843386483"')) findings.push('homepage missing normalized phone link')
if (!home.includes('data-map-canvas')) findings.push('homepage live service map is missing')
if (!home.includes('data-map-view="state"')) findings.push('homepage North Carolina map view is missing')

const areaSignals = [...home.matchAll(/<button class="map-signal[^>]+data-area-signal[^>]+>/g)].map(
  ([markup]) => markup
)
if (areaSignals.length !== 8) {
  findings.push(`homepage expected 8 geographic map signals, found ${areaSignals.length}`)
}
for (const signal of areaSignals) {
  if (!/data-area-latitude="-?\d+(?:\.\d+)?"/.test(signal)) {
    findings.push('map signal is missing a valid latitude')
  }
  if (!/data-area-longitude="-?\d+(?:\.\d+)?"/.test(signal)) {
    findings.push('map signal is missing a valid longitude')
  }
}

if (findings.length) {
  console.error(`Site audit failed with ${findings.length} finding${findings.length === 1 ? '' : 's'}:`)
  findings.forEach((finding) => console.error(`- ${finding}`))
  process.exit(1)
}

console.log(`Site audit passed: ${urls.length} sitemap pages, internal links, metadata, assets, and lead path verified.`)
