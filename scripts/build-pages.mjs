#!/usr/bin/env node

import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const origin = 'https://envisionlandscapingllc.com';
const jobberEmbedId = '152dfe43-b7b8-4665-b208-c0f34dac1803-2057108';
const jobberEmbedCss =
  'https://d3ey4dbjkt2f6s.cloudfront.net/assets/external/work_request_embed.css';
const jobberEmbedScript =
  'https://d3ey4dbjkt2f6s.cloudfront.net/assets/static_link/work_request_embed_snippet.js';
const jobberFormUrl =
  'https://clienthub.getjobber.com/client_hubs/152dfe43-b7b8-4665-b208-c0f34dac1803/public/work_request/embedded_work_request_form?form_id=2057108';
const googleTagManagerId = 'GTM-TK4WJG52';
const siteLastModified = '2026-08-26';
const googleSiteVerification = '-LK9I0YqBf9eNzXHW7bNKepdZbfF2hQ2-NrThUllYmA';

const business = {
  name: 'Envision Landscaping LLC',
  shortName: 'Envision Landscaping',
  owner: 'Kyle Young',
  phone: '(984) 338-6483',
  phoneHref: '+19843386483',
  email: 'Kyle@envisionlandscapingllc.com',
  instagram: 'https://www.instagram.com/envision_landscaping_llc/',
  facebook:
    'https://www.facebook.com/p/Envision-Landscaping-LLC-61571682441315/',
  googleReviews:
    'https://www.google.com/maps/search/?api=1&query=Envision%20Landscaping%20LLC&query_place_id=ChIJ3xWsRgz1rIkR7xzJrM3_Fy0',
  googleWriteReview:
    'https://search.google.com/local/writereview?placeid=ChIJ3xWsRgz1rIkR7xzJrM3_Fy0',
  availabilityNote: 'Open 24 hours',
  rating: '4.9',
  reviewCount: 31,
};

async function loadGoogleReviewData() {
  try {
    return JSON.parse(await readFile(join(root, 'data', 'google-reviews.json'), 'utf8'));
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.warn('Google review data could not be read; using verified local fallbacks.');
    }
    return null;
  }
}

const googleReviewData = await loadGoogleReviewData();
if (googleReviewData?.source === 'google-business-profile') {
  business.rating = Number(googleReviewData.rating || business.rating).toFixed(1);
  business.reviewCount = Number(googleReviewData.reviewCount || business.reviewCount);
}

const publishedServiceSlugs = [
  'lawn-maintenance',
  'landscape-maintenance',
  'aeration-overseeding',
  'spring-fall-cleanups',
  'mulch-pine-straw',
  'landscape-design-planting',
];

const areas = [
  {
    slug: 'raleigh-nc',
    name: 'Raleigh',
    region: 'NC',
    latitude: 35.7803977,
    longitude: -78.6390989,
    services: ['Lawn maintenance', 'Landscape care', 'Mulch', 'Seasonal cleanups'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Envision provides lawn maintenance, seasonal cleanup, mulch, and landscape care for properties across Raleigh.',
    planning: {
      title: 'Account for curb access, established trees, and daily property use.',
      body:
        'For a Raleigh estimate, identify anything that changes how the crew reaches or works around the property. Street parking, mature canopy, active irrigation, pedestrian traffic, and narrow side access can all affect the visit plan when they are present. Photos of the front approach and work area help Kyle separate routine service from extra preparation.',
      checks: [
        'Mark street-parking limits, gates, pets, and the preferred equipment route.',
        'Point out irrigation heads, exposed roots, low branches, and utility covers.',
        'Explain which curb, sidewalk, driveway, or patio surfaces need final cleanup.',
        'Share any event date or access window that matters before scheduling.',
      ],
    },
  },
  {
    slug: 'cary-nc',
    name: 'Cary',
    region: 'NC',
    latitude: 35.7882893,
    longitude: -78.7812081,
    services: ['Recurring lawn care', 'Mulch', 'Design and planting', 'Cleanups'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Homeowners in Cary can call Envision for routine lawn care and one-time landscape projects.',
    planning: {
      title: 'Clarify gates, irrigation, and finish expectations before the visit.',
      body:
        'A Cary request is easier to scope when the estimate shows how the crew will enter, where irrigation components sit, and which finished surfaces border the work. If an HOA, shared drive, locked gate, invisible fence, or pet routine affects access, include it with the first message. Those details help avoid a generic plan that misses how the property is actually used.',
      checks: [
        'Photograph side gates, fence latches, tight turns, and any shared access point.',
        'Flag sprinkler heads, valve boxes, lighting wire, and invisible-fence markers.',
        'Name the sidewalks, patios, porches, or driveway edges that must stay clean.',
        'Provide applicable HOA timing, parking, or material-placement requirements.',
      ],
    },
  },
  {
    slug: 'apex-nc',
    name: 'Apex',
    region: 'NC',
    latitude: 35.7325352,
    longitude: -78.8505516,
    services: ['Mowing and edging', 'Bed care', 'Mulch', 'Landscape maintenance'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Envision serves Apex with dependable mowing, bed care, seasonal cleanup, mulch, and landscape maintenance.',
    planning: {
      title: 'Map slopes, curved beds, and tree-root zones clearly.',
      body:
        'For an Apex property, wide photos from the curb and closer views of the work area make the estimate more useful. Note sloped turf, curving bed lines, surface roots, corner-lot exposure, or heavy leaf collection when any of those conditions apply. Kyle can then review where hand work, material placement, or a different equipment approach may belong in the approved scope.',
      checks: [
        'Show grade changes, retaining edges, drainage paths, and low or soft ground.',
        'Identify roots, shallow edging, stepping stones, and delicate border plants.',
        'Explain where debris or delivered material can be staged without blocking traffic.',
        'Call out public sidewalks, corner visibility, and frequently used entrances.',
      ],
    },
  },
  {
    slug: 'morrisville-nc',
    name: 'Morrisville',
    region: 'NC',
    latitude: 35.824341,
    longitude: -78.8300321,
    services: ['Recurring lawn service', 'Landscape care', 'Cleanups', 'Outdoor improvements'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Envision helps Morrisville properties stay neat with recurring lawn service and focused outdoor improvements.',
    planning: {
      title: 'Plan compact work areas and adjoining-property boundaries.',
      body:
        'Morrisville estimates should make tight access and shared surroundings easy to understand. If the property is a townhome, has limited parking, sits close to neighboring turf, or offers only a narrow route to the backyard, mention that before the visit. Clear boundary photos help Kyle define where Envision’s responsibility begins and ends without assuming that every visible lawn or bed belongs to the request.',
      checks: [
        'Confirm assigned parking, loading space, alley access, and community restrictions.',
        'Mark shared turf lines, adjoining beds, utility cabinets, and common walkways.',
        'Measure the narrowest gate or passage if larger equipment may be needed.',
        'Choose a safe temporary location for tools, debris, or packaged material.',
      ],
    },
  },
  {
    slug: 'fuquay-varina-nc',
    name: 'Fuquay-Varina',
    region: 'NC',
    latitude: 35.5843849,
    longitude: -78.7998691,
    services: ['Lawn maintenance', 'Seasonal cleanups', 'Mulch', 'Landscape care'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'From routine lawn maintenance to seasonal cleanup, Envision serves properties throughout Fuquay-Varina.',
    planning: {
      title: 'Break larger properties into clear work zones.',
      body:
        'A Fuquay-Varina request may be easier to price when front, side, and rear areas are described separately. If the site includes a long drive, detached structure, drainage ditch, broad open lawn, septic area, or a distant equipment entrance, show it in the estimate photos. Dividing the property into zones keeps an expansive request understandable and makes optional work easier to separate.',
      checks: [
        'Label each lawn, bed, outbuilding, fence line, and remote corner in the request.',
        'Note ditch banks, culverts, wet spots, steep grades, and septic-field boundaries.',
        'Explain trailer access, turnaround room, long carrying distances, and locked entries.',
        'Separate priority work from acreage or outer areas that may be optional.',
      ],
    },
  },
  {
    slug: 'holly-springs-nc',
    name: 'Holly Springs',
    region: 'NC',
    latitude: 35.6512655,
    longitude: -78.8336218,
    services: ['Lawn maintenance', 'Bed care', 'Trimming', 'Seasonal cleanups'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Envision provides practical, detail-focused lawn and landscape care throughout Holly Springs.',
    planning: {
      title: 'Show fenced access, turf transitions, and drainage concerns.',
      body:
        'For a Holly Springs estimate, include the route to fenced backyards and any place where sod, seed, beds, or natural areas meet. Play equipment, downspout outlets, compacted ground, new planting zones, and drainage near the foundation can change how a project should be approached when present. A few labeled photos help distinguish appearance concerns from soil, water, or access constraints.',
      checks: [
        'Measure fence openings and identify locks, steps, playsets, or patio pinch points.',
        'Photograph thin turf, sod seams, bare patches, and transitions into natural areas.',
        'Trace downspouts, runoff routes, foundation edges, and recurring puddle locations.',
        'Mark recently planted material or young grass that needs careful protection.',
      ],
    },
  },
  {
    slug: 'durham-nc',
    name: 'Durham',
    region: 'NC',
    latitude: 35.996653,
    longitude: -78.9018053,
    services: ['Lawn maintenance', 'Cleanups', 'Mulch', 'Landscape projects'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Envision serves Durham-area properties with lawn maintenance, cleanups, mulch, and landscape project support.',
    planning: {
      title: 'Document shade, roots, leaf volume, and uneven terrain.',
      body:
        'A Durham estimate benefits from photos taken at different points across the work area, especially when tree canopy creates mixed sun and shade. Large roots, heavy leaf accumulation, irregular grade, older edging, or separate street and alley access should be shown rather than left to assumption. Those conditions can affect cleanup volume, turf expectations, hand-work needs, and the practical route through the property.',
      checks: [
        'Show dense canopy, shaded turf, exposed roots, stumps, and low overhead limbs.',
        'Estimate leaf or debris volume and identify an approved collection location.',
        'Flag uneven ground, stone borders, older pathways, and concealed drop-offs.',
        'Confirm whether the best entrance is from the street, driveway, alley, or side yard.',
      ],
    },
  },
  {
    slug: 'garner-nc',
    name: 'Garner',
    region: 'NC',
    latitude: 35.7112642,
    longitude: -78.6141709,
    services: ['Lawn maintenance', 'Landscape care', 'Mulch', 'Seasonal cleanups'],
    serviceSlugs: publishedServiceSlugs,
    intro:
      'Garner customers can contact Envision for lawn maintenance, landscape care, mulch, and seasonal cleanups.',
    planning: {
      title: 'Define open lawn edges, drainage features, and equipment access.',
      body:
        'For a Garner estimate, show the full relationship between the lawn, driveway, roadside edge, and planting beds. Open sun, broad front areas, drainage swales, ditch banks, driveway islands, or deep setbacks can influence travel and finishing time when they are part of the property. The request should also show where equipment can enter without crossing soft ground or obstructing the road.',
      checks: [
        'Photograph roadside edges, swales, culverts, mailbox beds, and driveway islands.',
        'Mark soggy ground, washouts, steep banks, and places that should stay untouched.',
        'Confirm trailer parking, equipment entry, turnaround space, and setback distance.',
        'Identify the exact boundary between maintained turf and rough or natural growth.',
      ],
    },
  },
];

const commonProcess = [
  {
    title: 'Tell us what the property needs',
    body: 'Call or submit an estimate request with the property location, service, and a few details about the work.',
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

const projectImage = (name) => `/assets/images/projects/${name}`;

const beforeAfterProjects = [
  {
    title: 'Backyard lawn makeover',
    type: 'Lawn renovation',
    before: projectImage('backyard-makeover-before.jpg'),
    after: projectImage('backyard-makeover-after.jpg'),
    beforeAlt: 'Bare graded backyard before lawn renovation work',
    afterAlt: 'Established green backyard after aeration and overseeding work',
  },
  {
    title: 'Front property cleanup',
    type: 'Seasonal cleanup',
    before: projectImage('front-refresh-before.jpg'),
    after: projectImage('front-refresh-after.jpg'),
    beforeAlt: 'Front property before seasonal shrub and bed cleanup',
    afterAlt: 'Front property after seasonal shrub and bed cleanup',
  },
  {
    title: 'Walkway landscape reset',
    type: 'Landscape maintenance',
    before: projectImage('walkway-refresh-before.jpg'),
    after: projectImage('walkway-refresh-after.jpg'),
    beforeAlt: 'Residential walkway landscaping before maintenance',
    afterAlt: 'Residential walkway landscaping after maintenance',
  },
];

const projectGalleryItems = [
  [projectImage('striped-lawn-hero.jpg'), 'Striped residential lawn after maintenance', 'Lawn maintenance'],
  [projectImage('lawn-crew-stripes.jpg'), 'Lawn maintenance in progress with clean mowing lines', 'Lawn maintenance'],
  [projectImage('finished-lawn-wide.jpg'), 'Wide finished lawn after routine care', 'Lawn maintenance'],
  [projectImage('maintained-property.jpg'), 'Maintained lawn and landscape around a residential driveway', 'Lawn maintenance'],
  [projectImage('landscape-bed-after.jpg'), 'Finished garden bed after cleanup and fresh material', 'Landscape maintenance'],
  [projectImage('landscape-lawn-after.jpg'), 'Finished lawn and landscape after detail work', 'Landscape maintenance'],
  [projectImage('landscape-entry-after.jpg'), 'Finished entry landscape after trimming and bed maintenance', 'Landscape maintenance'],
  [projectImage('landscape-shrubs-after.jpg'), 'Finished evergreen and hedge trimming', 'Landscape maintenance'],
  [projectImage('mulch-curved-bed.jpg'), 'Fresh mulch across a broad curved landscape bed', 'Mulch installation'],
  [projectImage('mulch-foundation-bed.jpg'), 'Fresh mulch installed along a foundation bed', 'Mulch installation'],
  [projectImage('mulch-rose-bed.jpg'), 'Finished mulch installation beside a driveway and rose bed', 'Mulch installation'],
  [projectImage('mulch-walkway.jpg'), 'Fresh mulch defining a residential walkway', 'Mulch installation'],
  [projectImage('aeration-machine.jpg'), 'Core aeration equipment working across a lawn', 'Aeration & overseeding'],
  [projectImage('aeration-cores.jpg'), 'Fresh soil cores visible after lawn aeration', 'Aeration & overseeding'],
  [projectImage('aeration-plugs.jpg'), 'Close view of soil plugs removed during aeration', 'Aeration & overseeding'],
  [projectImage('overseeding-result.jpg'), 'Lawn result after aeration and overseeding', 'Aeration & overseeding'],
  [projectImage('backyard-makeover-after-wide.jpg'), 'Wide view of the backyard makeover after lawn establishment', 'Backyard makeover'],
];

const services = [
  {
    slug: 'lawn-maintenance',
    title: 'Lawn Maintenance',
    navTitle: 'Lawn Maintenance',
    image: projectImage('striped-lawn-hero.jpg'),
    imageAlt: 'Striped residential lawn maintained by Envision Landscaping',
    short:
      'Routine mowing, edging, trimming, and cleanup that keeps the property looking sharp.',
    meta:
      'Reliable lawn maintenance in Raleigh, NC, including mowing, edging, trimming, and property cleanup.',
    h1: 'Lawn Maintenance in Raleigh, NC',
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
    slug: 'landscape-maintenance',
    title: 'Landscape Maintenance',
    navTitle: 'Landscape Maintenance',
    image: projectImage('landscape-entry-after.jpg'),
    imageAlt: 'Finished residential entry landscape after trimming and bed maintenance',
    short:
      'Ongoing bed, shrub, lawn, and seasonal care for a more finished property.',
    meta:
      'Landscape maintenance in Raleigh, NC, including pruning, trimming, weed care, lawn work, and seasonal service.',
    h1: 'Landscape Maintenance in Raleigh, NC',
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
    slug: 'aeration-overseeding',
    title: 'Aeration & Overseeding',
    navTitle: 'Aeration & Overseeding',
    image: projectImage('backyard-makeover-after.jpg'),
    imageAlt: 'Established green backyard after lawn renovation, aeration, and overseeding work',
    heroImage: projectImage('aeration-overseeding-hero.jpg'),
    heroImageAlt: 'Finished striped residential lawn selected for Aeration and Overseeding',
    heroImageWidth: 998,
    heroImageHeight: 1280,
    heroPosition: 'center 61%',
    short:
      'Core aeration and overseeding work planned around the lawn, season, and property conditions.',
    meta:
      'Lawn aeration and overseeding in Raleigh, NC, with property-specific preparation and service planning.',
    h1: 'Aeration & Overseeding in Raleigh, NC',
    intro:
      'Compacted soil and thin turf can keep a lawn from filling in evenly. Envision can review the property, prepare the lawn, complete core aeration, and overseed the approved areas as one coordinated service.',
    includes: [
      'Property and turf-condition review',
      'Core aeration across approved lawn areas',
      'Overseeding based on the scoped lawn',
      'Clear next-step watering and access guidance',
    ],
    faqs: [
      [
        'What does core aeration do?',
        'Core aeration removes small plugs of soil to open the turf and reduce compaction in the approved lawn areas.',
      ],
      [
        'Can aeration and overseeding be done together?',
        'Yes. Envision offers the work together when the lawn, timing, and approved scope are a fit.',
      ],
      [
        'How should I prepare for the service?',
        'Share irrigation, access, and known obstacle details when requesting the estimate. Kyle confirms the property-specific preparation before service.',
      ],
    ],
  },
  {
    slug: 'spring-fall-cleanups',
    title: 'Spring & Fall Cleanups',
    navTitle: 'Seasonal Cleanups',
    image: projectImage('front-refresh-after.jpg'),
    imageAlt: 'Front property after seasonal shrub, bed, and debris cleanup',
    short:
      'Seasonal clearing, trimming, and reset work that gets the yard back under control.',
    meta:
      'Spring and fall yard cleanup services in Raleigh, NC, including debris removal, trimming, and landscape-bed cleanup.',
    h1: 'Spring & Fall Cleanups in Raleigh, NC',
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
    slug: 'leaf-removal',
    title: 'Leaf Removal',
    navTitle: 'Leaf Removal',
    localize: false,
    image: '/assets/images/placeholders/leaf-removal-stock-unsplash.jpg',
    imageAlt: 'Temporary stock photo of seasonal leaf clearing; not an Envision project',
    stockPlaceholder: true,
    short:
      'Quote-only leaf clearing and seasonal debris removal planned around the property, access, and collection needs.',
    meta:
      'Request a quote for leaf removal in the Raleigh area from Envision Landscaping. Property-specific leaf clearing and debris-removal scope.',
    h1: 'Leaf Removal in Raleigh, NC',
    intro:
      'When fall leaves build up across lawns, beds, and hard surfaces, Envision can review the property and prepare a quote for the specific clearing and collection work needed.',
    localContext: {
      title: 'Leaf removal for Raleigh-area properties',
      body:
        'Envision accepts quote requests for leaf clearing from its published Raleigh and Triangle service area: Raleigh, Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Garner. The exact property, collection areas, access, debris volume, and scheduling fit are confirmed before work is booked.',
    },
    includes: [
      'Leaf clearing from approved lawn, bed, and hard-surface areas',
      'Collection and removal method confirmed in the quote',
      'Property-specific access and debris-volume review',
      'Final cleanup of approved hard surfaces',
    ],
    faqs: [
      [
        'What does leaf removal include?',
        'The quote identifies the approved collection areas, debris volume, access, and removal method. Ask to include lawns, beds, walkways, patios, or other specific areas in the request.',
      ],
      [
        'Do you offer leaf removal as a one-time service?',
        'One-time leaf removal can be reviewed by quote. Share photos and the property details so Envision can confirm the scope and scheduling options.',
      ],
      [
        'How do I get a leaf-removal quote?',
        'Use the estimate request to share the property address, the areas that need clearing, access details, timing, and helpful photos. Envision will confirm the next step directly.',
      ],
    ],
  },
  {
    slug: 'christmas-light-installation',
    title: 'Christmas Light Installation',
    navTitle: 'Christmas Lights',
    localize: false,
    image: '/assets/images/placeholders/christmas-lights-stock-unsplash.jpg',
    imageAlt: 'Temporary stock photo of a holiday-light display; not an Envision project',
    stockPlaceholder: true,
    short:
      'Quote-only seasonal Christmas-light installation planned around the property, selected display areas, and timing.',
    meta:
      'Request a quote for Christmas light installation in the Raleigh area from Envision Landscaping. Seasonal, property-specific display planning and installation.',
    seoTitle: 'Christmas Light Installation Raleigh, NC | Envision',
    h1: 'Christmas Light Installation in Raleigh, NC',
    intro:
      'Plan the seasonal display around the property. Envision can review the areas you want illuminated and provide a quote for the approved installation scope and timing.',
    localContext: {
      title: 'Christmas-light installation across the Triangle',
      body:
        'Envision reviews Christmas-light installation requests from its published Raleigh and Triangle service area: Raleigh, Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Garner. Rooflines, trees, entries, access, material plans, and timing are confirmed for the individual property before scheduling.',
    },
    includes: [
      'Property and display-area review',
      'Installation scope confirmed in the quote',
      'Access, timing, and removal needs discussed before scheduling',
      'Final walkthrough of the approved display areas',
    ],
    faqs: [
      [
        'What is included with Christmas light installation?',
        'The quote defines the display areas, materials or lights supplied by the customer or included in the approved scope, access needs, installation timing, and any removal work requested.',
      ],
      [
        'When should I request a Christmas-light quote?',
        'Requesting a quote early gives Envision time to review the property and discuss preferred installation timing before the seasonal schedule fills.',
      ],
      [
        'Do you provide Christmas-light removal?',
        'Removal can be discussed as part of the quote. Include that request and the preferred timing so it can be clearly scoped before scheduling.',
      ],
    ],
  },
  {
    slug: 'mulch-pine-straw',
    title: 'Mulch & Pine Straw',
    navTitle: 'Mulch & Pine Straw',
    image: projectImage('mulch-curved-bed.jpg'),
    imageAlt: 'Fresh mulch installed across a broad curved landscape bed',
    short:
      'Fresh bed material installed with clean edges and even coverage.',
    meta:
      'Mulch and pine-straw installation in Raleigh, NC, with bed preparation, clean edges, and even coverage.',
    h1: 'Mulch & Pine Straw in Raleigh, NC',
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
    image: projectImage('backyard-makeover-after-wide.jpg'),
    imageAlt: 'Finished backyard landscape and established lawn after a large property makeover',
    short:
      'Practical landscape planning, plant selection, sod, and installation support.',
    meta:
      'Landscape consultation, design, planting, and sod support for Raleigh-area outdoor projects.',
    h1: 'Design & Planting in Raleigh, NC',
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
];

const serviceProfiles = {
  'lawn-maintenance': {
    jobHeading: 'Lawn maintenance jobs for a cleaner, more consistent yard',
    jobIntro:
      'Each visit is scoped to the property. These are the core lawn-care jobs Raleigh-area homeowners can ask Envision to include.',
    jobs: [
      {
        title: 'Routine lawn mowing',
        description:
          'Recurring mowing keeps turf at a practical height and gives the property a consistently cared-for appearance. The visit plan is based on growth, weather, access, and the size of the lawn.',
        image: projectImage('lawn-crew-stripes.jpg'),
        alt: 'Envision lawn maintenance in progress with fresh mowing lines',
      },
      {
        title: 'Edging and string trimming',
        description:
          'Edges along walks, driveways, beds, fences, and obstacles are addressed so the finished lawn looks intentional instead of simply cut.',
        image: projectImage('striped-lawn-hero.jpg'),
        alt: 'Fresh mowing stripes and clean curb lines on a maintained lawn',
      },
      {
        title: 'Blowing and final cleanup',
        description:
          'Loose clippings are cleared from hard surfaces after mowing and trimming, leaving patios, sidewalks, entrances, and driveways ready to use.',
        image: projectImage('finished-lawn-wide.jpg'),
        alt: 'Wide finished lawn after mowing and final cleanup',
      },
      {
        title: 'Overgrown-lawn reset',
        description:
          'If regular maintenance has fallen behind, share photos and the property details. Envision can review the height, access, and cleanup needs before defining a one-time reset.',
        image: projectImage('maintained-property.jpg'),
        alt: 'Maintained residential lawn and landscape beside a driveway',
      },
    ],
    process: [
      ['Review the lawn', 'Share the address, approximate lawn size, access details, and whether the request is recurring care or a one-time reset.'],
      ['Set the mowing scope', 'Confirm mowing areas, edge lines, obstacles, gates, and the hard surfaces that should be blown clean.'],
      ['Complete the lawn-care visit', 'The crew mows, trims, edges, and cleans up according to the approved property-specific scope.'],
      ['Confirm the next visit', 'For recurring lawn maintenance, timing is adjusted around growth, weather, and the service plan.'],
    ],
  },
  'landscape-maintenance': {
    proofComparison: {
      before: projectImage('walkway-refresh-before.jpg'),
      beforeAlt: 'Residential walkway landscape before bed and shrub maintenance',
      after: projectImage('walkway-refresh-after.jpg'),
      afterAlt: 'The same residential walkway after bed and shrub maintenance',
    },
    jobHeading: 'Landscape maintenance for the details beyond mowing',
    jobIntro:
      'Envision can focus a maintenance visit on the shrubs, beds, edges, weeds, and seasonal details shaping the overall property.',
    jobs: [
      {
        title: 'Shrub and hedge trimming',
        description:
          'Overgrown shrubs and hedges are trimmed to restore cleaner lines, improve access, and keep plants from visually crowding walks, windows, and beds.',
        image: projectImage('landscape-shrubs-after.jpg'),
        alt: 'Finished evergreen and hedge trimming after landscape maintenance',
      },
      {
        title: 'Garden-bed maintenance',
        description:
          'Beds can be cleared of visible debris and unwanted growth, then refined around established plants so the landscape reads as one finished space.',
        image: projectImage('landscape-bed-after.jpg'),
        alt: 'Finished garden bed after cleanup and fresh material',
      },
      {
        title: 'Bed-edge and weed cleanup',
        description:
          'Defined bed lines and targeted weed removal help separate lawn from planting areas and make existing landscaping look more deliberate.',
        image: projectImage('walkway-refresh-after.jpg'),
        alt: 'Finished landscape and clean bed lines along a residential walkway',
      },
    ],
    process: [
      ['Identify priority areas', 'Share the shrubs, beds, edges, and problem areas that need attention, along with photos when possible.'],
      ['Confirm plant and bed scope', 'Review what should be trimmed, cleaned, edged, or left untouched before the estimate is approved.'],
      ['Perform the detail work', 'The crew completes the approved trimming, bed maintenance, weed cleanup, and debris work.'],
      ['Review the finished landscape', 'Walk the result and discuss any future seasonal or recurring maintenance needs.'],
    ],
  },
  'aeration-overseeding': {
    proofComparison: {
      before: projectImage('backyard-makeover-before.jpg'),
      beforeAlt: 'Backyard lawn area before renovation, aeration, and overseeding',
      after: projectImage('backyard-makeover-after.jpg'),
      afterAlt: 'The same backyard after the new lawn became established',
    },
    jobHeading: 'Aeration and overseeding from soil cores to new growth',
    jobIntro:
      'These project photos show the core steps Envision can scope together for a lawn that needs relief from compaction and better seed contact.',
    jobs: [
      {
        title: 'Core aeration',
        description:
          'The aerator removes small plugs across the approved lawn areas, opening compacted turf so air, water, and seed can reach the soil more directly.',
        image: projectImage('aeration-machine.jpg'),
        alt: 'Core aeration machine working across a residential lawn',
      },
      {
        title: 'Visible soil cores',
        description:
          'Fresh cores on the surface show where the machine opened the lawn. They are a normal part of the service and return organic material to the turf as they break down.',
        image: projectImage('aeration-cores.jpg'),
        alt: 'Soil cores visible across turf after core aeration',
      },
      {
        title: 'Overseeding the approved lawn',
        description:
          'Seed is applied across the scoped areas after preparation and aeration, with the amount and timing based on the property and service plan.',
        image: projectImage('overseeding-machine.jpg'),
        alt: 'Equipment applying seed across an aerated lawn',
      },
      {
        title: 'Established lawn result',
        description:
          'The final result depends on the lawn, weather, watering, and care after service. Kyle confirms the property-specific next steps when the work is scheduled.',
        image: projectImage('overseeding-result.jpg'),
        alt: 'Green lawn result after aeration and overseeding work',
      },
    ],
    process: [
      ['Review the turf', 'Share the property, lawn condition, access, irrigation details, and the areas you want evaluated for aeration and overseeding.'],
      ['Prepare the service area', 'Confirm obstacles, marked utilities or irrigation features, mowing expectations, and the exact lawn areas included in the estimate.'],
      ['Aerate and overseed', 'Complete core aeration and seed application across the approved areas using the property-specific scope.'],
      ['Follow the care plan', 'Review access and watering guidance with Kyle so the next steps are clear after service.'],
    ],
  },
  'spring-fall-cleanups': {
    proofComparison: {
      before: projectImage('front-refresh-before.jpg'),
      beforeAlt: 'Front property before seasonal shrub and bed cleanup',
      after: projectImage('front-refresh-after.jpg'),
      afterAlt: 'The same front property after seasonal shrub and bed cleanup',
    },
    jobHeading: 'Seasonal yard-cleanup jobs Envision can combine',
    jobIntro:
      'A cleanup can target one problem area or reset the full yard. The final estimate reflects the debris volume, access, and work selected for the property.',
    jobs: [
      {
        title: 'Seasonal shrub cleanup',
        description:
          'Overgrown and spent seasonal growth can be cut back as scoped so the home, lawn, and bed lines read clearly again.',
        image: projectImage('front-refresh-after.jpg'),
        alt: 'Front property after seasonal shrub and bed cleanup',
      },
      {
        title: 'Bed and edge cleanup',
        description:
          'Leaves, loose debris, and unwanted growth can be cleared from approved beds before the surrounding edges receive a clean finish.',
        image: projectImage('landscape-bed-after.jpg'),
        alt: 'Finished landscape bed after seasonal cleanup work',
      },
      {
        title: 'Garden-bed cleanup',
        description:
          'Beds can be cleared of leaves, visible debris, and spent seasonal material while established plants and the approved bed layout are respected.',
        image: projectImage('landscape-lawn-after.jpg'),
        alt: 'Finished lawn and landscape after cleanup and detail work',
      },
      {
        title: 'Shrub and perennial cutbacks',
        description:
          'Selected shrubs and spent growth can be trimmed as scoped to reduce overgrowth and prepare the landscape for the next season.',
        image: projectImage('landscape-entry-after.jpg'),
        alt: 'Finished entry landscape after seasonal trimming and debris care',
      },
    ],
    process: [
      ['Estimate the cleanup', 'Share photos and identify the lawn, beds, leaves, sticks, and overgrowth that should be included.'],
      ['Set collection priorities', 'Confirm the cleanup zones, access points, trimming requests, and any areas that should not be disturbed.'],
      ['Clear and detail the property', 'The crew gathers approved debris, cleans bed and lawn areas, and completes the scoped cutbacks.'],
      ['Finish with a property check', 'Review the cleaned areas and decide whether mulch, planting, or recurring maintenance should be estimated separately.'],
    ],
  },
  'leaf-removal': {
    jobHeading: 'Leaf-removal quotes built around the property',
    jobIntro:
      'These temporary stock photos illustrate the seasonal service only; they are not Envision projects. The final scope stays quote-only until Envision reviews the property.',
    jobs: [
      { title: 'Property and debris review', description: 'Share photos, collection areas, access details, and timing so Envision can assess the request before quoting.', image: '/assets/images/placeholders/leaf-removal-stock-unsplash.jpg', alt: 'Temporary stock leaf-clearing photo; not an Envision project', stockPlaceholder: true },
      { title: 'Approved-area clearing', description: 'The quote can identify the lawn, beds, walkways, patios, and other approved areas that need seasonal leaf clearing.', image: '/assets/images/placeholders/leaf-removal-stock-unsplash.jpg', alt: 'Temporary stock leaf-clearing photo; not an Envision project', stockPlaceholder: true },
      { title: 'Collection plan', description: 'Collection method and debris volume are reviewed with the property so the approved scope is clear before work is scheduled.', image: '/assets/images/placeholders/leaf-removal-stock-unsplash.jpg', alt: 'Temporary stock leaf-clearing photo; not an Envision project', stockPlaceholder: true },
      { title: 'Final surface cleanup', description: 'The approved hard surfaces are checked at the end of the visit, with any additional needs kept separate in the quote.', image: '/assets/images/placeholders/leaf-removal-stock-unsplash.jpg', alt: 'Temporary stock leaf-clearing photo; not an Envision project', stockPlaceholder: true },
    ],
    process: [
      ['Send the property details', 'Share the address, photos, leaf-collection areas, access details, and preferred timing.'],
      ['Review the quote', 'Envision confirms the proposed scope, debris volume, collection method, and scheduling options.'],
      ['Complete approved clearing', 'The crew clears and collects only the areas included in the approved quote.'],
      ['Check the finished areas', 'Review the approved surfaces and discuss any additional seasonal work separately.'],
    ],
  },
  'christmas-light-installation': {
    jobHeading: 'Christmas-light installation planned by quote',
    jobIntro:
      'These temporary stock photos illustrate the seasonal service only; they are not Envision projects. Each display is planned by quote.',
    jobs: [
      { title: 'Display-area review', description: 'Share the roofline, trees, entry, or landscape areas you want reviewed, along with property photos and timing preferences.', image: '/assets/images/placeholders/christmas-lights-stock-unsplash.jpg', alt: 'Temporary stock holiday-light display photo; not an Envision project', stockPlaceholder: true },
      { title: 'Quote and installation plan', description: 'The quote defines the approved display areas, access needs, timing, and whether customer-supplied or quoted materials are part of the scope.', image: '/assets/images/placeholders/christmas-lights-stock-unsplash.jpg', alt: 'Temporary stock holiday-light display photo; not an Envision project', stockPlaceholder: true },
      { title: 'Approved installation', description: 'Installation follows the property-specific scope confirmed before the service date.', image: '/assets/images/placeholders/christmas-lights-stock-unsplash.jpg', alt: 'Temporary stock holiday-light display photo; not an Envision project', stockPlaceholder: true },
      { title: 'Seasonal removal discussion', description: 'If removal is requested, its timing and scope are documented separately in the quote before scheduling.', image: '/assets/images/placeholders/christmas-lights-stock-unsplash.jpg', alt: 'Temporary stock holiday-light display photo; not an Envision project', stockPlaceholder: true },
    ],
    process: [
      ['Share the display goal', 'Send property photos, display areas, access details, and preferred seasonal timing.'],
      ['Confirm the quote', 'Review the approved installation scope, materials plan, timing, and any requested removal work.'],
      ['Install the approved display', 'The crew completes the agreed display work according to the property-specific quote.'],
      ['Walk the result', 'Review the approved display areas and keep any follow-up needs separate from the completed scope.'],
    ],
  },
  'mulch-pine-straw': {
    jobHeading: 'Mulch and pine-straw work from preparation to finish',
    jobIntro:
      'A finished installation starts before material is spread. Envision can scope the bed preparation, material choice, coverage, and cleanup together.',
    jobs: [
      {
        title: 'Hardwood mulch installation',
        description:
          'Hardwood mulch is placed in approved beds with even coverage and attention around trunks, shrubs, and hard surfaces for a clean finished appearance.',
        image: projectImage('mulch-curved-bed.jpg'),
        alt: 'Fresh hardwood mulch across a curved residential bed',
      },
      {
        title: 'Pine-straw installation',
        description:
          'Fresh pine straw can renew established planting areas and create a consistent surface across natural beds after preparation is complete.',
        image: projectImage('mulch-foundation-bed.jpg'),
        alt: 'Fresh bed material installed around established foundation plants',
      },
      {
        title: 'Bed preparation',
        description:
          'Visible weeds, leaves, and loose debris can be addressed before installation so new material is not simply placed over an unfinished bed.',
        image: projectImage('mulch-rose-bed.jpg'),
        alt: 'Prepared rose bed finished with fresh mulch beside a driveway',
      },
      {
        title: 'Edge definition and finishing',
        description:
          'Bed lines and adjacent hard surfaces are cleaned as scoped to give the mulch or pine-straw installation a deliberate boundary and tidy finish.',
        image: projectImage('mulch-walkway.jpg'),
        alt: 'Defined mulch edge beside a residential walkway',
      },
    ],
    process: [
      ['Measure and review the beds', 'Identify material preference, bed locations, approximate dimensions, access, and preparation needs.'],
      ['Prepare the installation areas', 'Complete the approved debris, weed, and edge work before fresh mulch or pine straw is placed.'],
      ['Install even coverage', 'Spread the selected material consistently around plants and landscape features included in the scope.'],
      ['Clean adjacent surfaces', 'Finish by clearing loose material from walks, drives, lawn edges, and other approved hard surfaces.'],
    ],
  },
  'landscape-design-planting': {
    jobHeading: 'Planting and landscape-planning jobs for practical outdoor upgrades',
    jobIntro:
      'Projects can begin with one bed or a larger property refresh. Envision scopes the layout, materials, access, and installation work around the space.',
    jobs: [
      {
        title: 'Landscape consultation and layout',
        description:
          'Start with the property, the problem you want to solve, and inspiration for the finished space. Existing features can be kept, adjusted, or worked around in the plan.',
        image: projectImage('backyard-makeover-after-wide.jpg'),
        alt: 'Finished backyard lawn and landscape after a large makeover',
      },
      {
        title: 'Tree and shrub installation',
        description:
          'New trees and shrubs can be selected and placed around the site conditions, available space, and visual goals confirmed for the project.',
        image: projectImage('landscape-entry-after.jpg'),
        alt: 'Finished residential planting and shrub layout after installation work',
      },
      {
        title: 'Flower and perennial beds',
        description:
          'New or refreshed planting beds can add color, structure, and a stronger transition between the home, lawn, and existing landscape.',
        image: projectImage('mulch-long-bed.jpg'),
        alt: 'Long residential planting bed finished with fresh mulch',
      },
      {
        title: 'Sod installation and lawn repair',
        description:
          'Bare or disrupted lawn areas can be reviewed for sod installation or repair, with the area and preparation requirements defined before quoting.',
        image: projectImage('backyard-makeover-after.jpg'),
        alt: 'Established backyard turf after a lawn renovation project',
      },
    ],
    process: [
      ['Share the project goal', 'Describe the area, the result you want, current problem spots, and any photos or inspiration that clarify the direction.'],
      ['Review the site and layout', 'Evaluate dimensions, access, existing features, and the planting or sod areas that belong in the estimate.'],
      ['Confirm plants and materials', 'Agree on the project scope and selected materials before installation is scheduled.'],
      ['Install and walk the result', 'Complete the approved planting or sod work, then review the finished areas and basic next-step care.'],
    ],
  },
};

const fallbackReviews = [
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

const reviews = googleReviewData?.reviews?.length
  ? googleReviewData.reviews
      .filter(
        (review) => review.text?.trim() && Number(review.rating) === 5,
      )
      .map((review) => ({
        name: review.author || 'Google reviewer',
        service: review.createTime
          ? new Date(review.createTime).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })
          : 'Verified Google review',
        highlight: review.text.trim(),
        rating: Number(review.rating || 5),
      }))
  : fallbackReviews.map((review) => ({ ...review, rating: 5 }));

const homepageFaqs = [
  [
    'What areas does Envision Landscaping serve?',
      'Envision serves Raleigh and surrounding Triangle communities, including Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Garner.',
  ],
  [
    'What lawn and landscaping services are available?',
    'Published services include lawn and landscape maintenance, aeration and overseeding, seasonal cleanups, leaf removal, mulch and pine straw, design and planting, and Christmas light installation by quote.',
  ],
  [
    'How do I request an estimate?',
    'Call (984) 338-6483 or use the estimate form to send your service, property area, and project details to Envision.',
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
  mail: `<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
  chat: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2.2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v8Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>`,
  send: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>`,
  pin: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></svg>`,
  clock: `<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  star: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z"/></svg>`,
  instagram: `<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>`,
  facebook: `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14.5 8H18V4h-3.5C11.2 4 9 6.2 9 9.7V12H6v4h3v7h4v-7h4l.7-4H13V9.8c0-1.2.5-1.8 1.5-1.8Z"/></svg>`,
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
  google: `<svg class="google-mark" aria-hidden="true" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.31v2.77h3.56c2.09-1.92 3.28-4.74 3.28-8.09Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.94l3.66-2.84Z"/><path fill="#EA4335" d="M12 5.37c1.62 0 3.06.56 4.2 1.64l3.15-3.15A10.56 10.56 0 0 0 12 1a11 11 0 0 0-9.82 6.06L5.84 9.9C6.71 7.3 9.14 5.37 12 5.37Z"/></svg>`,
};

function cleanPath(path) {
  return path === 'index' ? '/' : `/${path}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pageUrl(path) {
  return `${origin}${cleanPath(path)}`;
}

function localizedServicePath(service, area) {
  if (service.localize === false) return `/services/${service.slug}`;
  return area.slug === 'raleigh-nc'
    ? `/services/${service.slug}`
    : `/services/${service.slug}/${area.slug}`;
}

function localizedServiceEntryPath(service, area) {
  return localizedServicePath(service, area).replace(/^\//, '');
}

function localBusinessSchema(extra = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${origin}/#business`,
    name: business.name,
    url: origin,
    image: `${origin}/assets/images/hero-home.jpg`,
    logo: `${origin}/assets/images/envision-logo.png`,
    telephone: business.phoneHref,
    email: business.email,
    founder: {
      '@type': 'Person',
      name: business.owner,
    },
    openingHoursSpecification: {
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
      opens: '00:00',
      closes: '23:59',
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
    sameAs: [business.instagram, business.facebook, business.googleReviews],
    knowsAbout: services.map((service) => service.title),
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

function serviceSchema(service, area = null) {
  const profile = serviceProfiles[service.slug];
  const servedAreas = area ? [area] : areas;
  const localizedName = area
    ? `${service.title} in ${area.name}, ${area.region}`
    : service.title;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: localizedName,
    description: area
      ? `${service.short} Available for properties in ${area.name}, ${area.region}, subject to project fit and scheduling.`
      : service.meta,
    url: area ? pageUrl(localizedServiceEntryPath(service, area)) : pageUrl(`services/${service.slug}`),
    areaServed: servedAreas.map((servedArea) => ({
      '@type': 'City',
      name: `${servedArea.name}, ${servedArea.region}`,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${localizedName} jobs`,
      itemListElement: profile.jobs.map((job) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: job.title,
          description: job.description,
          areaServed: servedAreas.map((servedArea) => ({
            '@type': 'City',
            name: `${servedArea.name}, ${servedArea.region}`,
          })),
        },
      })),
    },
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${origin}/#business`,
      name: business.name,
      telephone: business.phoneHref,
      url: origin,
    },
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: pageUrl(path),
    })),
  };
}

function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: business.name,
    inLanguage: 'en-US',
    publisher: { '@id': `${origin}/#business` },
  };
}

function webPageSchema(path, title, description, image) {
  const url = pageUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': path === 'contact' ? 'ContactPage' : path === 'about' ? 'AboutPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@id': `${origin}/#business` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${origin}${image}`,
    },
    dateModified: siteLastModified,
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
          <span class="utility-hours">${icons.clock}<span>${business.availabilityNote}</span></span>
        </div>
        <div class="utility-group utility-actions">
          <a href="${business.googleReviews}" target="_blank" rel="noopener">${icons.star}<span>${business.rating} on Google</span></a>
          <a href="${business.instagram}" target="_blank" rel="noopener">${icons.instagram}<span>Instagram</span></a>
          <a href="${business.facebook}" target="_blank" rel="noopener">${icons.facebook}<span>Facebook</span></a>
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
        <span>${icons.clock} ${business.availabilityNote}</span>
        <a href="mailto:${business.email}">${icons.mail} ${business.email}</a>
      </div>
    </aside>`;
}

function siteAssistant() {
  return `<aside class="site-concierge" data-concierge
      data-phone="${business.phoneHref}"
      data-phone-display="${business.phone}"
      data-email="${business.email}"
      data-google-reviews="${business.googleReviews}"
      data-google-write-review="${business.googleWriteReview}">
    <button class="concierge-launcher" type="button" aria-label="Open Envision service assistant" aria-expanded="false" aria-controls="envision-concierge-panel">
      <span class="concierge-launcher-icon">${icons.chat}</span>
      <span><strong>Ask Envision</strong><small>Service &amp; estimate guide</small></span>
    </button>
    <section class="concierge-panel" id="envision-concierge-panel" role="dialog" aria-modal="false" aria-labelledby="concierge-title" hidden>
      <header class="concierge-header">
        <div class="concierge-identity">
          <span class="concierge-logo"><img src="/assets/images/envision-logo.png" alt="Envision Landscaping" width="76" height="44"></span>
          <span><strong id="concierge-title">Envision assistant</strong><small><i aria-hidden="true"></i> Website concierge</small></span>
        </div>
        <button class="concierge-close" type="button" aria-label="Close Envision assistant">${icons.close}</button>
      </header>
      <div class="concierge-log" data-concierge-log role="log" aria-live="polite" aria-relevant="additions"></div>
      <div class="concierge-suggestions" data-concierge-suggestions aria-label="Suggested questions">
        <button type="button" data-concierge-prompt="I need help choosing a service">Choose a service</button>
        <button type="button" data-concierge-prompt="Do you serve my area?">Check my area</button>
        <button type="button" data-concierge-prompt="I want an estimate">Build an estimate request</button>
        <button type="button" data-concierge-prompt="Show me your Google reviews">Google reviews</button>
      </div>
      <form class="concierge-form" data-concierge-form>
        <label class="sr-only" for="concierge-message">Ask Envision a question</label>
        <input id="concierge-message" name="message" type="text" maxlength="320" autocomplete="off" placeholder="Ask about a service, area, or estimate…" required>
        <button type="submit" aria-label="Send question">${icons.send}</button>
      </form>
      <p class="concierge-disclaimer">Uses verified website information. Kyle confirms live scheduling, pricing, and project fit.</p>
    </section>
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
            <a href="${business.facebook}" target="_blank" rel="noopener" aria-label="Envision Landscaping on Facebook">${icons.facebook}</a>
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
            <li><a href="mailto:${business.email}">${icons.mail}<span>${business.email}</span></a></li>
            <li>${icons.pin}<span>Raleigh, NC<br>Serving the Triangle</span></li>
            <li>${icons.clock}<span>${business.availabilityNote}</span></li>
          </ul>
        </div>
      </div>
      <div class="shell footer-bottom">
        <p>© ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
        <div><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/sitemap.xml">Sitemap</a></div>
      </div>
    </footer>
    ${siteAssistant()}
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
  const pageSchemas = [
    ...(path === 'index' ? [websiteSchema()] : []),
    ...schemas,
    webPageSchema(path, title, description, image),
  ];
  return `<!doctype html>
<html lang="en">
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${googleTagManagerId}');</script>
  <!-- End Google Tag Manager -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#08140f">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  ${path === 'index' ? `<meta name="google-site-verification" content="${googleSiteVerification}">` : ''}
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
  <link rel="preconnect" href="https://d3ey4dbjkt2f6s.cloudfront.net" crossorigin>
  <link rel="preconnect" href="https://clienthub.getjobber.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${jobberEmbedCss}" media="screen">
  <link rel="stylesheet" href="/assets/vendor/maplibre-gl.css?v=5.12.0">
  <link rel="stylesheet" href="/assets/styles.css?v=20260811-8">
  ${renderSchemas(pageSchemas)}
</head>
<body class="${bodyClass}">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->
  ${siteHeader(path)}
  <main id="main-content">${body}</main>
  ${siteFooter()}
  <script src="/assets/vendor/maplibre-gl.js?v=5.12.0" defer></script>
  <script src="/assets/site.js?v=20260826-1" defer></script>
  <script type="module" src="/assets/concierge.js?v=20260807-3"></script>
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
      display: `<span class="trust-display-number">${business.rating}</span><span class="trust-display-words">stars<br>on Google</span>`,
      title: 'Top-rated service',
      copy: 'Our clients love the finished work. See what Raleigh-area customers say on Google.',
      link: business.googleReviews,
      label: 'Our reviews',
    },
    {
      display: `<span class="trust-display-main">Owner-led</span><span class="trust-display-sub">by ${business.owner}</span>`,
      title: 'Local & accountable',
      copy: 'Work directly with Kyle from the first conversation through the final walkthrough.',
      link: '/about',
      label: 'About us',
    },
    {
      display: `<span class="trust-display-number">${areas.length}</span><span class="trust-display-words">Triangle<br>areas</span>`,
      title: 'Raleigh & beyond',
      copy: 'Serving Raleigh, Cary, Apex, Durham, Garner, and surrounding Triangle communities.',
      link: '/service-areas',
      label: 'Service area',
    },
    {
      display: '<span class="trust-display-main">Call or text</span><span class="trust-display-sub">to confirm</span>',
      title: 'Current availability',
      copy: 'Contact Envision directly to confirm current scheduling and availability.',
      link: '/contact',
      label: 'Get an estimate',
    },
  ];
  return `<section class="trust-rail shell" aria-label="Why customers contact Envision">
    ${items
      .map(
        (item, index) => `<a class="trust-card trust-card-${index + 1} reveal" href="${item.link}">
          <strong class="trust-display">${item.display}</strong>
          <h2>${item.title}</h2>
          <p>${item.copy}</p>
          <span class="text-link">${item.label} ${icons.arrow}</span>
        </a>`,
      )
      .join('')}
  </section>`;
}

function serviceGrid(limit = services.length, className = '') {
  return `<div class="service-grid${className ? ` ${className}` : ''}">
    ${services
      .slice(0, limit)
      .map(
        (service, index) => `<a class="service-card reveal" style="--i:${index}" href="/services/${service.slug}">
          <img src="${service.image}" alt="${service.imageAlt || `${service.title} service from Envision Landscaping`}" loading="lazy" width="900" height="1100">
          ${service.stockPlaceholder ? '<span class="temporary-stock-label">Temporary stock photo</span>' : ''}
          <div class="service-card-shade"></div>
          <div class="service-card-copy">
            <span>${String(index + 1).padStart(2, '0')}</span>
            <h3>${service.title}</h3>
            <p>${service.short}</p>
            <span class="service-card-link">View service ${icons.arrow}</span>
          </div>
        </a>`,
      )
      .join('')}
  </div>`;
}

function processSection(heading = 'How working with Envision starts') {
  return `<section class="process section-pad">
    <div class="shell process-grid">
      <div class="process-visual reveal">
        <img src="${projectImage('lawn-crew-stripes.jpg')}" alt="Envision lawn maintenance in progress with fresh mowing stripes" loading="lazy" width="1200" height="900">
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

function comparisonSlider(comparison, { className = '', title, priority = false, imageClass = '' } = {}) {
  const loading = priority ? 'fetchpriority="high" decoding="async"' : 'loading="lazy"';
  return `<div class="before-after-viewport ${className}" data-before-after style="--split:50%">
    <img class="before-after-image before-after-image-after ${imageClass}" src="${comparison.after}" alt="${comparison.afterAlt}" width="1200" height="900" ${loading}>
    <div class="before-after-layer" data-before-layer>
      <img class="before-after-image before-after-image-before ${imageClass}" src="${comparison.before}" alt="${comparison.beforeAlt}" width="1200" height="900" ${loading}>
    </div>
    <span class="before-after-badge before-after-badge-before">Before</span>
    <span class="before-after-badge before-after-badge-after">After</span>
    <span class="before-after-divider" aria-hidden="true"><i>↔</i></span>
    <input class="before-after-range" type="range" min="0" max="100" value="50" aria-label="Compare before and after for ${title}">
  </div>`;
}

function serviceHero(service, area = null) {
  const heroImage = service.heroImage || service.image;
  const heroImageAlt = service.heroImageAlt || service.imageAlt || `${service.title} service from Envision Landscaping`;
  const heroImageWidth = service.heroImageWidth || 1800;
  const heroImageHeight = service.heroImageHeight || 1200;
  const eyebrow = area
    ? `Serving ${area.name}, ${area.region}`
    : 'Raleigh &amp; Triangle service';
  const heading = area
    ? `${service.title} in ${area.name}, ${area.region}`
    : service.h1;
  const copy = area
    ? `${service.short} Envision confirms the exact ${area.name} property, project fit, and scheduling before service.`
    : service.short;
  return `<section class="service-page-hero">
    <div class="service-page-hero-media">
      <img src="${heroImage}" alt="${heroImageAlt}" width="${heroImageWidth}" height="${heroImageHeight}"${service.heroPosition ? ` style="object-position:${service.heroPosition}"` : ''} fetchpriority="high" decoding="async">
      ${service.stockPlaceholder ? '<span class="temporary-stock-label">Temporary stock photo — not an Envision project</span>' : ''}
    </div>
    <div class="service-page-hero-panel">
      <div class="service-page-hero-content reveal">
        <p class="eyebrow eyebrow-light">${eyebrow}</p>
        <h1>${heading}</h1>
        <p>${copy}</p>
        ${buttonPair()}
      </div>
    </div>
  </section>`;
}

function serviceProofSection(service) {
  const comparison = serviceProfiles[service.slug].proofComparison;
  if (!comparison) return '';

  const proofCopy = {
    'landscape-maintenance': {
      eyebrow: 'Real landscape result',
      title: 'See what detail work changes.',
      body: 'Drag the handle across this Envision project to compare the walkway, bed lines, and surrounding landscape before and after maintenance.',
    },
    'aeration-overseeding': {
      eyebrow: 'Real lawn result',
      title: 'From bare ground to established turf.',
      body: 'Use the slider to compare this Triangle-area backyard before a larger lawn-renovation project and after the new grass became established.',
    },
    'spring-fall-cleanups': {
      eyebrow: 'Real cleanup result',
      title: 'A cleaner property, without the guesswork.',
      body: 'Drag across the project to see the same front property before and after Envision completed the seasonal cleanup work.',
    },
  }[service.slug];

  return `<section class="service-proof section-pad" aria-labelledby="${service.slug}-proof-heading">
    <div class="shell service-proof-grid">
      <div class="service-proof-copy reveal">
        <p class="eyebrow eyebrow-light">${proofCopy.eyebrow}</p>
        <h2 id="${service.slug}-proof-heading">${proofCopy.title}</h2>
        <p>${proofCopy.body}</p>
        <div class="service-proof-actions">
          <a class="button button-primary" href="/contact"><span>Request a free estimate</span>${icons.arrow}</a>
          <a class="service-proof-phone" href="tel:${business.phoneHref}">${icons.phone}<span>${business.phone}</span></a>
        </div>
      </div>
      <div class="service-proof-visual reveal">
        ${comparisonSlider(comparison, {
          className: 'service-proof-slider',
          title: `${service.title.toLowerCase()} project`,
        })}
        <p><span>Drag the handle</span> to compare the same property before and after.</p>
      </div>
    </div>
  </section>`;
}

function serviceJobsSection(service, area = null) {
  const profile = serviceProfiles[service.slug];
  const heading = area
    ? `${service.title} work Envision can scope in ${area.name}`
    : profile.jobHeading;
  const intro = area
    ? `${profile.jobIntro.replaceAll('Raleigh-area homeowners', `${area.name} property owners`).replaceAll('Raleigh-area', `${area.name}-area`)} The final visit is based on the exact address and approved estimate.`
    : profile.jobIntro;
  return `<section class="service-jobs section-pad" aria-labelledby="${service.slug}-jobs-heading">
    <div class="shell">
      <div class="service-jobs-heading reveal">
        <p class="eyebrow">Inside this service</p>
        <h2 id="${service.slug}-jobs-heading">${heading}</h2>
        <p>${intro}</p>
      </div>
      <div class="service-job-grid">
        ${profile.jobs
          .map(
        (job, index) => `<article class="service-job-card reveal" style="--i:${index}">
              <img src="${job.image}" alt="${job.alt}" loading="lazy" width="1200" height="800">
              ${job.stockPlaceholder ? '<span class="temporary-stock-label">Temporary stock photo</span>' : ''}
              <div class="service-job-card-copy">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <h3>${job.title}</h3>
                <p>${job.description}</p>
              </div>
            </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function serviceProcessSection(service, area = null) {
  const profile = serviceProfiles[service.slug];
  const heading = area
    ? `${service.title} in ${area.name}: estimate to final check`
    : `${service.title}: estimate to final check`;
  const copy = area
    ? `The exact ${area.name} job changes by property, but Envision uses the same clear planning steps before work begins.`
    : 'The exact job changes by property, but the planning stays straightforward.';
  return `<section class="service-process section-pad">
    <div class="shell service-process-grid">
      <div class="service-process-visual reveal">
        <img src="${service.image}" alt="${service.imageAlt || `${service.title} work by Envision Landscaping`}" loading="lazy" width="1200" height="900">
        ${service.stockPlaceholder ? '<span class="temporary-stock-label">Temporary stock photo</span>' : ''}
        <div><span>Property-specific scope</span><strong>Clear steps before work begins.</strong></div>
      </div>
      <div class="service-process-copy">
        ${sectionHeading('How the work moves', heading, copy)}
        <ol class="service-process-list">
          ${profile.process
            .map(
              ([title, body], index) => `<li class="reveal">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <div><h3>${title}</h3><p>${body}</p></div>
              </li>`,
            )
            .join('')}
        </ol>
      </div>
    </div>
  </section>`;
}

function serviceLocalContextSection(service) {
  if (!service.localContext) return '';
  return `<section class="service-area-links section-pad"><div class="shell service-area-links-grid">
    ${sectionHeading('Service-area context', service.localContext.title, service.localContext.body)}
    <div class="service-area-link-list">
      <a href="/service-areas"><span>${icons.pin}<strong>See Envision's published service areas</strong></span>${icons.arrow}</a>
      <a href="/contact"><span>${icons.arrow}<strong>Confirm this seasonal service for your property</strong></span>${icons.arrow}</a>
    </div>
  </div></section>`;
}

function reviewSection() {
  const featuredReviews = reviews.slice(0, 11);
  return `<section class="reviews section-pad" id="reviews" aria-labelledby="review-heading">
    <div class="shell">
      <div class="reviews-top">
        <div class="section-heading reveal">
          <p class="eyebrow">Verified Google reviews</p>
          <h2 id="review-heading">Raleigh-area customers tell the story.</h2>
          <p>Browse recent feedback pulled directly from Envision’s Google Business Profile.</p>
        </div>
        <div class="review-score reveal">
          ${icons.google}
          <span>${business.rating}</span>
          <div><div class="stars">${icons.star.repeat(5)}</div><p>${business.reviewCount} Google reviews</p></div>
        </div>
      </div>
      <div class="review-stack reveal" data-review-stack aria-live="polite">
        <div class="review-stack-cards">
          ${featuredReviews
            .map(
              (review, index) => `<article class="stack-review-card" data-review-card data-review-rating="${review.rating || 5}" data-review-index="${index}" style="--position:${index - 5}">
                <div class="stack-review-top">${icons.google}<span class="stars">${icons.star.repeat(Math.max(1, Math.min(5, review.rating || 5)))}</span></div>
                <blockquote>“${escapeHtml(review.highlight)}”</blockquote>
                <footer><span class="review-avatar" aria-hidden="true">${escapeHtml(review.name).charAt(0)}</span><p><strong>${escapeHtml(review.name)}</strong><span>${escapeHtml(review.service)}</span></p></footer>
              </article>`,
            )
            .join('')}
        </div>
        <div class="review-stack-controls">
          <button class="stack-review-prev" type="button" aria-label="Previous Google review">${icons.arrow}</button>
          <button class="stack-review-next" type="button" aria-label="Next Google review">${icons.arrow}</button>
        </div>
      </div>
      <div class="center-row review-cta-row">
        <a class="button button-navy" href="${business.googleReviews}" target="_blank" rel="noopener">${icons.google}<span>Read all ${business.reviewCount} reviews</span>${icons.arrow}</a>
        <a class="button button-primary" href="${business.googleWriteReview}" target="_blank" rel="noopener">${icons.google}<span>Leave a Google review</span>${icons.arrow}</a>
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
  return `<section class="gallery-preview section-pad">
    <div class="shell gallery-heading-row">
      ${sectionHeading('Real Envision work', 'The details show in the finish.', 'Lawn maintenance, mulch, aeration, and landscape work photographed on actual Envision projects.')}
      <a class="text-link text-link-light" href="/gallery">View the full gallery ${icons.arrow}</a>
    </div>
    <div class="gallery-collage shell">
      ${projectGalleryItems
        .slice(0, 6)
        .map(
          ([src, alt], index) => `<figure class="gallery-item gallery-item-${index + 1} reveal">
            <img src="${src}" alt="${alt}" loading="lazy" width="1000" height="1200">
          </figure>`,
        )
        .join('')}
    </div>
  </section>`;
}

function beforeAfterSection({ limit = beforeAfterProjects.length, heading = 'Drag across the work.' } = {}) {
  const projects = beforeAfterProjects.slice(0, limit);
  const galleryLink = limit < beforeAfterProjects.length
    ? `<a class="text-link text-link-light" href="/gallery#before-after">See every transformation ${icons.arrow}</a>`
    : '';
  return `<section class="before-after-section section-pad" id="before-after" aria-label="Before and after project comparisons">
    <div class="shell">
      <div class="before-after-heading-row">
        ${sectionHeading('Before & after', heading, 'Move each divider to compare the same project before and after Envision’s work.')}
        ${galleryLink}
      </div>
      <div class="before-after-grid">
        ${projects
          .map(
            (project, index) => `<article class="before-after-card reveal" data-before-after style="--split:50%;--i:${index}">
              <div class="before-after-viewport">
                <img class="before-after-image before-after-image-after" src="${project.after}" alt="${project.afterAlt}" loading="lazy" width="1200" height="900">
                <div class="before-after-layer" data-before-layer>
                  <img class="before-after-image before-after-image-before" src="${project.before}" alt="${project.beforeAlt}" loading="lazy" width="1200" height="900">
                </div>
                <span class="before-after-badge before-after-badge-before">Before</span>
                <span class="before-after-badge before-after-badge-after">After</span>
                <span class="before-after-divider" aria-hidden="true"><i>↔</i></span>
                <input class="before-after-range" type="range" min="0" max="100" value="50" aria-label="Compare before and after for ${project.title}">
              </div>
              <div class="before-after-copy"><span>${project.type}</span><h3>${project.title}</h3></div>
            </article>`,
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

function backyardStorySection() {
  const stages = [
    [projectImage('backyard-makeover-during-2.jpg'), '01', 'Before', 'The original backyard before clearing, grading, and lawn work began.'],
    [projectImage('backyard-makeover-before.jpg'), '02', 'During', 'The backyard while grading and site work were underway.'],
    [projectImage('backyard-makeover-after.jpg'), '03', 'After', 'The same rear-house view after the lawn became established.'],
  ];
  return `<section class="project-story section-pad" id="backyard-makeover">
    <div class="shell">
      ${sectionHeading('Featured project', 'A backyard makeover in three stages.', 'A verified before, work-in-progress, and established-lawn sequence from one Envision project.')}
      <div class="project-story-grid">
        ${stages
          .map(
            ([src, number, title, copy]) => `<article class="project-story-card reveal">
              <img src="${src}" alt="Backyard makeover ${title.toLowerCase()} stage" loading="lazy" width="1200" height="900">
              <div><span>${number}</span><h3>${title}</h3><p>${copy}</p></div>
            </article>`,
          )
          .join('')}
      </div>
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
          data-area-href="/service-areas#${area.slug}"
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
                `<a href="/service-areas#${area.slug}" data-area-select="${area.slug}"><span>${area.name}</span>${icons.arrow}</a>`,
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
          <noscript><p class="map-noscript">Enable JavaScript to use the live map. Every published community remains listed on the service-area page.</p></noscript>
        </div>
        <div class="area-map-panel">
          <div>
            <p>Selected service area</p>
            <h3 data-map-area-name>${defaultArea.name}, ${defaultArea.region}</h3>
            <p data-map-area-copy>${defaultArea.intro}</p>
          </div>
          <div class="area-map-panel-actions">
            <div class="area-service-chips" data-map-area-services>${defaultArea.services.map((service) => `<span>${service}</span>`).join('')}</div>
            <a href="/service-areas#${defaultArea.slug}" data-map-area-link><span>Explore ${defaultArea.name}</span>${icons.arrow}</a>
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
        ${sectionHeading('Straight answers', heading, 'If your question is specific to the property, call or send an estimate request.')}
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

function jobberRequestForm() {
  return `<div class="jobber-request-shell" id="jobber-request" data-jobber-request>
    <div id="${jobberEmbedId}" data-jobber-mount></div>
    <p class="jobber-request-fallback">Having trouble loading the form? <a href="${jobberFormUrl}" target="_blank" rel="noopener">Open Envision’s secure Jobber request form</a>.</p>
  </div>
  <script src="${jobberEmbedScript}" clienthub_id="${jobberEmbedId}" form_url="${jobberFormUrl}"></script>`;
}

function contactSection() {
  return `<section class="contact-section section-pad" id="estimate">
    <div class="shell contact-grid">
      <div class="contact-copy reveal">
        <p class="eyebrow">Start with the property</p>
        <h2>Tell Envision what needs work.</h2>
        <p>Send the service, property area, and project details directly into Envision’s Jobber request queue. Kyle will review the request and follow up about fit, scope, and scheduling.</p>
        <div class="contact-direct">
          <a class="contact-phone" href="tel:${business.phoneHref}">${icons.phone}<span><small>Prefer to call?</small><strong>${business.phone}</strong></span></a>
          <a class="contact-email" href="mailto:${business.email}">${icons.mail}<span><small>Prefer email?</small><strong>${business.email}</strong></span></a>
        </div>
        <dl>
          <div><dt>Based in</dt><dd>Raleigh, NC</dd></div>
          <div><dt>Availability</dt><dd>${business.availabilityNote}</dd></div>
          <div><dt>Service area</dt><dd>Raleigh &amp; surrounding Triangle communities</dd></div>
        </dl>
      </div>
      <div class="quote-panel reveal">
        <p class="quote-panel-kicker">Request an estimate</p>
        <h3>Send your project details</h3>
        ${jobberRequestForm()}
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
    <picture class="home-hero-visual">
      <img class="home-hero-image" src="${projectImage('finished-lawn-wide.jpg')}" alt="Wide finished residential lawn maintained by Envision Landscaping" width="1800" height="1200" fetchpriority="high" decoding="async">
    </picture>
    <div class="home-hero-shade"></div>
    <div class="home-hero-brand" aria-label="Envision Landscaping project photo">
      <img src="/assets/images/envision-logo.png" alt="Envision Landscaping LLC" width="480" height="279">
      <span>Actual project</span>
    </div>
    <div class="shell home-hero-content">
      <div class="hero-rating reveal"><span class="stars">${icons.star.repeat(5)}</span><a href="${business.googleReviews}" target="_blank" rel="noopener">${business.rating} on Google</a></div>
      <p class="eyebrow eyebrow-light reveal">Professional lawn &amp; landscape care</p>
      <h1 class="liquid-title reveal" aria-label="Expert lawn and landscape care in Raleigh, North Carolina">
        <span data-text="Expert lawn care">Expert lawn care</span>
        <span data-text="&amp; landscaping in">&amp; landscaping in</span>
        <span data-text="Raleigh, NC">Raleigh, NC</span>
      </h1>
      <p class="hero-copy reveal">Owner-led lawn maintenance, seasonal cleanup, mulch, planting, and landscape care across Raleigh and the Triangle.</p>
      <div class="hero-action-wrap reveal">
        <div class="button-row">
          <a class="button button-primary" href="/contact"><span>Request a free estimate</span><span class="button-icon">${icons.arrow}</span></a>
          <a class="button button-ghost-light" href="#services"><span>Explore our services</span>${icons.arrow}</a>
        </div>
        <a class="hero-phone-link" href="tel:${business.phoneHref}">${icons.phone}<span>Prefer to talk? <strong>${business.phone}</strong></span></a>
      </div>
    </div>
  </section>`;

  const intro = `<section class="intro section-pad" id="why-envision" aria-labelledby="intro-title">
    <div class="shell intro-grid">
      <div class="intro-copy">
        <div class="section-heading">
          <p class="eyebrow">Owner-led in Raleigh</p>
          <h2 id="intro-title">Exceptional landscape care, every visit.</h2>
          <p>Envision Landscaping is led by Kyle Young and built around showing up, doing the work right, and treating every property with care.</p>
        </div>
        <div class="intro-points">
          <div><span>01</span><p>Clear scope before the work begins</p></div>
          <div><span>02</span><p>Detail-focused service from curb to bed line</p></div>
          <div><span>03</span><p>Routine care and one-time projects</p></div>
        </div>
        <div class="intro-actions">
          <a class="button button-primary" href="/contact"><span>Get a free estimate</span><span class="button-icon">${icons.arrow}</span></a>
          <a class="intro-phone" href="tel:${business.phoneHref}">${icons.phone}<span>${business.phone}</span></a>
        </div>
      </div>
      <div class="intro-visual reveal">
        <div class="image-shell"><img src="${projectImage('landscape-entry-after.jpg')}" alt="Finished Raleigh property with a maintained lawn, clean beds, and an open front walkway" loading="lazy" width="1800" height="1350"></div>
        <div class="intro-badge"><strong>Raleigh</strong><span>&amp; the Triangle</span></div>
      </div>
    </div>
  </section>`;

  const serviceSection = `<section class="services home-services section-pad" id="services">
    <div class="shell home-services-intro">
      <div class="home-services-copy reveal">
        <p class="eyebrow eyebrow-light">Full-service exterior care</p>
        <h2>Professional lawn maintenance &amp; landscaping services in Raleigh, NC</h2>
        <span class="lime-rule" aria-hidden="true"></span>
        <p>Spend less time maintaining the property and more time enjoying it. Envision handles recurring lawn care, cleanups, mulch, planting, aeration, and seasonal projects across Raleigh and the Triangle.</p>
        <div class="button-row">
          <a class="button button-primary" href="/contact"><span>Request a free estimate</span>${icons.arrow}</a>
          <a class="button button-ghost-light" href="/services"><span>Explore all services</span>${icons.arrow}</a>
        </div>
      </div>
      <div class="home-services-truck reveal">
        <img src="${projectImage('lawn-crew-stripes.jpg')}" alt="Envision lawn maintenance in progress with fresh mowing stripes" loading="lazy" width="1200" height="900">
      </div>
    </div>
    <div class="shell">${serviceGrid(services.length, 'home-service-grid')}</div>
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
    <img src="${projectImage('backyard-makeover-after-wide.jpg')}" alt="Established backyard lawn after an Envision property makeover" loading="lazy" width="1800" height="1350">
    <div class="transformation-shade"></div>
    <div class="shell transformation-content reveal">
      <p class="eyebrow eyebrow-light">Ready for a cleaner property?</p>
      <h2>Let Envision handle the outside work.</h2>
      <p>Start with a call or send the property details through the estimate form.</p>
      ${buttonPair('Request my estimate')}
    </div>
  </section>`;

  return pageShell({
    path: 'index',
    title: 'Raleigh Lawn Care & Landscaping | Envision Landscaping LLC',
    description:
      'Owner-led lawn maintenance, seasonal cleanup, mulch, landscape care, and outdoor projects across Raleigh and the Triangle.',
    image: projectImage('finished-lawn-wide.jpg'),
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
      beforeAfterSection({ limit: 3, heading: 'See what changed.' }) +
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
      'Explore lawn maintenance, aeration and overseeding, cleanups, mulch, planting, and landscape-care services from Envision.',
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
  return pageShell({
    path: 'gallery',
    title: 'Raleigh Lawn & Landscaping Project Gallery | Envision',
    description:
      'See lawn maintenance, mulch, cleanup, and landscape work from Envision Landscaping across the Raleigh area.',
    body:
      innerHero({
        eyebrow: 'Project gallery',
        title: 'Real work. Clean results.',
        copy: 'Before-and-after transformations and service photos from real Envision projects.',
        image: projectImage('backyard-makeover-after-wide.jpg'),
      }) +
      breadcrumb([['Gallery']]) +
      beforeAfterSection({ heading: 'Three projects. Three visible changes.' }) +
      backyardStorySection() +
      `<section class="gallery-page section-pad" id="project-gallery"><div class="shell">
        ${sectionHeading('Project gallery', 'Work from across the service list.', 'Browse lawn maintenance, mulch installation, aeration and overseeding, and larger landscape projects.')}
        <div class="gallery-masonry">
          ${projectGalleryItems
            .map(
              ([src, alt, category], index) => `<figure class="reveal"><button type="button" data-lightbox-open="${src}" aria-label="Open image: ${alt}"><img src="${src}" alt="${alt} by Envision Landscaping" loading="${index < 2 ? 'eager' : 'lazy'}" width="1000" height="1200"></button><figcaption><strong>${category}</strong><span>${alt}</span></figcaption></figure>`,
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
            .slice(0, 24)
            .map(
              (review) => `<article class="review-card reveal" data-review-rating="${review.rating || 5}"><div class="review-card-top"><span>${icons.google}</span><span class="stars">${icons.star.repeat(Math.max(1, Math.min(5, review.rating || 5)))}</span></div><p>“${escapeHtml(review.highlight)}”</p><footer><strong>${escapeHtml(review.name)}</strong><span>${escapeHtml(review.service)}</span></footer></article>`,
            )
            .join('')}
        </div>
        <div class="center-row review-cta-row"><a class="button button-navy" href="${business.googleReviews}" target="_blank" rel="noopener">${icons.google}<span>Read all ${business.reviewCount} Google reviews</span>${icons.arrow}</a><a class="button button-primary" href="${business.googleWriteReview}" target="_blank" rel="noopener">${icons.google}<span>Leave a Google review</span>${icons.arrow}</a></div>
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
      'Call (984) 338-6483, email Kyle@envisionlandscapingllc.com, or submit an estimate request for Raleigh lawn and landscaping work.',
    schemas: [
      localBusinessSchema({
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: business.phoneHref,
          email: business.email,
          contactType: 'customer service',
          areaServed: 'US-NC',
        },
      }),
    ],
    body:
      innerHero({
        eyebrow: 'Contact Envision',
        title: 'Start with the property and the work you want done.',
        copy: 'Call now or send an estimate request with the service, location, and project details.',
        image: '/assets/images/lawn-maintenance.jpg',
        ctas: false,
      }) +
      breadcrumb([['Contact']]) +
      `<section class="contact-page section-pad"><div class="shell contact-page-grid">
        <div class="contact-page-details">
          ${sectionHeading('Request an estimate', 'Give Kyle the details needed to understand the job.', 'Call, email, or submit the estimate form with the service, property location, timing, and project details.')}
          <a class="contact-method reveal" href="tel:${business.phoneHref}"><span>${icons.phone}</span><div><small>Call Envision</small><strong>${business.phone}</strong><p>Best for a quick fit and schedule check.</p></div>${icons.arrow}</a>
          <a class="contact-method reveal" href="mailto:${business.email}"><span>${icons.mail}</span><div><small>Email Kyle</small><strong>${business.email}</strong><p>Send photos, measurements, timing, and project details.</p></div>${icons.arrow}</a>
          <a class="contact-method reveal" href="${business.instagram}" target="_blank" rel="noopener"><span>${icons.instagram}</span><div><small>Instagram</small><strong>@envision_landscaping_llc</strong><p>See the profile and send a social message.</p></div>${icons.arrow}</a>
          <a class="contact-method reveal" href="${business.facebook}" target="_blank" rel="noopener"><span>${icons.facebook}</span><div><small>Facebook</small><strong>Envision Landscaping LLC</strong><p>Visit the Facebook page and send a message.</p></div>${icons.arrow}</a>
          <div class="contact-facts">
            <div><span>${icons.pin}</span><p><strong>Based in Raleigh</strong>Serving Raleigh and surrounding Triangle communities.</p></div>
            <div><span>${icons.clock}</span><p><strong>Availability</strong>${business.availabilityNote}</p></div>
          </div>
        </div>
        <div class="quote-panel quote-panel-large reveal"><p class="quote-panel-kicker">Estimate request</p><h2>Send the project details.</h2>${jobberRequestForm()}</div>
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
      'Envision Landscaping serves Raleigh, Cary, Apex, Morrisville, Fuquay-Varina, Holly Springs, Durham, and Garner.',
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
              (area, index) => `<a class="area-card reveal" id="${area.slug}" href="${area.slug === 'raleigh-nc' ? '/contact' : `/service-areas/${area.slug}`}" aria-label="${area.slug === 'raleigh-nc' ? 'Confirm service for' : 'View lawn and landscape services in'} ${area.name}, ${area.region}"><span>${String(index + 1).padStart(2, '0')}</span><h2>${area.name}, ${area.region}</h2><p>${area.intro}</p><i>${icons.arrow}</i></a>`,
            )
            .join('')}
        </div>
      </div></section>` +
      areaSection() +
      contactSection(),
  });
}

function servicePage(service) {
  const localizedAreas = service.localize === false ? [] : areas;
  return pageShell({
    path: `services/${service.slug}`,
    title: service.seoTitle || `${service.title} in Raleigh, NC | Envision Landscaping`,
    description: service.meta,
    image: service.heroImage || service.image,
    schemas: [
      localBusinessSchema(),
      serviceSchema(service, areas[0]),
      faqSchema(service.faqs),
      breadcrumbSchema([
        ['Home', 'index'],
        ['Services', 'services'],
        [service.title, `services/${service.slug}`],
      ]),
    ],
    bodyClass: 'service-page',
    body:
      serviceHero(service) +
      breadcrumb([
        ['Services', '/services'],
        [service.title],
      ]) +
      `<section class="service-overview section-pad"><div class="shell service-overview-grid">
        <div class="service-overview-copy">
          ${sectionHeading('Service overview', service.title, service.intro)}
          <a class="text-link" href="#${service.slug}-jobs-heading">See the jobs inside this service ${icons.arrow}</a>
        </div>
        <div class="service-scope-panel reveal">
          <p class="eyebrow">Common scope</p>
          <h2>Build the visit around your property.</h2>
          <ul class="check-list">
            ${service.includes
              .map((item) => `<li>${icons.check}<span>${item}</span></li>`)
              .join('')}
          </ul>
          <a class="button button-primary" href="/contact"><span>Request an estimate</span>${icons.arrow}</a>
        </div>
      </div></section>` +
      serviceProofSection(service) +
      serviceJobsSection(service) +
      serviceProcessSection(service) +
      serviceLocalContextSection(service) +
      `<section class="related-services section-pad"><div class="shell">${sectionHeading('Keep planning', 'Related property services')}${serviceGrid(4)}</div></section>` +
      (localizedAreas.length
        ? `<section class="service-area-links section-pad"><div class="shell service-area-links-grid">
        ${sectionHeading('Where Envision works', `${service.title} across Raleigh &amp; the Triangle`, 'Choose the closest listed community, then confirm the exact property and project when requesting an estimate.')}
        <div class="service-area-link-list">
          ${localizedAreas
            .map(
              (area) => `<a href="${localizedServicePath(service, area)}"><span>${icons.pin}<strong>${service.title} in ${area.name}, ${area.region}</strong></span>${icons.arrow}</a>`,
            )
            .join('')}
        </div>
      </div></section>`
        : '') +
      faqSection(service.faqs, `${service.title} questions`) +
      contactSection(),
  });
}

function readableList(items) {
  if (items.length < 2) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function localizedServiceFaqs(service, area) {
  return [
    [
      `Does Envision provide ${service.title.toLowerCase()} in ${area.name}?`,
      `Yes. ${area.name}, ${area.region} is in Envision’s published service area, and ${service.title.toLowerCase()} is a listed service. Envision confirms the exact property, project fit, scope, and scheduling before work begins.`,
    ],
    [
      `What can ${service.title.toLowerCase()} include for a ${area.name} property?`,
      `The property-specific scope can include ${readableList(service.includes.map((item) => item.toLowerCase()))}. The estimate identifies the approved work before scheduling.`,
    ],
    [
      `How do I request a ${service.title.toLowerCase()} estimate in ${area.name}?`,
      `Call or text ${business.phone} with the ${area.name} property address, the areas that need work, timing, access details, and helpful photos. Envision reviews the request and confirms the next estimate step directly.`,
    ],
    [
      `Can ${service.title.toLowerCase()} be combined with another service?`,
      `Yes. Include the full property request when you contact Envision so related work can be reviewed together and clearly separated in the approved scope when needed.`,
    ],
  ];
}

function localizedServicePage(service, area) {
  const path = localizedServiceEntryPath(service, area);
  const title = `${service.title} in ${area.name}, ${area.region} | Envision`;
  const description = `Get ${service.title.toLowerCase()} in ${area.name}, ${area.region} from Envision Landscaping. Review the work, process, and property-specific estimate steps.`;
  const localFaqs = localizedServiceFaqs(service, area);
  const relatedServices = services.filter((candidate) => candidate.slug !== service.slug);
  const otherAreas = areas.filter((candidate) => candidate.slug !== area.slug);

  return pageShell({
    path,
    title,
    description,
    image: service.heroImage || service.image,
    schemas: [
      localBusinessSchema({
        areaServed: {
          '@type': 'City',
          name: `${area.name}, ${area.region}`,
        },
      }),
      serviceSchema(service, area),
      faqSchema(localFaqs),
      breadcrumbSchema([
        ['Home', 'index'],
        ['Services', 'services'],
        [service.title, `services/${service.slug}`],
        [`${area.name}, ${area.region}`, path],
      ]),
    ],
    bodyClass: 'service-page localized-service-page',
    body:
      serviceHero(service, area) +
      breadcrumb([
        ['Services', '/services'],
        [service.title, `/services/${service.slug}`],
        [`${area.name}, ${area.region}`],
      ]) +
      `<section class="service-overview section-pad"><div class="shell service-overview-grid">
        <div class="service-overview-copy">
          ${sectionHeading(`${area.name} service overview`, service.title, `${area.intro} This page explains the ${service.title.toLowerCase()} work Envision can review for a ${area.name} property. Service depends on the address, project fit, and current schedule.`)}
          <a class="text-link" href="/service-areas/${area.slug}">View all services in ${area.name} ${icons.arrow}</a>
        </div>
        <div class="service-scope-panel reveal">
          <p class="eyebrow">Common scope</p>
          <h2>Build the ${area.name} estimate around the property.</h2>
          <ul class="check-list">
            ${service.includes
              .map((item) => `<li>${icons.check}<span>${item}</span></li>`)
              .join('')}
          </ul>
          <a class="button button-primary" href="/contact"><span>Request a ${area.name} estimate</span>${icons.arrow}</a>
        </div>
      </div></section>` +
      serviceProofSection(service) +
      serviceJobsSection(service, area) +
      serviceProcessSection(service, area) +
      `<section class="service-overview section-pad"><div class="shell service-overview-grid">
        <div>${sectionHeading(`Planning in ${area.name}`, area.planning.title, area.planning.body)}</div>
        <div class="service-scope-panel reveal">
          <ul class="check-list">
            ${area.planning.checks
              .map((item) => `<li>${icons.check}<span>${item}</span></li>`)
              .join('')}
          </ul>
          <a class="button button-primary" href="/contact"><span>Start the estimate request</span>${icons.arrow}</a>
        </div>
      </div></section>` +
      `<section class="service-area-links section-pad"><div class="shell service-area-links-grid">
        ${sectionHeading('More property needs', `Related services in ${area.name}, NC`, `Use the service that best matches the work, or include multiple needs in one estimate request.`)}
        <div class="service-area-link-list">
          ${relatedServices
            .map(
              (candidate) => `<a href="${localizedServicePath(candidate, area)}"><span>${icons.check}<strong>${candidate.title} in ${area.name}, ${area.region}</strong></span>${icons.arrow}</a>`,
            )
            .join('')}
        </div>
      </div></section>` +
      `<section class="service-area-links section-pad"><div class="shell service-area-links-grid">
        ${sectionHeading('Other listed communities', `${service.title} across the Triangle`, `Browse another published service community or contact Envision with the exact property address.`)}
        <div class="service-area-link-list">
          ${otherAreas
            .map(
              (candidate) => `<a href="${localizedServicePath(service, candidate)}"><span>${icons.pin}<strong>${service.title} in ${candidate.name}, ${candidate.region}</strong></span>${icons.arrow}</a>`,
            )
            .join('')}
        </div>
      </div></section>` +
      faqSection(localFaqs, `${service.title} in ${area.name} questions`) +
      contactSection(),
  });
}

function areaPage(area) {
  const localServices = area.serviceSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter(Boolean);
  const localFaqs = [
    [
      `Does Envision Landscaping serve ${area.name}?`,
      `Yes. ${area.name}, ${area.region} is listed in Envision’s published service area. Share the exact property address and requested service so Envision can confirm project fit and scheduling.`,
    ],
    [
      `What lawn and landscape services are available in ${area.name}?`,
      `Envision’s published ${area.name} service coverage includes ${localServices.map((service) => service.title.toLowerCase()).join(', ')}. The exact visit is scoped to the property before scheduling.`,
    ],
    [
      `How do I request an estimate for a ${area.name} property?`,
      `Call or text ${business.phone} with the property location, the work you need, and any helpful photos. Envision will confirm availability and the estimate process directly.`,
    ],
    ...homepageFaqs.slice(1, 3),
  ];
  return pageShell({
    path: `service-areas/${area.slug}`,
    title: `${area.name}, NC Lawn Care & Landscaping | Envision`,
    description: `Lawn care and landscaping in ${area.name}, NC. View Envision’s listed local services and call or text ${business.phone} to confirm your property.`,
    schemas: [
      localBusinessSchema({
        areaServed: {
          '@type': 'City',
          name: `${area.name}, ${area.region}`,
        },
      }),
      faqSchema(localFaqs),
      breadcrumbSchema([
        ['Home', 'index'],
        ['Service Areas', 'service-areas'],
        [`${area.name}, ${area.region}`, `service-areas/${area.slug}`],
      ]),
    ],
    body:
      innerHero({
        eyebrow: `Serving ${area.name}, ${area.region}`,
        title: `Lawn care and landscaping in ${area.name}, NC`,
        copy: `${area.intro} Browse the services Envision currently lists for this community, then confirm the exact property when requesting an estimate.`,
        image: localServices[0]?.image || '/assets/images/hero-home.jpg',
      }) +
      breadcrumb([
        ['Service Areas', '/service-areas'],
        [`${area.name}, ${area.region}`],
      ]) +
      `<section class="local-service section-pad"><div class="shell local-service-grid">
        <div>${sectionHeading(`${area.name} service area`, `Property care built around the actual job`, `${area.intro} Envision confirms the address, requested work, scope, and scheduling before service.`)}<a class="button button-primary" href="/contact"><span>Request a ${area.name} estimate</span>${icons.arrow}</a></div>
        <div class="local-stat reveal"><span>${icons.pin}</span><strong>${area.name}</strong><p>Published Envision service community</p><small>Scheduling and project fit are confirmed property by property.</small></div>
      </div></section>` +
      `<section class="services section-pad"><div class="shell">${sectionHeading('Available services', `Lawn and landscape services in ${area.name}, NC`, `These are the service categories Envision currently publishes for ${area.name}. Choose the closest match for full service details.`)}<div class="service-grid local-service-grid-cards">
        ${localServices
          .map(
            (service, index) => `<a class="service-card reveal" style="--i:${index}" href="${localizedServicePath(service, area)}">
              <img src="${service.image}" alt="${service.title} available for ${area.name}, North Carolina properties" loading="lazy" width="900" height="1100">
              <div class="service-card-shade"></div>
              <div class="service-card-copy">
                <span>${String(index + 1).padStart(2, '0')}</span>
                <h3>${service.title} in ${area.name}, NC</h3>
                <p>${service.short}</p>
                <span class="service-card-link">View ${service.title.toLowerCase()} details ${icons.arrow}</span>
              </div>
            </a>`,
          )
          .join('')}
      </div></div></section>` +
      `<section class="service-overview section-pad"><div class="shell service-overview-grid">
        <div>${sectionHeading(`Planning a ${area.name} estimate`, area.planning.title, area.planning.body)}</div>
        <div class="service-scope-panel reveal"><ol class="check-list">
          ${area.planning.checks
            .map((item) => `<li>${icons.check}<span>${item}</span></li>`)
            .join('')}
        </ol><a class="button button-primary" href="/contact"><span>Contact Envision</span>${icons.arrow}</a></div>
      </div></section>` +
      reviewSection() +
      faqSection(localFaqs, `${area.name} lawn care and landscaping questions`) +
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
          'This website uses Google Analytics 4 through Google Tag Manager to understand page visits and interactions such as estimate-link and business-phone clicks. Analytics may collect device, browser, approximate location, referral, and usage information; Envision does not intentionally send the details entered into the Jobber form to Google Analytics. The estimate form is provided by Jobber, and submitted details go directly into Envision Landscaping’s Jobber request queue under Jobber’s privacy terms.',
        ],
        [
          'Third-party links',
          'Links to Google, Facebook, Instagram, phone, and text services are controlled by those providers. Their privacy policies apply after you leave this site.',
        ],
        [
          'Contact details',
          `For privacy questions about this website, call ${business.phone} or email ${business.email}.`,
        ],
      ]
    : [
        [
          'Website information',
          'Service descriptions, service areas, ratings, and offers are presented from current public business information. Availability, eligibility, scope, timing, and price must be confirmed directly with Envision Landscaping.',
        ],
        [
          'Estimates and messages',
          'Submitting an estimate request does not create an estimate, contract, appointment, or guaranteed service date. Envision must review the property, project fit, scope, and scheduling before work is confirmed.',
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
        copy: 'Last updated August 7, 2026.',
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
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) => `  <url>
    <loc>${pageUrl(path)}</loc>
    <lastmod>${siteLastModified}</lastmod>
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
- Email: ${business.email}
- Availability: ${business.availabilityNote}
- Primary market: Raleigh, NC and surrounding Triangle communities
- Instagram: ${business.instagram}
- Facebook: ${business.facebook}
- Google reviews: ${business.googleReviews}
- Google rating: ${business.rating}/5 from ${business.reviewCount} reviews
- Leave a Google review: ${business.googleWriteReview}

## Services

${services
  .map(
    (service) =>
      `- ${service.title}: ${service.short}\n  - Jobs covered: ${serviceProfiles[service.slug].jobs.map((job) => job.title).join(', ')}`,
  )
  .join('\n')}

## Service areas

${areas.map((area) => `- ${area.name}, ${area.region}`).join('\n')}

## Important accuracy notes

- No verified street address is published on this website because Envision operates as a service-area business.
- Service availability, scheduling, estimate scope, price, and promotional eligibility must be confirmed directly with Envision.
- The embedded Jobber estimate form sends the visitor's submitted details directly into Envision's Jobber request queue.
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
  ...services.flatMap((service) =>
    (service.localize === false ? [] : areas)
      .filter((area) => area.slug !== 'raleigh-nc')
      .map((area) => [
        localizedServiceEntryPath(service, area),
        localizedServicePage(service, area),
      ]),
  ),
  ...areas
    .filter((area) => area.slug !== 'raleigh-nc')
    .map((area) => [`service-areas/${area.slug}`, areaPage(area)]),
];

// Rebuild the selected city directory from the verified service-area data so
// stale or unsupported city pages cannot survive between builds.
await rm(join(root, 'service-areas'), { recursive: true, force: true });
// Rebuild service pages from the current owner-approved service list so removed
// offerings cannot remain accessible as stale generated files.
await rm(join(root, 'services'), { recursive: true, force: true });

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
