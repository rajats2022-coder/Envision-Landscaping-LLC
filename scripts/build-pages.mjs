#!/usr/bin/env node

import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const origin = 'https://envisionlandscapingllc.com';

const business = {
  name: 'Envision Landscaping LLC',
  shortName: 'Envision Landscaping',
  owner: 'Kyle Young',
  phone: '(984) 338-6483',
  phoneHref: '+19843386483',
  instagram: 'https://www.instagram.com/envision_landscaping_llc/',
  googleReviews:
    'https://search.google.com/local/reviews?placeid=ChIJjRfUHps6RysRA6PtjRQlYYc',
  publishedHours: 'Monday–Sunday, 8:00 AM–12:00 AM',
  rating: '4.9',
};

const areas = [
  {
    slug: 'raleigh-nc',
    name: 'Raleigh',
    region: 'NC',
    latitude: 35.7803977,
    longitude: -78.6390989,
    services: ['Lawn maintenance', 'Landscape care', 'Mulch', 'Seasonal cleanups'],
    intro:
      'Envision provides lawn maintenance, seasonal cleanup, mulch, and landscape care for properties across Raleigh.',
  },
  {
    slug: 'cary-nc',
    name: 'Cary',
    region: 'NC',
    latitude: 35.7882893,
    longitude: -78.7812081,
    services: ['Recurring lawn care', 'Mulch', 'Design and planting', 'Cleanups'],
    intro:
      'Homeowners and property managers in Cary can call Envision for routine lawn care and one-time landscape projects.',
  },
  {
    slug: 'apex-nc',
    name: 'Apex',
    region: 'NC',
    latitude: 35.7325352,
    longitude: -78.8505516,
    services: ['Mowing and edging', 'Bed care', 'Mulch', 'Landscape maintenance'],
    intro:
      'Envision serves Apex with dependable mowing, bed care, seasonal cleanup, mulch, and landscape maintenance.',
  },
  {
    slug: 'morrisville-nc',
    name: 'Morrisville',
    region: 'NC',
    latitude: 35.824341,
    longitude: -78.8300321,
    services: ['Recurring lawn service', 'Landscape care', 'Cleanups', 'Outdoor improvements'],
    intro:
      'Envision helps Morrisville properties stay neat with recurring lawn service and focused outdoor improvements.',
  },
  {
    slug: 'fuquay-varina-nc',
    name: 'Fuquay-Varina',
    region: 'NC',
    latitude: 35.5843849,
    longitude: -78.7998691,
    services: ['Lawn maintenance', 'Seasonal cleanups', 'Mulch', 'Commercial care'],
    intro:
      'From routine lawn maintenance to seasonal cleanup, Envision serves homes and businesses in Fuquay-Varina.',
  },
  {
    slug: 'holly-springs-nc',
    name: 'Holly Springs',
    region: 'NC',
    latitude: 35.6512655,
    longitude: -78.8336218,
    services: ['Lawn maintenance', 'Bed care', 'Trimming', 'Seasonal cleanups'],
    intro:
      'Envision provides practical, detail-focused lawn and landscape care throughout Holly Springs.',
  },
  {
    slug: 'durham-nc',
    name: 'Durham',
    region: 'NC',
    latitude: 35.996653,
    longitude: -78.9018053,
    services: ['Lawn maintenance', 'Cleanups', 'Mulch', 'Landscape projects'],
    intro:
      'Envision serves Durham-area properties with lawn maintenance, cleanups, mulch, and landscape project support.',
  },
  {
    slug: 'chapel-hill-nc',
    name: 'Chapel Hill',
    region: 'NC',
    latitude: 35.9131542,
    longitude: -79.05578,
    services: ['Recurring yard care', 'Mulch', 'Seasonal cleanups', 'Planting'],
    intro:
      'Chapel Hill customers can contact Envision for recurring yard care and scheduled landscape improvements.',
  },
];

const commonProcess = [
  {
    title: 'Tell us what the property needs',
    body: 'Call or send a text request with the property location, service, and a few details about the work.',
  },
  {
    title: 'Review the scope',
    body: 'Envision reviews the project and, when needed, looks at the property before preparing the estimate.',
  },
  {
    title: 'Approve and schedule',
    body: 'Once the work and price are clear, choose a service date that fits the schedule.',
  },
  {
    title: 'Walk the result',
    body: 'The work is checked at the end so questions or adjustments can be handled before the crew leaves.',
  },
];

const services = [
  {
    slug: 'lawn-maintenance',
    title: 'Lawn Maintenance',
    navTitle: 'Lawn Maintenance',
    image: '/assets/images/lawn-maintenance.jpg',
    short:
      'Routine mowing, edging, trimming, and cleanup that keeps the property looking sharp.',
    meta:
      'Reliable lawn maintenance in Raleigh, NC, including mowing, edging, trimming, and property cleanup.',
    h1: 'Lawn maintenance that keeps Raleigh properties sharp',
    intro:
      'A clean lawn depends on consistent work. Envision handles the recurring details—mowing, edging, trimming, and blowing—so the property stays ready week after week.',
    includes: [
      'Mowing and clean edge lines',
      'String trimming around obstacles',
      'Blowing hard surfaces clean',
      'Service timing based on property needs',
    ],
    faqs: [
      [
        'How often should lawn maintenance be scheduled?',
        'Frequency depends on growth, weather, and the property. Contact Envision to discuss a schedule that matches the lawn.',
      ],
      [
        'Can Envision work with an existing yard-care plan?',
        'Yes. Explain what is already being handled and where you need additional support.',
      ],
      [
        'Do you provide one-time lawn service?',
        'One-time and recurring needs can be discussed when you request an estimate.',
      ],
    ],
  },
  {
    slug: 'commercial-lawn-care',
    title: 'Commercial Lawn Care',
    navTitle: 'Commercial Lawn Care',
    image: '/assets/images/hero-home.jpg',
    short:
      'Scheduled lawn and landscape care for businesses and managed properties.',
    meta:
      'Commercial lawn care and landscape maintenance for Raleigh-area businesses and managed properties.',
    h1: 'Commercial lawn care with a clear, dependable schedule',
    intro:
      'Curb appeal matters before anyone walks through the door. Envision provides commercial lawn and landscape care built around the property, scope, and service schedule.',
    includes: [
      'Routine mowing and edge work',
      'Landscape-bed maintenance',
      'Seasonal cleanup support',
      'Clear property-specific estimates',
    ],
    faqs: [
      [
        'What kinds of commercial properties do you serve?',
        'Envision invites businesses and property managers to share the property type and scope for a fit check.',
      ],
      [
        'Can service be scheduled on a recurring basis?',
        'Yes. Recurring timing is planned around the property and approved scope.',
      ],
      [
        'How do I request a commercial estimate?',
        'Call or use the text-request form with the address, service needs, and preferred timing.',
      ],
    ],
  },
  {
    slug: 'landscape-maintenance',
    title: 'Landscape Maintenance',
    navTitle: 'Landscape Maintenance',
    image: '/assets/images/landscape-maintenance.jpg',
    short:
      'Ongoing bed, shrub, lawn, and seasonal care for a more finished property.',
    meta:
      'Landscape maintenance in Raleigh, NC, including pruning, trimming, weed care, lawn work, and seasonal service.',
    h1: 'Landscape maintenance down to the last detail',
    intro:
      'Landscape maintenance goes beyond mowing. Envision can help manage beds, shrubs, weeds, seasonal debris, and the small details that shape the whole property.',
    includes: [
      'Pruning and trimming',
      'Bed cleanup and weed control',
      'Seasonal debris removal',
      'Soil, fertilization, and irrigation checks as scoped',
    ],
    faqs: [
      [
        'What can a landscape maintenance visit include?',
        'The scope may include lawn work, edging, pruning, trimming, bed care, weed control, and seasonal cleanup.',
      ],
      [
        'Can the plan be customized?',
        'Yes. The estimate should reflect the property and the work you actually need.',
      ],
      [
        'Do you maintain existing landscaping?',
        'Yes. Envision can work with the existing layout and focus on keeping it clean and healthy.',
      ],
    ],
  },
  {
    slug: 'spring-fall-cleanups',
    title: 'Spring & Fall Cleanups',
    navTitle: 'Seasonal Cleanups',
    image: '/assets/images/seasonal-cleanup.jpg',
    short:
      'Seasonal clearing, trimming, and reset work that gets the yard back under control.',
    meta:
      'Spring and fall yard cleanup services in Raleigh, NC, including debris removal, trimming, and landscape-bed cleanup.',
    h1: 'Seasonal cleanups without the weekend-long yard project',
    intro:
      'Leaves, branches, overgrowth, and tired beds can make a property feel unfinished. Envision clears the buildup and resets the landscape for the season ahead.',
    includes: [
      'Leaf and debris clearing',
      'Bed and edge cleanup',
      'Pruning and trimming as scoped',
      'Preparation for spring growth or winter',
    ],
    faqs: [
      [
        'What is included in a seasonal cleanup?',
        'The final scope depends on the property and may include leaves, branches, bed cleanup, edging, and trimming.',
      ],
      [
        'When should I book?',
        'Scheduling early in spring or fall gives the best chance of securing the timing you want.',
      ],
      [
        'Can cleanup be combined with mulch?',
        'Yes. Ask for both services in the estimate request so the work can be scoped together.',
      ],
    ],
  },
  {
    slug: 'mulch-pine-straw',
    title: 'Mulch & Pine Straw',
    navTitle: 'Mulch & Pine Straw',
    image: '/assets/images/mulching.jpg',
    short:
      'Fresh bed material installed with clean edges and even coverage.',
    meta:
      'Mulch and pine-straw installation in Raleigh, NC, with bed preparation, clean edges, and even coverage.',
    h1: 'Fresh mulch and pine straw, installed cleanly',
    intro:
      'A clean bed line and even material can change the whole front of a property. Envision prepares the area, installs the selected material, and leaves the surrounding surfaces tidy.',
    includes: [
      'Mulch installation',
      'Pine-straw installation',
      'Bed cleanup and preparation',
      'Clean finishing around hard surfaces',
    ],
    faqs: [
      [
        'Do you install both mulch and pine straw?',
        'Yes. Tell Envision which material you prefer or ask for help scoping the project.',
      ],
      [
        'Can bed cleanup be included?',
        'Yes. Include weeds, debris, edging, or old material in the estimate request.',
      ],
      [
        'How much material will I need?',
        'The amount depends on the bed dimensions and desired depth. Envision can review the area before quoting.',
      ],
    ],
  },
  {
    slug: 'landscape-design-planting',
    title: 'Design & Planting',
    navTitle: 'Design & Planting',
    image: '/assets/images/about-lawn.jpg',
    short:
      'Practical landscape planning, plant selection, sod, and installation support.',
    meta:
      'Landscape consultation, design, planting, and sod support for Raleigh-area outdoor projects.',
    h1: 'A practical plan for the landscape you want',
    intro:
      'Whether the goal is a cleaner front bed, new plantings, sod, or a larger yard refresh, Envision starts with the property and the outcome you have in mind.',
    includes: [
      'Landscape consultation and planning',
      'Tree and shrub planting',
      'Sod installation or repair',
      'Project-specific material selection',
    ],
    faqs: [
      [
        'Can you work with an existing landscape?',
        'Yes. A project can keep what is working and focus on the areas that need change.',
      ],
      [
        'Do I need a finished design before calling?',
        'No. Share the goal, budget range, and any inspiration you have so the next step can be scoped.',
      ],
      [
        'Can planting be part of a larger cleanup?',
        'Yes. Mention every part of the project so the estimate reflects the full plan.',
      ],
    ],
  },
  {
    slug: 'hardscaping-pavers',
    title: 'Hardscaping & Pavers',
    navTitle: 'Hardscaping & Pavers',
    image: '/assets/images/hero-home.jpg',
    short:
      'Patios, walkways, retaining features, pavers, and other outdoor improvements.',
    meta:
      'Hardscaping and paver project consultations in Raleigh, NC, including patios, walkways, and retaining features.',
    h1: 'Hardscape features planned around the property',
    intro:
      'Envision’s published service list includes pavers, patios, walkways, retaining features, driveways, and related outdoor projects. Start with the space, intended use, and project priorities.',
    includes: [
      'Paver and patio projects',
      'Walkways and driveway surfaces',
      'Retaining features',
      'Outdoor project consultation',
    ],
    faqs: [
      [
        'What hardscape projects can I ask about?',
        'The current service list includes pavers, patios, walkways, driveways, retaining walls, fire pits, and outdoor-kitchen features.',
      ],
      [
        'Will someone need to see the property?',
        'Many hardscape estimates require a property review so access, dimensions, and scope can be understood.',
      ],
      [
        'How do I get started?',
        'Send the location, project type, approximate size, and any photos or inspiration you already have.',
      ],
    ],
  },
  {
    slug: 'holiday-lighting',
    title: 'Holiday Lighting',
    navTitle: 'Holiday Lighting',
    image: '/assets/images/hero-home.jpg',
    short:
      'Seasonal lighting and decoration help for Raleigh-area homes and properties.',
    meta:
      'Holiday lighting and decoration services from Envision Landscaping in Raleigh, NC.',
    h1: 'Holiday lighting without the ladder work',
    intro:
      'Holiday lighting and decoration are part of Envision’s published service offering. Contact the team with the property, display goals, and preferred timing to confirm current availability.',
    includes: [
      'Property-specific lighting consultation',
      'Seasonal installation support',
      'Display planning based on the property',
      'Availability confirmed before scheduling',
    ],
    faqs: [
      [
        'When should I request holiday-light installation?',
        'Reach out early so current seasonal availability and project timing can be confirmed.',
      ],
      [
        'Can I share inspiration photos?',
        'Yes. Photos help explain the style and parts of the property you want to highlight.',
      ],
      [
        'Is pricing available online?',
        'No fixed pricing is published. Request an estimate for the specific property and display.',
      ],
    ],
  },
];

const reviews = [
  {
    name: 'Alison W.',
    service: 'Mulch installation',
    highlight:
      'Her review says the front yard looked better than it ever had after Kyle completed the mulch project.',
  },
  {
    name: 'Ryan P.',
    service: 'Ongoing yard care',
    highlight:
      'He describes Kyle as trustworthy and the work as dependable and fairly priced.',
  },
  {
    name: 'D S.',
    service: 'Pine-straw installation',
    highlight:
      'The review notes prompt scheduling, a reasonable estimate, and a clean finished result.',
  },
];

const homepageFaqs = [
  [
    'What areas does Envision Landscaping serve?',
    'Envision serves Raleigh and surrounding Triangle communities, including Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Chapel Hill.',
  ],
  [
    'What lawn and landscaping services are available?',
    'Published services include lawn and landscape maintenance, seasonal cleanups, mulch and pine straw, design and planting, commercial care, hardscaping, and holiday lighting.',
  ],
  [
    'How do I request an estimate?',
    'Call (984) 338-6483 or use the quote form to prepare a text message with your service, property area, and project details.',
  ],
  [
    'Does Envision offer recurring lawn care?',
    'Yes. Recurring lawn and landscape maintenance are part of the published service offering. Timing is based on the property and approved scope.',
  ],
  [
    'Can I ask about more than one service?',
    'Yes. Include the full project—such as cleanup plus mulch—so the estimate can reflect the work together.',
  ],
];

const icons = {
  arrow: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>`,
  phone: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M7.5 3.8 10 8l-2.2 2.2c1.4 2.8 3.2 4.6 6 6l2.2-2.2 4.2 2.5-.7 3.2c-.2.8-.9 1.3-1.7 1.3C9.6 20.6 3.4 14.4 3 6.2c0-.8.5-1.5 1.3-1.7l3.2-.7Z"/></svg>`,
  pin: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  clock: `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  star: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z"/></svg>`,
  instagram: `<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>`,
  menu: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  close: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></svg>`,
  check: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>`,
  copy: `<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>`,
  plus: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>`,
  minus: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>`,
  compass: `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg>`,
  locate: `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="8"/></svg>`,
  fullscreen: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/></svg>`,
  quote: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9.5 6H5v6h4v6H3v-6c0-3.4 2.2-6 6.5-6ZM21 6h-4.5v6h4v6h-6v-6c0-3.4 2.2-6 6.5-6Z"/></svg>`,
};

function cleanPath(path) {
  return path === 'index' ? '/' : `/${path}`;
}

function pageUrl(path) {
  return `${origin}${cleanPath(path)}`;
}

function localBusinessSchema(extra = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url: origin,
    image: `${origin}/assets/images/hero-home.jpg`,
    logo: `${origin}/assets/images/envision-logo.png`,
    telephone: business.phoneHref,
    founder: {
      '@type': 'Person',
      name: business.owner,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Raleigh',
      addressRegion: 'NC',
      addressCountry: 'US',
    },
    areaServed: areas.map((area) => ({
      '@type': 'City',
      name: `${area.name}, ${area.region}`,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      bestRating: '5',
      reviewCount: '31',
    },
    sameAs: [business.instagram, business.googleReviews],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '23:59',
      },
    ],
    ...extra,
  };
}

function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.meta,
    areaServed: areas.map((area) => `${area.name}, ${area.region}`),
    provider: {
      '@type': 'LocalBusiness',
      name: business.name,
      telephone: business.phoneHref,
      url: origin,
    },
  };
}

function renderSchemas(schemas) {
  return schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    )
    .join('\n');
}

function navLink(href, label, currentPath) {
  const active =
    href === '/'
      ? currentPath === 'index'
      : cleanPath(currentPath).startsWith(href);
  return `<a href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`;
}

function siteHeader(currentPath) {
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="utility-bar">
      <div class="shell utility-inner">
        <div class="utility-group">
          <span>${icons.pin}<span>Raleigh, NC &amp; the Triangle</span></span>
          <span class="utility-hours">${icons.clock}<span>Mon–Sun: 8 AM–12 AM</span></span>
        </div>
        <div class="utility-group utility-actions">
          <a href="${business.googleReviews}" target="_blank" rel="noopener">${icons.star}<span>${business.rating} on Google</span></a>
          <a href="${business.instagram}" target="_blank" rel="noopener">${icons.instagram}<span>Instagram</span></a>
        </div>
      </div>
    </div>
    <div class="header-sentinel" aria-hidden="true"></div>
    <header class="site-header" data-site-header>
      <div class="shell nav-shell">
        <a class="brand" href="/" aria-label="${business.name} home">
          <img src="/assets/images/envision-logo.png" alt="${business.name}" width="240" height="140">
        </a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          ${navLink('/', 'Home', currentPath)}
          <div class="nav-dropdown">
            <a href="/services"${cleanPath(currentPath).startsWith('/services') ? ' aria-current="page"' : ''}>Services <span aria-hidden="true">⌄</span></a>
            <div class="services-menu" aria-label="Services">
              ${services
                .map(
                  (service) =>
                    `<a href="/services/${service.slug}"><span>${service.navTitle}</span><small>${service.short}</small></a>`,
                )
                .join('')}
            </div>
          </div>
          ${navLink('/about', 'About', currentPath)}
          ${navLink('/gallery', 'Gallery', currentPath)}
          ${navLink('/reviews', 'Reviews', currentPath)}
          ${navLink('/service-areas', 'Service Area', currentPath)}
        </nav>
        <div class="nav-actions">
          <a class="button button-primary button-compact" href="/contact">
            <span>Request estimate</span><span class="button-icon">${icons.arrow}</span>
          </a>
          <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
            ${icons.menu}
          </button>
        </div>
      </div>
    </header>
    <div class="menu-scrim" data-menu-scrim hidden></div>
    <aside class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden="true">
      <div class="mobile-menu-top">
        <img src="/assets/images/envision-logo.png" alt="${business.name}" width="190" height="111">
        <button class="menu-close" type="button" aria-label="Close menu">${icons.close}</button>
      </div>
      <div class="mobile-menu-actions">
        <a class="button button-primary" href="/contact"><span>Request estimate</span>${icons.arrow}</a>
        <a class="button button-outline-dark" href="tel:${business.phoneHref}"><span>Call ${business.phone}</span>${icons.phone}</a>
      </div>
      <nav aria-label="Mobile navigation links">
        ${navLink('/', 'Home', currentPath)}
        <details>
          <summary>Services <span aria-hidden="true">+</span></summary>
          <div>
            ${services
              .map(
                (service) =>
                  `<a href="/services/${service.slug}">${service.navTitle}</a>`,
              )
              .join('')}
          </div>
        </details>
        ${navLink('/about', 'About', currentPath)}
        ${navLink('/gallery', 'Gallery', currentPath)}
        ${navLink('/reviews', 'Reviews', currentPath)}
        ${navLink('/service-areas', 'Service Area', currentPath)}
        ${navLink('/contact', 'Contact', currentPath)}
      </nav>
      <div class="mobile-menu-meta">
        <span>${icons.pin} Raleigh, NC &amp; surrounding areas</span>
        <span>${icons.clock} ${business.publishedHours}</span>
      </div>
    </aside>`;
}

function siteFooter() {
  return `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div class="footer-brand">
          <img src="/assets/images/envision-logo.png" alt="${business.name}" width="240" height="140">
          <p>Owner-led lawn and landscape care for Raleigh and surrounding Triangle communities.</p>
          <div class="social-row">
            <a href="${business.instagram}" target="_blank" rel="noopener" aria-label="Envision Landscaping on Instagram">${icons.instagram}</a>
            <a href="${business.googleReviews}" target="_blank" rel="noopener" aria-label="Read Envision Landscaping Google reviews">${icons.star}</a>
          </div>
        </div>
        <div>
          <h2>Services</h2>
          <ul>
            ${services
              .slice(0, 6)
              .map(
                (service) =>
                  `<li><a href="/services/${service.slug}">${service.navTitle}</a></li>`,
              )
              .join('')}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li><a href="/about">About</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/reviews">Reviews</a></li>
            <li><a href="/service-areas">Service area</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div>
          <h2>Contact</h2>
          <ul class="contact-list">
            <li><a href="tel:${business.phoneHref}">${icons.phone}<span>${business.phone}</span></a></li>
            <li>${icons.pin}<span>Raleigh, NC<br>Serving the Triangle</span></li>
            <li>${icons.clock}<span>${business.publishedHours}</span></li>
          </ul>
        </div>
      </div>
      <div class="shell footer-bottom">
        <p>© ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/sitemap.xml">Sitemap</a></div>
      </div>
    </footer>
    <div class="mobile-cta-bar" aria-label="Quick actions">
      <a href="tel:${business.phoneHref}">${icons.phone}<span>Call</span></a>
      <a href="/contact">${icons.arrow}<span>Estimate</span></a>
    </div>`;
}

function pageShell({
  path,
  title,
  description,
  body,
  schemas = [localBusinessSchema()],
  image = '/assets/images/hero-home.jpg',
  bodyClass = '',
}) {
  const canonical = pageUrl(path);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#08140f">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${business.name}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${origin}${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${origin}${image}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/images/envision-logo.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/vendor/maplibre-gl.css?v=5.12.0">
  <link rel="stylesheet" href="/assets/styles.css?v=20260725-4">
  ${renderSchemas(schemas)}
</head>
<body class="${bodyClass}">
  ${siteHeader(path)}
  <main id="main-content">${body}</main>
  ${siteFooter()}
  <script src="/assets/vendor/maplibre-gl.js?v=5.12.0" defer></script>
  <script src="/assets/site.js?v=20260725-4" defer></script>
</body>
</html>`;
}

function sectionHeading(eyebrow, heading, copy = '') {
  return `<div class="section-heading reveal">
    <p class="eyebrow">${eyebrow}</p>
    <h2>${heading}</h2>
    ${copy ? `<p>${copy}</p>` : ''}
  </div>`;
}

function buttonPair(primaryText = 'Request a free estimate') {
  return `<div class="button-row">
    <a class="button button-primary" href="/contact"><span>${primaryText}</span><span class="button-icon">${icons.arrow}</span></a>
    <a class="button button-ghost-light" href="tel:${business.phoneHref}">${icons.phone}<span>Call ${business.phone}</span></a>
  </div>`;
}

function trustRail() {
  const items = [
    {
      icon: icons.star,
      metric: business.rating,
      title: 'Google rating',
      copy: 'See what Raleigh-area customers say about the finished work.',
      link: business.googleReviews,
      label: 'Read reviews',
    },
    {
      icon: icons.check,
      metric: 'Owner-led',
      title: `By ${business.owner}`,
      copy: 'Direct accountability from the first conversation through the final walkthrough.',
      link: '/about',
      label: 'Meet Envision',
    },
    {
      icon: icons.pin,
      metric: `${areas.length} areas`,
      title: 'Across the Triangle',
      copy: 'Raleigh, Cary, Apex, Durham, Chapel Hill, and surrounding communities.',
      link: '/service-areas',
      label: 'View service area',
    },
    {
      icon: icons.clock,
      metric: '7 days',
      title: 'Published availability',
      copy: 'Current published hours run Monday through Sunday.',
      link: '/contact',
      label: 'Check the schedule',
    },
  ];
  return `<section class="trust-rail shell" aria-label="Why customers contact Envision">
    ${items
      .map(
        (item) => `<a class="trust-card reveal" href="${item.link}">
          <span class="trust-icon">${item.icon}</span>
          <strong class="trust-metric">${item.metric}</strong>
          <h2>${item.title}</h2>
          <p>${item.copy}</p>
          <span class="text-link">${item.label} ${icons.arrow}</span>
        </a>`,
      )
      .join('')}
  </section>`;
}

function serviceGrid(limit = services.length) {
  return `<div class="service-grid">
    ${services
      .slice(0, limit)
      .map(
        (service, index) => `<article class="service-card reveal" style="--i:${index}" tabindex="0">
          <img src="${service.image}" alt="${service.title} project by Envision Landscaping" loading="lazy" width="900" height="1100">
          <div class="service-card-shade"></div>
          <div class="service-card-copy">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h3>${service.title}</h3>
            <p>${service.short}</p>
            <a href="/services/${service.slug}">View service ${icons.arrow}</a>
          </div>
        </article>`,
      )
      .join('')}
  </div>`;
}

function processSection(heading = 'How working with Envision starts') {
  return `<section class="process section-pad">
    <div class="shell process-grid">
      <div class="process-visual reveal">
        <img src="/assets/images/lawn-maintenance.jpg" alt="Envision lawn maintenance work in progress" loading="lazy" width="1200" height="900">
        <div class="process-caption"><span>From first call</span><strong>to final walkthrough.</strong></div>
      </div>
      <div class="process-copy">
        ${sectionHeading('A clear path', heading, 'Know what comes next before the work begins.')}
        <div class="accordion process-accordion" data-accordion>
          ${commonProcess
            .map(
              (step, index) => `<details${index === 0 ? ' open' : ''}>
                <summary><span>${String(index + 1).padStart(2, '0')}</span><strong>${step.title}</strong><i aria-hidden="true">+</i></summary>
                <div><p>${step.body}</p></div>
              </details>`,
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>`;
}

function reviewSection() {
  return `<section class="reviews section-pad">
    <div class="shell">
      <div class="reviews-top">
        ${sectionHeading('Customer feedback', 'Local work earns local trust.', 'These highlights summarize reviews already published on Envision’s current website.')}
        <div class="review-score reveal">
          <span>${business.rating}</span>
          <div><div class="stars">${icons.star.repeat(5)}</div><p>Published Google rating</p></div>
        </div>
      </div>
      <div class="review-track-wrap reveal">
        <button class="carousel-button carousel-prev" type="button" aria-label="Previous reviews">${icons.arrow}</button>
        <div class="review-track" data-review-track>
          ${reviews
            .map(
              (review) => `<article class="review-card">
                <div class="review-card-top"><span>${icons.quote}</span><span class="stars">${icons.star.repeat(5)}</span></div>
                <p>${review.highlight}</p>
                <footer><strong>${review.name}</strong><span>${review.service}</span></footer>
              </article>`,
            )
            .join('')}
        </div>
        <button class="carousel-button carousel-next" type="button" aria-label="Next reviews">${icons.arrow}</button>
      </div>
      <div class="center-row">
        <a class="button button-navy" href="${business.googleReviews}" target="_blank" rel="noopener"><span>Read Google reviews</span>${icons.arrow}</a>
      </div>
    </div>
  </section>`;
}

function offerSection() {
  return `<section class="offers section-pad" id="special-offers">
    <div class="shell offers-shell">
      <div class="offers-heading reveal">
        <p class="eyebrow eyebrow-light">Current website offers</p>
        <h2>Special offers for sharper properties.</h2>
        <p>Reveal a code, copy it in one click, and mention it when requesting your estimate. Availability and eligibility should be confirmed before service.</p>
      </div>
      <div class="offer-grid">
        <article class="offer-stack reveal">
          <div class="offer-card">
            <header class="offer-card-top">
              <div><strong class="offer-value">15%</strong><span>First service package</span></div>
              <button class="offer-code-button" type="button" data-offer-button data-offer-code="WELCOME15" aria-describedby="offer-welcome-details">
                <span data-offer-label>Get code</span>${icons.copy}
              </button>
            </header>
            <div class="offer-card-copy" id="offer-welcome-details">
              <p class="offer-kicker">New Customer Special</p>
              <h3>Start with a sharper lawn.</h3>
              <p>Enjoy 15% off a first lawn-care service package. Share the code when you contact Envision and confirm the offer applies to your project.</p>
            </div>
            <footer class="offer-code-row">
              <span>Promo code</span><code data-offer-display>•••••••••</code><small data-offer-status aria-live="polite">Conditions apply</small>
            </footer>
          </div>
        </article>
        <article class="offer-stack offer-stack-alt reveal">
          <div class="offer-card">
            <header class="offer-card-top">
              <div><strong class="offer-value">$50</strong><span>Seasonal package</span></div>
              <button class="offer-code-button" type="button" data-offer-button data-offer-code="SEASON50" aria-describedby="offer-season-details">
                <span data-offer-label>Get code</span>${icons.copy}
              </button>
            </header>
            <div class="offer-card-copy" id="offer-season-details">
              <p class="offer-kicker">Seasonal Care Discount</p>
              <h3>Reset the property for the season.</h3>
              <p>Save $50 on a seasonal maintenance package. Share the code with Envision and confirm current scheduling, availability, and eligibility.</p>
            </div>
            <footer class="offer-code-row">
              <span>Promo code</span><code data-offer-display>••••••••</code><small data-offer-status aria-live="polite">Limited availability</small>
            </footer>
          </div>
        </article>
      </div>
    </div>
  </section>`;
}

function gallerySection() {
  const galleryItems = [
    ['/assets/images/hero-home.jpg', 'Finished lawn and landscaping at a Raleigh-area home'],
    ['/assets/images/landscape-maintenance.jpg', 'Landscape maintenance work by Envision'],
    ['/assets/images/mulching.jpg', 'Fresh mulch installation by Envision'],
    ['/assets/images/lawn-maintenance.jpg', 'Striped lawn after maintenance'],
    ['/assets/images/about-lawn.jpg', 'Clean residential lawn and landscape'],
    ['/assets/images/seasonal-cleanup.jpg', 'Seasonal lawn and landscape cleanup'],
  ];
  return `<section class="gallery-preview section-pad">
    <div class="shell gallery-heading-row">
      ${sectionHeading('Real Envision work', 'The details show in the finish.', 'Project photography from Envision’s current website.')}
      <a class="text-link text-link-light" href="/gallery">View the full gallery ${icons.arrow}</a>
    </div>
    <div class="gallery-collage shell">
      ${galleryItems
        .map(
          ([src, alt], index) => `<figure class="gallery-item gallery-item-${index + 1} reveal">
            <img src="${src}" alt="${alt}" loading="lazy" width="1000" height="1200">
          </figure>`,
        )
        .join('')}
    </div>
  </section>`;
}

function areaSection() {
  const defaultArea = areas[0];
  const mapButton = (area, index) => `<button class="map-signal${index === 0 ? ' is-active' : ''}" type="button"
          data-area-signal
          data-area-slug="${area.slug}"
          data-area-name="${area.name}"
          data-area-latitude="${area.latitude}"
          data-area-longitude="${area.longitude}"
          data-area-copy="${area.intro}"
          data-area-services="${area.services.join('|')}"
          data-area-href="/service-areas/${area.slug}"
          aria-label="View Envision services in ${area.name}"
          aria-pressed="${index === 0 ? 'true' : 'false'}">
          <span class="signal-dot" aria-hidden="true"></span><span class="signal-label">${area.name}</span>
        </button>`;
  return `<section class="area-section section-pad" id="service-area">
    <div class="shell area-grid">
      <div>
        ${sectionHeading('Service area', 'Raleigh-based. Triangle-wide.', 'Hover, focus, or tap a city to explore the services Envision offers in that community. Confirm the exact property when booking.')}
        <div class="area-list">
          ${areas
            .map(
              (area) =>
                `<a href="/service-areas/${area.slug}" data-area-select="${area.slug}"><span>${area.name}</span>${icons.arrow}</a>`,
            )
            .join('')}
        </div>
      </div>
      <div class="area-map reveal" data-area-map aria-label="Interactive Envision service-area map">
        <div class="area-map-toolbar"><span><i aria-hidden="true"></i> Live NC service map</span><strong>${areas.length} verified locations</strong></div>
        <div class="nc-map-stage">
          <div class="service-map-canvas" data-map-canvas role="application" aria-label="Interactive street map of Envision Landscaping service areas"></div>
          <div class="map-view-switcher" role="group" aria-label="Choose map view">
            <button class="is-active" type="button" data-map-view="service" aria-pressed="true">Triangle</button>
            <button type="button" data-map-view="state" aria-pressed="false">North Carolina</button>
          </div>
          <div class="map-load-state" data-map-load-state>
            <span aria-hidden="true"></span>
            <strong>Loading the live map</strong>
          </div>
          <div class="map-signals" hidden>
            ${areas.map(mapButton).join('')}
          </div>
          <noscript><p class="map-noscript">Enable JavaScript to use the live map. Every service-area page remains available in the city list.</p></noscript>
        </div>
        <div class="area-map-panel">
          <div>
            <p>Selected service area</p>
            <h3 data-map-area-name>${defaultArea.name}, ${defaultArea.region}</h3>
            <p data-map-area-copy>${defaultArea.intro}</p>
          </div>
          <div class="area-map-panel-actions">
            <div class="area-service-chips" data-map-area-services>${defaultArea.services.map((service) => `<span>${service}</span>`).join('')}</div>
            <a href="/service-areas/${defaultArea.slug}" data-map-area-link><span>Explore ${defaultArea.name}</span>${icons.arrow}</a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function faqSection(items = homepageFaqs, heading = 'Questions before you book?') {
  return `<section class="faq-section section-pad">
    <div class="shell faq-grid">
      <div class="faq-intro">
        ${sectionHeading('Straight answers', heading, 'If your question is specific to the property, call or start a text request.')}
        <a class="button button-primary" href="/contact"><span>Ask Envision</span>${icons.arrow}</a>
      </div>
      <div class="accordion faq-accordion" data-accordion>
        ${items
          .map(
            ([question, answer], index) => `<details${index === 0 ? ' open' : ''}>
              <summary><span>${question}</span><i aria-hidden="true">+</i></summary>
              <div><p>${answer}</p></div>
            </details>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function quoteForm(id = 'quote-form') {
  return `<form class="quote-form" id="${id}" data-quote-form novalidate>
    <div class="field-grid">
      <label><span>Name</span><input type="text" name="name" autocomplete="name" required><small data-error-for="name"></small></label>
      <label><span>Phone</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" required><small data-error-for="phone"></small></label>
    </div>
    <div class="field-grid">
      <label><span>Property city or ZIP</span><input type="text" name="location" autocomplete="postal-code" required><small data-error-for="location"></small></label>
      <label><span>Service</span><select name="service" required><option value="">Choose a service</option>${services
        .map((service) => `<option>${service.title}</option>`)
        .join('')}<option>Something else</option></select><small data-error-for="service"></small></label>
    </div>
    <label><span>What would you like done?</span><textarea name="details" rows="5" required placeholder="Share the property area, project, timing, and anything Kyle should know."></textarea><small data-error-for="details"></small></label>
    <button class="button button-primary button-wide" type="submit"><span>Start a text request</span><span class="button-icon">${icons.arrow}</span></button>
    <p class="form-note">This prepares a text to ${business.phone}. Your device will ask you to review and send it.</p>
    <div class="form-status" role="status" aria-live="polite"></div>
  </form>`;
}

function contactSection() {
  return `<section class="contact-section section-pad" id="estimate">
    <div class="shell contact-grid">
      <div class="contact-copy reveal">
        <p class="eyebrow">Start with the property</p>
        <h2>Tell Envision what needs work.</h2>
        <p>Send the service, property area, and project details. The form prepares a text message so nothing is claimed as submitted until you send it from your device.</p>
        <a class="contact-phone" href="tel:${business.phoneHref}">${icons.phone}<span><small>Prefer to call?</small><strong>${business.phone}</strong></span></a>
        <dl>
          <div><dt>Based in</dt><dd>Raleigh, NC</dd></div>
          <div><dt>Published hours</dt><dd>${business.publishedHours}</dd></div>
          <div><dt>Service area</dt><dd>Raleigh &amp; surrounding Triangle communities</dd></div>
        </dl>
      </div>
      <div class="quote-panel reveal">
        <p class="quote-panel-kicker">Request an estimate</p>
        <h3>Build your text request</h3>
        ${quoteForm('home-quote-form')}
      </div>
    </div>
  </section>`;
}

function innerHero({ eyebrow, title, copy, image, ctas = true }) {
  return `<section class="inner-hero" style="--hero-image:url('${image}')">
    <div class="inner-hero-shade"></div>
    <div class="shell inner-hero-content reveal">
      <p class="eyebrow eyebrow-light">${eyebrow}</p>
      <h1>${title}</h1>
      <p>${copy}</p>
      ${ctas ? buttonPair() : ''}
    </div>
  </section>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb shell" aria-label="Breadcrumb">
    <a href="/">Home</a>
    ${items
      .map(
        ([label, href], index) =>
          `${icons.arrow}${href && index < items.length - 1 ? `<a href="${href}">${label}</a>` : `<span aria-current="page">${label}</span>`}`,
      )
      .join('')}
  </nav>`;
}

function homePage() {
  const hero = `<section class="home-hero home-hero-truck">
    <img class="home-hero-image" src="/assets/images/hero-truck-v1.jpg" alt="Envision Landscaping branded pickup and landscaping trailer at a manicured Raleigh-area home" width="1672" height="941" fetchpriority="high" decoding="async">
    <div class="home-hero-shade"></div>
    <div class="shell home-hero-content">
      <div class="hero-rating reveal"><span class="stars">${icons.star.repeat(5)}</span><a href="${business.googleReviews}" target="_blank" rel="noopener">${business.rating} on Google</a></div>
      <p class="eyebrow eyebrow-light reveal">Professional lawn &amp; landscape care</p>
      <h1 class="reveal">Raleigh lawns. Raised standards.</h1>
      <p class="hero-copy reveal">Owner-led lawn maintenance, seasonal cleanup, mulch, planting, and landscape care across Raleigh and the Triangle.</p>
      <div class="hero-action-wrap reveal">
        <div class="button-row">
          <a class="button button-primary" href="/contact"><span>Request a free estimate</span><span class="button-icon">${icons.arrow}</span></a>
          <a class="button button-ghost-light" href="#services"><span>Explore our services</span>${icons.arrow}</a>
        </div>
        <a class="hero-phone-link" href="tel:${business.phoneHref}">${icons.phone}<span>Prefer to talk? <strong>${business.phone}</strong></span></a>
      </div>
    </div>
    <a class="hero-scroll" href="#services" aria-label="Scroll to services"><span>See the work</span>${icons.arrow}</a>
  </section>`;

  const intro = `<section class="intro section-pad">
    <div class="shell intro-grid">
      <div class="intro-copy">
        ${sectionHeading('Owner-led in Raleigh', 'The yard gets the same care Kyle would expect at his own.', 'Envision Landscaping is led by Kyle Young and built around showing up, doing the work right, and treating every property with care.')}
        <div class="intro-points">
          <div><span>01</span><p>Clear scope before the work begins</p></div>
          <div><span>02</span><p>Detail-focused service from curb to bed line</p></div>
          <div><span>03</span><p>Routine care and one-time projects</p></div>
        </div>
        <a class="button button-navy" href="/about"><span>Meet Envision</span><span class="button-icon">${icons.arrow}</span></a>
      </div>
      <div class="intro-visual reveal">
        <div class="image-shell"><img src="/assets/images/about-lawn.jpg" alt="Striped lawn maintained by Envision Landscaping" loading="lazy" width="900" height="1300"></div>
        <div class="intro-badge"><strong>Raleigh</strong><span>&amp; the Triangle</span></div>
      </div>
    </div>
  </section>`;

  const serviceSection = `<section class="services section-pad" id="services">
    <div class="shell services-heading-row">
      ${sectionHeading('What Envision handles', 'One crew. The work your exterior needs.', 'Start with routine care or ask about a larger yard project.')}
      <a class="text-link" href="/services">Explore every service ${icons.arrow}</a>
    </div>
    <div class="shell">${serviceGrid()}</div>
  </section>`;

  const consultation = `<section class="consultation shell reveal">
    <div class="consultation-mark">${icons.check}</div>
    <div><p>Not sure which service fits?</p><h2>Walk through the property needs with Envision.</h2></div>
    <a class="button button-primary" href="/contact"><span>Request an estimate</span>${icons.arrow}</a>
  </section>`;

  const why = `<section class="why section-pad">
    <div class="shell">
      ${sectionHeading('Why Envision', 'Reliable work is more than a clean cut.', 'Customers consistently point to responsiveness, fair estimates, professionalism, and finished results.')}
      <div class="why-grid">
        ${[
          ['01', 'Show up and communicate', 'Know what is scheduled, what the estimate covers, and how to reach the team.'],
          ['02', 'Treat the details as the job', 'Edges, beds, cleanup, and final presentation shape the result as much as the main task.'],
          ['03', 'Build work worth calling back for', 'The goal is a property you are glad to come home to—and service you would use again.'],
        ]
          .map(
            ([number, title, copy]) => `<article class="why-card reveal">
              <span>${number}</span><h3>${title}</h3><p>${copy}</p>
            </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;

  const transformation = `<section class="transformation">
    <img src="/assets/images/lawn-maintenance.jpg" alt="Freshly maintained lawn by Envision Landscaping" loading="lazy" width="1800" height="1350">
    <div class="transformation-shade"></div>
    <div class="shell transformation-content reveal">
      <p class="eyebrow eyebrow-light">Ready for a cleaner property?</p>
      <h2>Let Envision handle the outside work.</h2>
      <p>Start with a call or send the property details in a text request.</p>
      ${buttonPair('Request my estimate')}
    </div>
  </section>`;

  return pageShell({
    path: 'index',
    title: 'Raleigh Lawn Care & Landscaping | Envision Landscaping LLC',
    description:
      'Owner-led lawn maintenance, seasonal cleanup, mulch, landscape care, and outdoor projects across Raleigh and the Triangle.',
    image: '/assets/images/hero-truck-v1.jpg',
    schemas: [localBusinessSchema(), faqSchema(homepageFaqs)],
    body:
      hero +
      trustRail() +
      intro +
      serviceSection +
      consultation +
      processSection() +
      why +
      reviewSection() +
      offerSection() +
      transformation +
      gallerySection() +
      areaSection() +
      faqSection() +
      contactSection(),
    bodyClass: 'home-page',
  });
}

function servicesPage() {
  return pageShell({
    path: 'services',
    title: 'Lawn & Landscaping Services in Raleigh | Envision',
    description:
      'Explore lawn maintenance, commercial care, cleanups, mulch, planting, hardscaping, and holiday-lighting services from Envision.',
    body:
      innerHero({
        eyebrow: 'Services',
        title: 'The work your property needs, in one place.',
        copy: 'Routine care, seasonal resets, planting, and larger outdoor projects for Raleigh-area properties.',
        image: '/assets/images/landscape-maintenance.jpg',
      }) +
      breadcrumb([['Services']]) +
      `<section class="services-page section-pad"><div class="shell">${sectionHeading('Lawn, landscape & exterior care', 'Choose the service closest to your project.', 'If the work crosses categories, include everything in one estimate request.')}${serviceGrid()}</div></section>` +
      processSection('A straightforward way to get the work scheduled') +
      faqSection(homepageFaqs, 'Need help choosing a service?') +
      contactSection(),
  });
}

function aboutPage() {
  return pageShell({
    path: 'about',
    title: 'About Envision Landscaping LLC | Raleigh, NC',
    description:
      'Meet Envision Landscaping owner Kyle Young and learn about the reliability, care, and detail behind the Raleigh lawn-care company.',
    body:
      innerHero({
        eyebrow: 'About Envision',
        title: 'Built around hard work and a property treated right.',
        copy: 'Owner Kyle Young leads a Raleigh lawn and landscape company focused on reliability, clear work, and finished details.',
        image: '/assets/images/about-lawn.jpg',
      }) +
      breadcrumb([['About']]) +
      `<section class="story section-pad"><div class="shell story-grid">
        <div class="story-copy">
          ${sectionHeading('The company', 'A local crew that takes the work personally.', 'Envision’s current story centers on owner Kyle Young, consistent service, and treating each yard with the same care the team would expect at home.')}
          <p class="lead">From routine mowing to a larger yard transformation, the promise is simple: show up when scheduled, understand the work, and leave the property looking finished.</p>
          <p>The strongest proof comes from customer feedback. Published reviews repeatedly mention professional communication, reasonable estimates, prompt scheduling, trust, and extra attention to the final result.</p>
          <a class="button button-primary" href="/reviews"><span>Read customer feedback</span>${icons.arrow}</a>
        </div>
        <div class="story-images reveal">
          <img src="/assets/images/hero-home.jpg" alt="Raleigh-area property cared for by Envision Landscaping" width="1000" height="1200">
          <img src="/assets/images/lawn-maintenance.jpg" alt="Finished striped lawn by Envision Landscaping" loading="lazy" width="1000" height="750">
        </div>
      </div></section>` +
      `<section class="values section-pad"><div class="shell">
        ${sectionHeading('What the work should feel like', 'No mystery between the estimate and the result.')}
        <div class="value-list">
          ${[
            ['Clear', 'A scope you can understand before the work starts.'],
            ['Reliable', 'Scheduling and communication that respect your time.'],
            ['Detailed', 'Attention to the edges, cleanup, and final presentation.'],
            ['Local', 'Service built around Raleigh and Triangle-area properties.'],
          ]
            .map(
              ([title, copy], index) => `<article class="reveal"><span>${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${copy}</p></article>`,
            )
            .join('')}
        </div>
      </div></section>` +
      reviewSection() +
      contactSection(),
  });
}

function galleryPage() {
  const photos = [
    ['/assets/images/hero-home.jpg', 'Finished residential lawn and landscaping'],
    ['/assets/images/landscape-maintenance.jpg', 'Landscape maintenance project'],
    ['/assets/images/mulching.jpg', 'Mulch installation and clean bed lines'],
    ['/assets/images/lawn-maintenance.jpg', 'Freshly striped lawn'],
    ['/assets/images/about-lawn.jpg', 'Residential lawn and landscape care'],
    ['/assets/images/seasonal-cleanup.jpg', 'Seasonal property cleanup'],
    ['/assets/images/lawn-maintenance.jpg', 'Clean mowing pattern and edge work'],
    ['/assets/images/mulching.jpg', 'Mulch bed finish around the property'],
  ];
  return pageShell({
    path: 'gallery',
    title: 'Raleigh Lawn & Landscaping Project Gallery | Envision',
    description:
      'See lawn maintenance, mulch, cleanup, and landscape work from Envision Landscaping across the Raleigh area.',
    body:
      innerHero({
        eyebrow: 'Project gallery',
        title: 'Real work. Clean results.',
        copy: 'A closer look at lawns and landscapes featured on Envision’s current website.',
        image: '/assets/images/hero-home.jpg',
      }) +
      breadcrumb([['Gallery']]) +
      `<section class="gallery-page section-pad"><div class="shell">
        ${sectionHeading('Selected projects', 'The finish is the proof.', 'Project images are shown with descriptive alt text and no location claims beyond Envision’s published service area.')}
        <div class="gallery-masonry">
          ${photos
            .map(
              ([src, alt], index) => `<figure class="reveal"><button type="button" data-lightbox-open="${src}" aria-label="Open image: ${alt}"><img src="${src}" alt="${alt} by Envision Landscaping" loading="${index < 2 ? 'eager' : 'lazy'}" width="1000" height="1200"></button><figcaption>${alt}</figcaption></figure>`,
            )
            .join('')}
        </div>
      </div></section>
      <dialog class="lightbox" data-lightbox><button type="button" aria-label="Close image">${icons.close}</button><img alt=""></dialog>` +
      transformationCta('Have a property that needs this kind of reset?') +
      contactSection(),
  });
}

function reviewsPage() {
  return pageShell({
    path: 'reviews',
    title: 'Customer Reviews | Envision Landscaping Raleigh',
    description:
      'Read customer feedback highlights and visit Envision Landscaping’s Google review profile for current Raleigh-area reviews.',
    body:
      innerHero({
        eyebrow: 'Customer reviews',
        title: 'What customers remember is the result—and how the work was handled.',
        copy: 'Published feedback consistently points to trust, fair estimates, prompt scheduling, and detail.',
        image: '/assets/images/mulching.jpg',
      }) +
      breadcrumb([['Reviews']]) +
      `<section class="reviews-page section-pad"><div class="shell">
        <div class="reviews-summary">
          <div class="review-score-large reveal"><strong>${business.rating}</strong><span class="stars">${icons.star.repeat(5)}</span><p>Published Google rating</p></div>
          ${sectionHeading('Customer feedback', 'Review the current source.', 'These cards summarize selected reviews. Use the Google link for the latest complete feedback and rating.')}
        </div>
        <div class="review-wall">
          ${reviews
            .concat(reviews)
            .map(
              (review, index) => `<article class="review-card reveal"><div class="review-card-top"><span>${icons.quote}</span><span class="stars">${icons.star.repeat(5)}</span></div><p>${review.highlight}</p><footer><strong>${review.name}</strong><span>${index < 3 ? review.service : 'Published customer feedback'}</span></footer></article>`,
            )
            .join('')}
        </div>
        <div class="center-row"><a class="button button-primary" href="${business.googleReviews}" target="_blank" rel="noopener"><span>Read all Google reviews</span>${icons.arrow}</a></div>
      </div></section>` +
      transformationCta('Ready to see the difference on your property?') +
      contactSection(),
  });
}

function contactPage() {
  return pageShell({
    path: 'contact',
    title: 'Request a Lawn Care Estimate in Raleigh | Envision',
    description:
      'Call Envision Landscaping at (984) 338-6483 or prepare a text request for lawn and landscaping work in Raleigh and the Triangle.',
    schemas: [
      localBusinessSchema({
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: business.phoneHref,
          contactType: 'customer service',
          areaServed: 'US-NC',
        },
      }),
    ],
    body:
      innerHero({
        eyebrow: 'Contact Envision',
        title: 'Start with the property and the work you want done.',
        copy: 'Call now or build a text request with the service, location, and project details.',
        image: '/assets/images/lawn-maintenance.jpg',
        ctas: false,
      }) +
      breadcrumb([['Contact']]) +
      `<section class="contact-page section-pad"><div class="shell contact-page-grid">
        <div class="contact-page-details">
          ${sectionHeading('Request an estimate', 'Give Kyle the details needed to understand the job.', 'No public email or third-party form inbox was verified, so this site uses the confirmed phone number as the conversion path.')}
          <a class="contact-method reveal" href="tel:${business.phoneHref}"><span>${icons.phone}</span><div><small>Call Envision</small><strong>${business.phone}</strong><p>Best for a quick fit and schedule check.</p></div>${icons.arrow}</a>
          <a class="contact-method reveal" href="${business.instagram}" target="_blank" rel="noopener"><span>${icons.instagram}</span><div><small>Instagram</small><strong>@envision_landscaping_llc</strong><p>See the profile and send a social message.</p></div>${icons.arrow}</a>
          <div class="contact-facts">
            <div><span>${icons.pin}</span><p><strong>Based in Raleigh</strong>Serving Raleigh and surrounding Triangle communities.</p></div>
            <div><span>${icons.clock}</span><p><strong>Published hours</strong>${business.publishedHours}</p></div>
          </div>
        </div>
        <div class="quote-panel quote-panel-large reveal"><p class="quote-panel-kicker">Quote by text</p><h2>Build the message.</h2>${quoteForm('contact-quote-form')}</div>
      </div></section>` +
      areaSection() +
      faqSection(homepageFaqs),
  });
}

function serviceAreasPage() {
  return pageShell({
    path: 'service-areas',
    title: 'Raleigh & Triangle Lawn Care Service Area | Envision',
    description:
      'Envision Landscaping serves Raleigh, Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Chapel Hill.',
    body:
      innerHero({
        eyebrow: 'Service area',
        title: 'Raleigh-based lawn and landscape care across the Triangle.',
        copy: 'Browse the published service communities, then contact Envision to confirm your property.',
        image: '/assets/images/hero-home.jpg',
      }) +
      breadcrumb([['Service Areas']]) +
      `<section class="area-page section-pad"><div class="shell">
        ${sectionHeading('Communities served', 'Start with the city. Finish with the property details.', 'Service depends on project fit and scheduling, so confirm the exact address when you request an estimate.')}
        <div class="area-card-grid">
          ${areas
            .map(
              (area, index) => `<a class="area-card reveal" href="/service-areas/${area.slug}"><span>${String(index + 1).padStart(2, '0')}</span><h2>${area.name}, ${area.region}</h2><p>${area.intro}</p><i>${icons.arrow}</i></a>`,
            )
            .join('')}
        </div>
      </div></section>` +
      areaSection() +
      contactSection(),
  });
}

function servicePage(service) {
  return pageShell({
    path: `services/${service.slug}`,
    title: `${service.title} in Raleigh, NC | Envision Landscaping`,
    description: service.meta,
    image: service.image,
    schemas: [
      localBusinessSchema(),
      serviceSchema(service),
      faqSchema(service.faqs),
    ],
    body:
      innerHero({
        eyebrow: 'Raleigh service',
        title: service.h1,
        copy: service.short,
        image: service.image,
      }) +
      breadcrumb([
        ['Services', '/services'],
        [service.title],
      ]) +
      `<section class="service-detail section-pad"><div class="shell service-detail-grid">
        <div class="service-detail-copy">
          ${sectionHeading('What the service covers', service.title, service.intro)}
          <ul class="check-list">
            ${service.includes
              .map((item) => `<li>${icons.check}<span>${item}</span></li>`)
              .join('')}
          </ul>
          <a class="button button-primary" href="/contact"><span>Request a ${service.title.toLowerCase()} estimate</span>${icons.arrow}</a>
        </div>
        <div class="service-detail-image reveal"><img src="${service.image}" alt="${service.title} work by Envision Landscaping" width="1200" height="1400"><div><span>${icons.pin}</span><p><strong>Serving Raleigh &amp; the Triangle</strong>Confirm the exact property when booking.</p></div></div>
      </div></section>` +
      processSection(`What to expect for ${service.title.toLowerCase()}`) +
      `<section class="related-services section-pad"><div class="shell">${sectionHeading('Keep planning', 'Related property services')}${serviceGrid(4)}</div></section>` +
      faqSection(service.faqs, `${service.title} questions`) +
      contactSection(),
  });
}

function areaPage(area) {
  return pageShell({
    path: `service-areas/${area.slug}`,
    title: `Lawn Care & Landscaping in ${area.name}, ${area.region} | Envision`,
    description: `${area.intro} Call Envision Landscaping at ${business.phone}.`,
    schemas: [
      localBusinessSchema({
        areaServed: {
          '@type': 'City',
          name: `${area.name}, ${area.region}`,
        },
      }),
      faqSchema([
        [
          `Does Envision Landscaping serve ${area.name}?`,
          `Yes. ${area.name}, ${area.region} is listed in Envision’s published service area. Confirm the exact property when requesting an estimate.`,
        ],
        ...homepageFaqs.slice(1, 4),
      ]),
    ],
    body:
      innerHero({
        eyebrow: `${area.name}, ${area.region}`,
        title: `Lawn and landscape care for ${area.name} properties`,
        copy: area.intro,
        image: '/assets/images/hero-home.jpg',
      }) +
      breadcrumb([
        ['Service Areas', '/service-areas'],
        [`${area.name}, ${area.region}`],
      ]) +
      `<section class="local-service section-pad"><div class="shell local-service-grid">
        <div>${sectionHeading('Local service', `Property care in ${area.name}`, `${area.intro} Choose the closest service below, then share the address and project details.`)}<a class="button button-primary" href="/contact"><span>Request a ${area.name} estimate</span>${icons.arrow}</a></div>
        <div class="local-stat reveal"><span>${icons.pin}</span><strong>${area.name}</strong><p>Published Envision service community</p><small>Scheduling and project fit are confirmed property by property.</small></div>
      </div></section>` +
      `<section class="services section-pad"><div class="shell">${sectionHeading('Available services', `Outdoor work for ${area.name} homes and properties`)}${serviceGrid(6)}</div></section>` +
      reviewSection() +
      faqSection(
        [
          [
            `Does Envision Landscaping serve ${area.name}?`,
            `Yes. ${area.name}, ${area.region} is listed in Envision’s published service area. Confirm the exact property when requesting an estimate.`,
          ],
          ...homepageFaqs.slice(1, 4),
        ],
        `${area.name} service questions`,
      ) +
      contactSection(),
  });
}

function transformationCta(heading) {
  return `<section class="simple-cta section-pad"><div class="shell simple-cta-inner reveal"><div><p class="eyebrow eyebrow-light">Your property is next</p><h2>${heading}</h2></div>${buttonPair()}</div></section>`;
}

function legalPage(kind) {
  const privacy = kind === 'privacy';
  const title = privacy ? 'Privacy Policy' : 'Terms of Use';
  const sections = privacy
    ? [
        [
          'What this site collects',
          'This static website does not use a verified analytics or advertising tracker. The quote form processes the details in your browser to prepare an SMS message. Your device and mobile carrier handle that message if you choose to send it.',
        ],
        [
          'Third-party links',
          'Links to Google, Instagram, phone, and text services are controlled by those providers. Their privacy policies apply after you leave this site.',
        ],
        [
          'Contact details',
          `For privacy questions about this website, call ${business.phone}. No public email address has been published here.`,
        ],
      ]
    : [
        [
          'Website information',
          'Service descriptions, service areas, published hours, ratings, and offers are presented from current public business information. Availability, eligibility, scope, timing, and price must be confirmed directly with Envision Landscaping.',
        ],
        [
          'Estimates and messages',
          'Preparing a text request does not create an estimate, contract, appointment, or guarantee that a message was sent. Review and send the message from your own device.',
        ],
        [
          'Offers',
          'Promotional codes shown on the website may have conditions or limited availability. Confirm current terms before scheduling service.',
        ],
      ];
  return pageShell({
    path: kind,
    title: `${title} | ${business.name}`,
    description: `${title} for the Envision Landscaping website.`,
    schemas: [],
    body:
      innerHero({
        eyebrow: 'Website information',
        title,
        copy: `Last updated ${new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}.`,
        image: '/assets/images/hero-home.jpg',
        ctas: false,
      }) +
      breadcrumb([[title]]) +
      `<article class="legal shell section-pad">
        ${sections
          .map(([heading, copy]) => `<section><h2>${heading}</h2><p>${copy}</p></section>`)
          .join('')}
      </article>`,
  });
}

function notFoundPage() {
  return pageShell({
    path: '404',
    title: `Page Not Found | ${business.name}`,
    description: 'The requested Envision Landscaping page could not be found.',
    schemas: [],
    body: `<section class="not-found"><div class="shell reveal"><p class="eyebrow eyebrow-light">404</p><h1>This page needs a little cleanup.</h1><p>The link may have moved. Head back home or call Envision for service.</p>${buttonPair('Back to the homepage').replace('href="/contact"', 'href="/"')}</div></section>`,
  });
}

function sitemapXml(paths) {
  const updated = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${pageUrl(path)}</loc>
    <lastmod>${updated}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
}

function llmsText(full = false) {
  const base = `# ${business.name}

> Owner-led lawn and landscape care based in Raleigh, North Carolina.

## Contact

- Phone: ${business.phone}
- Published hours: ${business.publishedHours}
- Primary market: Raleigh, NC and surrounding Triangle communities
- Instagram: ${business.instagram}
- Google reviews: ${business.googleReviews}

## Services

${services.map((service) => `- ${service.title}: ${service.short}`).join('\n')}

## Service areas

${areas.map((area) => `- ${area.name}, ${area.region}`).join('\n')}

## Important accuracy notes

- No public email address or verified street address is published on this website.
- Service availability, scheduling, estimate scope, price, and promotional eligibility must be confirmed directly with Envision.
- The quote form prepares an SMS message on the visitor's device; it does not claim that a request was sent.
`;
  if (!full) return base;
  return `${base}
## Company

Envision Landscaping LLC is led by owner Kyle Young. The business's published story emphasizes hard work, reliability, clear communication, and treating each property with care.

## Process

1. Share the property location, service, and project details.
2. Envision reviews the scope and property when needed.
3. Approve the estimate and choose a service date.
4. Review the result and address questions before the work is closed.

## Customer-feedback themes

Published customer reviews repeatedly mention professional communication, reasonable estimates, prompt scheduling, trust, and clean finished work. Visit the linked Google review profile for current complete reviews.

## Current website offers

- WELCOME15: 15% off a first lawn-care service package.
- SEASON50: $50 off a seasonal maintenance package.
- Conditions, availability, and eligibility must be confirmed before service.
`;
}

async function write(relativePath, contents) {
  const file = join(root, relativePath);
  const normalizedContents = `${contents.replace(/[ \t]+$/gm, '').trimEnd()}\n`;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, normalizedContents);
}

await mkdir(join(root, 'assets/vendor'), { recursive: true });
await copyFile(
  join(root, 'node_modules/maplibre-gl/dist/maplibre-gl.js'),
  join(root, 'assets/vendor/maplibre-gl.js'),
);
await copyFile(
  join(root, 'node_modules/maplibre-gl/dist/maplibre-gl.css'),
  join(root, 'assets/vendor/maplibre-gl.css'),
);

const pageEntries = [
  ['index', homePage()],
  ['services', servicesPage()],
  ['about', aboutPage()],
  ['gallery', galleryPage()],
  ['reviews', reviewsPage()],
  ['contact', contactPage()],
  ['service-areas', serviceAreasPage()],
  ['privacy', legalPage('privacy')],
  ['terms', legalPage('terms')],
  ...services.map((service) => [
    `services/${service.slug}`,
    servicePage(service),
  ]),
  ...areas.map((area) => [`service-areas/${area.slug}`, areaPage(area)]),
];

for (const [path, html] of pageEntries) {
  await write(path === 'index' ? 'index.html' : `${path}.html`, html);
}

await write('404.html', notFoundPage());
await write('sitemap.xml', sitemapXml(pageEntries.map(([path]) => path)));
await write(
  'robots.txt',
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);
await write('llms.txt', llmsText(false));
await write('llms-full.txt', llmsText(true));

console.log(`Built ${pageEntries.length} canonical pages plus 404/support files.`);
