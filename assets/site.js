document.documentElement.classList.add('has-js')

const selectAll = (selector, root = document) => [...root.querySelectorAll(selector)]

const header = document.querySelector('[data-site-header]')
const headerSentinel = document.querySelector('.header-sentinel')

if (header && headerSentinel) {
  const headerObserver = new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-scrolled', !entry.isIntersecting),
    { threshold: 0 }
  )
  headerObserver.observe(headerSentinel)
}

const menuButton = document.querySelector('.menu-toggle')
const menuClose = document.querySelector('.menu-close')
const mobileNav = document.querySelector('.mobile-menu')
const navScrim = document.querySelector('[data-menu-scrim]')

const setMenuState = (isOpen) => {
  if (!menuButton || !mobileNav || !navScrim) return
  menuButton.setAttribute('aria-expanded', String(isOpen))
  mobileNav.setAttribute('aria-hidden', String(!isOpen))
  mobileNav.classList.toggle('is-open', isOpen)
  navScrim.hidden = false
  navScrim.classList.toggle('is-open', isOpen)
  document.body.classList.toggle('menu-open', isOpen)
  if (!isOpen) {
    window.setTimeout(() => {
      if (!navScrim.classList.contains('is-open')) navScrim.hidden = true
    }, 320)
  }
}

menuButton?.addEventListener('click', () => {
  setMenuState(menuButton.getAttribute('aria-expanded') !== 'true')
})

navScrim?.addEventListener('click', () => setMenuState(false))
menuClose?.addEventListener('click', () => setMenuState(false))

selectAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false)
})

const revealItems = selectAll('.reveal')

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  )
  revealItems.forEach((item) => revealObserver.observe(item))
} else {
  revealItems.forEach((item) => {
    item.classList.add('is-visible')
  })
}

selectAll('[data-accordion]').forEach((accordion) => {
  const items = selectAll('details', accordion)
  items.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return
      items.forEach((other) => {
        if (other !== item) other.open = false
      })
    })
  })
})

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return true
  }

  const temporaryInput = document.createElement('textarea')
  temporaryInput.value = value
  temporaryInput.setAttribute('readonly', '')
  temporaryInput.style.position = 'fixed'
  temporaryInput.style.opacity = '0'
  document.body.append(temporaryInput)
  temporaryInput.select()
  const copied = document.execCommand('copy')
  temporaryInput.remove()
  return copied
}

selectAll('[data-offer-button]').forEach((button) => {
  const card = button.closest('.offer-stack')
  const display = card?.querySelector('[data-offer-display]')
  const status = card?.querySelector('[data-offer-status]')
  const label = button.querySelector('[data-offer-label]')
  const code = button.dataset.offerCode
  const defaultStatus = status?.textContent || ''

  button.addEventListener('click', async () => {
    if (!code || !display || !status || !label) return

    display.textContent = code
    card?.classList.add('is-revealed')

    try {
      const copied = await copyText(code)
      label.textContent = copied ? 'Copied!' : 'Code shown'
      status.textContent = copied
        ? `${code} copied. Mention it when requesting your estimate.`
        : `${code} revealed. Mention it when requesting your estimate.`
    } catch {
      label.textContent = 'Code shown'
      status.textContent = `${code} revealed. Select and copy it before contacting Envision.`
    }

    window.setTimeout(() => {
      label.textContent = 'Copy again'
      status.textContent = defaultStatus
    }, 3200)
  })
})

selectAll('[data-area-map]').forEach((map) => {
  const section = map.closest('.area-section')
  const signals = selectAll('[data-area-signal]', map)
  const areaLinks = selectAll('[data-area-select]', section || document)
  const mapCanvas = map.querySelector('[data-map-canvas]')
  const loadState = map.querySelector('[data-map-load-state] strong')
  const viewButtons = selectAll('[data-map-view]', map)
  const name = map.querySelector('[data-map-area-name]')
  const copy = map.querySelector('[data-map-area-copy]')
  const services = map.querySelector('[data-map-area-services]')
  const detailLink = map.querySelector('[data-map-area-link]')
  let serviceMap = null

  const setViewState = (view) => {
    viewButtons.forEach((button) => {
      const isActive = button.dataset.mapView === view
      button.classList.toggle('is-active', isActive)
      button.setAttribute('aria-pressed', String(isActive))
    })
  }

  const fitMapView = (view, duration = 850) => {
    if (!serviceMap) return
    const isMobile = window.matchMedia('(max-width: 720px)').matches
    const bounds =
      view === 'state'
        ? [
            [-84.45, 33.72],
            [-75.3, 36.7],
          ]
        : [
            [-79.13, 35.51],
            [-78.55, 36.07],
          ]

    setViewState(view)
    serviceMap.fitBounds(bounds, {
      padding: isMobile
        ? { top: 50, right: 24, bottom: 40, left: 24 }
        : { top: 34, right: 42, bottom: 34, left: 42 },
      maxZoom: view === 'state' ? 6.7 : 8.65,
      duration,
    })
  }

  const activateArea = (source) => {
    const slug = source.dataset.areaSlug || source.dataset.areaSelect
    const signal = signals.find((candidate) => candidate.dataset.areaSlug === slug)
    if (!signal || !name || !copy || !services || !detailLink) return

    signals.forEach((candidate) => {
      const isActive = candidate === signal
      candidate.classList.toggle('is-active', isActive)
      candidate.setAttribute('aria-pressed', String(isActive))
    })
    areaLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.areaSelect === slug)
    })

    name.textContent = `${signal.dataset.areaName}, NC`
    copy.textContent = signal.dataset.areaCopy || ''
    services.replaceChildren(
      ...(signal.dataset.areaServices || '')
        .split('|')
        .filter(Boolean)
        .map((service) => {
          const chip = document.createElement('span')
          chip.textContent = service
          return chip
        })
    )
    detailLink.href = signal.dataset.areaHref || '/service-areas'
    const detailLabel = detailLink.querySelector('span')
    if (detailLabel) detailLabel.textContent = `Explore ${signal.dataset.areaName}`

  }

  signals.forEach((signal) => {
    signal.addEventListener('pointerenter', () => {
      if (serviceMap?.isMoving()) return
      activateArea(signal)
    })
    signal.addEventListener('focus', () => activateArea(signal))
    signal.addEventListener('click', () => activateArea(signal))
  })

  areaLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => activateArea(link))
    link.addEventListener('focus', () => activateArea(link))
  })

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => fitMapView(button.dataset.mapView || 'service'))
  })

  if (signals[0]) activateArea(signals[0])

  if (!mapCanvas || !window.maplibregl) {
    if (loadState) loadState.textContent = 'Live map unavailable — use the city list'
    return
  }

  try {
    serviceMap = new window.maplibregl.Map({
      container: mapCanvas,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [-78.82, 35.79],
      zoom: 8.4,
      minZoom: 5.4,
      maxZoom: 16,
      renderWorldCopies: false,
      pitchWithRotate: false,
      attributionControl: false,
    })

    serviceMap.addControl(
      new window.maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    )
    serviceMap.addControl(
      new window.maplibregl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: false,
      }),
      'top-right'
    )
    if ('geolocation' in navigator) {
      class LocateControl {
        onAdd(mapInstance) {
          this.map = mapInstance
          this.container = document.createElement('div')
          this.container.className = 'maplibregl-ctrl maplibregl-ctrl-group'
          this.button = document.createElement('button')
          this.button.type = 'button'
          this.button.className = 'maplibregl-ctrl-geolocate'
          this.button.setAttribute('aria-label', 'Find my location')
          this.button.title = 'Find my location'
          this.button.innerHTML = '<span class="maplibregl-ctrl-icon" aria-hidden="true"></span>'
          this.button.addEventListener('click', this.locate)
          this.container.append(this.button)
          return this.container
        }

        locate = () => {
          this.button.disabled = true
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.map.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 12,
                duration: 1100,
              })
              this.button.disabled = false
            },
            () => {
              this.button.disabled = false
              this.button.title = 'Location permission was not available'
              this.button.setAttribute('aria-label', 'Location permission was not available')
            },
            { enableHighAccuracy: true, timeout: 7000 }
          )
        }

        onRemove() {
          this.button?.removeEventListener('click', this.locate)
          this.container?.remove()
          this.map = null
        }
      }

      serviceMap.addControl(new LocateControl(), 'top-right')
    }
    serviceMap.addControl(
      new window.maplibregl.FullscreenControl({ container: map }),
      'top-right'
    )

    signals.forEach((signal) => {
      new window.maplibregl.Marker({
        element: signal,
        anchor: 'center',
      })
        .setLngLat([
          Number.parseFloat(signal.dataset.areaLongitude),
          Number.parseFloat(signal.dataset.areaLatitude),
        ])
        .addTo(serviceMap)
    })

    const radar = document.createElement('div')
    radar.className = 'service-radar-anchor'
    radar.setAttribute('aria-hidden', 'true')
    radar.innerHTML = '<span></span><span></span>'
    new window.maplibregl.Marker({
      element: radar,
      anchor: 'center',
    })
      .setLngLat([-78.6390989, 35.7803977])
      .addTo(serviceMap)

    serviceMap.on('load', () => {
      map.classList.add('is-map-loaded')
      fitMapView('service', 0)

      serviceMap.addSource('north-carolina-boundary', {
        type: 'geojson',
        data:
          'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer/0/query?where=STATE%3D%2737%27&outFields=STATE%2CNAME&returnGeometry=true&outSR=4326&f=geojson',
      })
      serviceMap.addLayer({
        id: 'north-carolina-service-fill',
        type: 'fill',
        source: 'north-carolina-boundary',
        paint: {
          'fill-color': '#92cb3c',
          'fill-opacity': 0.035,
        },
      })
      serviceMap.addLayer({
        id: 'north-carolina-service-outline',
        type: 'line',
        source: 'north-carolina-boundary',
        paint: {
          'line-color': '#a6df4a',
          'line-width': 2,
          'line-opacity': 0.82,
        },
      })
    })

    window.addEventListener('resize', () => serviceMap?.resize(), { passive: true })
  } catch {
    if (loadState) loadState.textContent = 'Live map unavailable — use the city list'
  }
})

selectAll('.service-card').forEach((card) => {
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) return
    selectAll('.service-card.is-active').forEach((activeCard) => {
      if (activeCard !== card) activeCard.classList.remove('is-active')
    })
    card.classList.toggle('is-active')
  })
})

const reviewTrack = document.querySelector('[data-review-track]')

const moveReviews = (direction) => {
  if (!reviewTrack) return
  const firstCard = reviewTrack.querySelector('.review-card')
  const gap = Number.parseFloat(getComputedStyle(reviewTrack).columnGap) || 24
  const distance = (firstCard?.getBoundingClientRect().width || 320) + gap
  reviewTrack.scrollBy({
    left: distance * direction,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
  })
}

document.querySelector('.carousel-prev')?.addEventListener('click', () => moveReviews(-1))
document.querySelector('.carousel-next')?.addEventListener('click', () => moveReviews(1))

const lightbox = document.querySelector('[data-lightbox]')
const lightboxImage = lightbox?.querySelector('img')
const lightboxClose = lightbox?.querySelector('button')

const closeLightbox = () => {
  if (!lightbox) return
  lightbox.close()
}

selectAll('[data-lightbox-open]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return
    const source = trigger.dataset.lightboxOpen
    const image = trigger.querySelector('img')
    lightboxImage.src = source || image?.src || ''
    lightboxImage.alt = image?.alt || 'Envision Landscaping project'
    lightbox.showModal()
  })
})

lightboxClose?.addEventListener('click', closeLightbox)
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox()
})

const quoteForm = document.querySelector('[data-quote-form]')

if (quoteForm instanceof HTMLFormElement) {
  const status = quoteForm.querySelector('.form-status')

  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault()

    if (!quoteForm.reportValidity()) {
      if (status) {
        status.textContent = 'Please complete the required fields so we can prepare your request.'
        status.dataset.state = 'error'
      }
      return
    }

    const data = new FormData(quoteForm)
    const lines = [
      'Hi Envision Landscaping, I would like a free quote.',
      `Name: ${data.get('name')}`,
      `Phone: ${data.get('phone')}`,
      `Service: ${data.get('service')}`,
      `Property location: ${data.get('location')}`,
      `Project details: ${data.get('details') || 'Not provided'}`,
    ]

    if (status) {
      status.textContent = 'Opening your text message app with the project details ready to send.'
      status.dataset.state = 'success'
    }

    window.location.href = `sms:+19843386483?body=${encodeURIComponent(lines.join('\n'))}`
  })
}
