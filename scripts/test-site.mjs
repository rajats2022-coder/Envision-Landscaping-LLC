import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = 3197
const baseUrl = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ['serve.mjs'], {
  cwd: root,
  env: { ...process.env, ENVISION_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})

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

  let assertions = 0
  for (const pathname of paths) {
    const response = await fetch(`${baseUrl}${pathname}`)
    const html = await response.text()
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
    if (html.includes('openingHoursSpecification') || html.includes('Monday–Sunday, 8:00 AM–12:00 AM')) {
      throw new Error(`${pathname} contains unconfirmed published hours`)
    }
    assertions += 8

    if (pathname.startsWith('/services/')) {
      const jobCards = (html.match(/<article class="service-job-card/g) || []).length
      if (jobCards !== 4) throw new Error(`${pathname} has ${jobCards} service-job cards`)
      if (!html.includes('class="service-page-hero"')) {
        throw new Error(`${pathname} is missing its service-page hero`)
      }
      if (!html.includes('"hasOfferCatalog"')) {
        throw new Error(`${pathname} is missing its offer catalog schema`)
      }
      assertions += 3
    }
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
  if (!home.includes('meta name="google-site-verification" content="-LK9I0YqBf9eNzXHW7bNKepdZbfF2hQ2-NrThUllYmA"')) {
    throw new Error('Homepage Search Console verification tag is missing')
  }
  if (!home.includes('data-area-slug="garner-nc"') || home.includes('data-area-slug="chapel-hill-nc"')) {
    throw new Error('Homepage service-area signals do not match the connected Google Business Profile')
  }
  assertions += 2

  console.log(`HTTP smoke tests passed: ${paths.length} pages and ${assertions} assertions.`)
} finally {
  server.kill('SIGTERM')
}
