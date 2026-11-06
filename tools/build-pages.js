/* Static page builder for the Krish Metal Corporation site (NOT needed on the web server).
   Regenerates every .html page, sitemap.xml, robots.txt and product SVGs from js/products-data.js.
   Usage (from the project folder):  node tools/build-pages.js .  */
const fs = require('fs');
const path = require('path');
const OUT = path.resolve(process.argv[2] || '.');
const KMC = require(path.join(OUT, 'js', 'products-data.js'));

/* Live website address – used for canonical URLs, sitemap and link-preview (og:image) URLs.
   These MUST point to where the site is actually hosted, or link previews show an empty image.
   Currently the GitHub Pages address. When www.krishmetalcorp.com goes live, change it here (or override:)
   Override when building:  SITE_URL=https://your-domain.com node tools/build-pages.js .  */
const SITE = (process.env.SITE_URL || 'https://softoboticstechnologies.github.io/krish-metal-corporation').replace(/\/+$/, '');
const OG_IMAGE = SITE + '/assets/images/og-image.png';
const PHONE = '+919921066212', PHONE_TXT = '+91 99210 66212';
const EMAIL = 'krishmetalcorp@gmail.com';
const GST = '27AUAPK6096N1Z1';
const IG = 'https://www.instagram.com/krishmetalcorp/';
const GMB = 'https://share.google/5WgRgUuL6z1CQN7ll';
const ADDRESS = 'Gat no 117/2, Jay Ganesh Samrajya Chowk, Jayawant Nagar, Landge Industrial Estate, Bhosari, Pune 411039, Maharashtra, India';
const ADDR_HTML = 'Gat no 117/2, Jay Ganesh Samrajya Chowk,<br>Jayawant Nagar, Landge Industrial Estate,<br>Bhosari, Pune 411039, Maharashtra, India';
const MAP = 'https://www.google.com/maps?q=' + encodeURIComponent(ADDRESS) + '&output=embed';
const WA_DEFAULT = 'https://wa.me/919921066212?text=Hello%20Krish%20Metal%20Corporation%2C%20I%20want%20to%20enquire%20about%20press%20brake%20tools.';
const wa = (m) => 'https://wa.me/919921066212?text=' + encodeURIComponent(m);
const CAT_PDF = 'assets/catalogue/Krish-Metal-Corporation-Catalogue.pdf';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS = { punches: 'fa-arrow-down-long', gooseneck: 'fa-bezier-curve', radius: 'fa-circle-half-stroke', hemming: 'fa-compress', flattening: 'fa-grip-lines',
  tdies: 'fa-t', multiv: 'fa-shapes', singlev: 'fa-v', insert: 'fa-layer-group', nylon: 'fa-droplet', '2v': 'fa-arrows-left-right', zbend: 'fa-stairs',
  holders: 'fa-toolbox', shear: 'fa-scissors', special: 'fa-gears' };
const TAG = { punches: 'Punch', gooseneck: 'Punch', radius: 'Punch', hemming: 'Die', flattening: 'Set', tdies: 'Die', multiv: 'Die', singlev: 'Die', insert: 'Die',
  nylon: 'Die', '2v': 'Die', zbend: 'Set', holders: 'Holder', shear: 'Blade', special: 'Custom' };
const GROUPS = [
  { title: 'Punches & Upper Tools', keys: ['punches', 'gooseneck', 'radius', 'hemming', 'flattening'] },
  { title: 'Dies', keys: ['tdies', 'multiv', 'singlev', 'insert', 'nylon', '2v', 'zbend'] },
  { title: 'Holders & More', keys: ['holders', 'shear', 'special'] }
];
const cat = (k) => KMC.category(k);

/* ======================= SVG PLACEHOLDER DRAWINGS ======================= */
const SHAPES = {
  punch: '<path class="s" d="M128 22h44v34h-7v12h15v118l-30 76-30-76V68h15V46h-7z"/>',
  gooseneck: '<path class="s" d="M150 22h40v46h12v36l-34 36q-14 16 2 34l42 74-18 8-60-78q-22-30-22-60V68h38z"/>',
  radius: '<path class="s" d="M128 22h44v34h-7v12h15v130q0 40-30 40t-30-40V68h15V46h-7z"/><circle cx="150" cy="200" r="30" fill="none" stroke="#F5A623" stroke-dasharray="5 5" stroke-width="2"/>',
  hemming: '<path class="s" d="M70 270h160v-96h-30v-24h20l-50-80h-40l-50 80h20v24H70z"/><path d="M118 150h64" stroke="#F5A623" stroke-width="4"/><path d="M136 196v60M150 196v60M164 196v60" stroke="#0A47C2" stroke-width="2" stroke-dasharray="4 4"/>',
  flatten: '<path class="s" d="M130 18h40v40h-6v10h12v70l-26 60-26-60V68h12V48h-6z"/><path class="s" d="M80 280h140v-74h-62v52h-16v-52H80z"/>',
  tdie: '<path class="s" d="M60 270h180v-30h-62V96h-12l-16 26-16-26h-12v144H60z"/>',
  vdie: '<path class="s" d="M55 270h190V110h-34l-61 74-61-74H55z"/>',
  multiv: '<path class="s" d="M70 70h40l40 40 40-40h40v40l-40 40 40 40v40h-40l-40-40-40 40H70v-40l40-40-40-40z"/>',
  insertdie: '<path class="s" d="M60 270h180v-50h-40v-40h-24v40h-52v-40h-24v40H60z"/><path class="s" d="M124 222V90h-8l0 0h68v132z"/><path d="M134 90l16 26 16-26" fill="#fff" stroke="#0A47C2" stroke-width="3"/>',
  pudie: '<path class="s" d="M50 270h200V110h-40v100H90V110H50z"/><rect x="92" y="120" width="116" height="88" rx="4" fill="#E4572E" stroke="#9E2A12" stroke-width="3"/>',
  twov: '<path class="s" d="M60 270h180v-110H60z"/><path class="s" d="M80 160V100h20l14 24 14-24h44l14 24 14-24h20v60z"/>',
  zbend: '<path class="s" d="M70 30h110v100h-40l-30 30H70z"/><path class="s" d="M120 180l30-30h80v120H120z"/><path d="M60 150l60 0 30 30 90 0" fill="none" stroke="#F5A623" stroke-width="5"/>',
  holder: '<path class="s" d="M30 210h240v50H30z"/><path class="s" d="M60 210v-40h30v24h120v-24h30v40z"/><path d="M120 60h60v110h-60z" fill="none" stroke="#0A47C2" stroke-width="2.5" stroke-dasharray="8 6"/>',
  blade: '<path class="s" d="M20 120h260l-20 60H20z"/><path d="M20 150h250" stroke="#F5A623" stroke-width="3"/><circle cx="60" cy="150" r="7" fill="#fff" stroke="#0A47C2" stroke-width="3"/><circle cx="150" cy="150" r="7" fill="#fff" stroke="#0A47C2" stroke-width="3"/><circle cx="240" cy="150" r="7" fill="#fff" stroke="#0A47C2" stroke-width="3"/>',
  special: '<path class="s" d="M118 20h40v32h-7v10h15v60l-26 40-12-20-20 30-10-40V62h15V40h-5z"/><path class="s" d="M60 270h180v-80h-50l-20 30-20-30-20 30-20-30H60z"/>'
};
function productSVG(draw, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" role="img" aria-label="${esc(title)} – line drawing">
<defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FDFEFF"/><stop offset=".45" stop-color="#D9E0EA"/><stop offset=".6" stop-color="#F3F6FA"/><stop offset="1" stop-color="#C8D1DE"/></linearGradient>
<pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0v20" fill="none" stroke="#0A47C2" stroke-opacity=".07"/></pattern></defs>
<style>.s{fill:url(#m);stroke:#0A47C2;stroke-width:3;stroke-linejoin:round}</style>
<rect width="300" height="300" fill="url(#g)"/>
<line x1="150" y1="8" x2="150" y2="292" stroke="#0A47C2" stroke-opacity=".35" stroke-dasharray="12 4 2 4"/>
${SHAPES[draw]}
<text x="12" y="290" font-family="Arial, sans-serif" font-size="11" fill="#5B6676">KMC</text>
</svg>`;
}

/* ============================ COMMON PARTS ============================ */
function head(p) {
  const url = SITE + '/' + (p.file === 'index.html' ? '' : p.file);
  const r = p.root;
  const ld = {
    '@context': 'https://schema.org', '@type': ['LocalBusiness', 'Organization'], '@id': SITE + '/#business',
    name: 'Krish Metal Corporation', url: SITE + '/', logo: SITE + '/assets/logo/logo-icon-512.png', image: SITE + '/assets/images/site/hero-tools.jpg',
    description: 'Manufacturer of KMC / EURO style press brake tools – punches, dies, radius tools, hemming tools, holders – and shearing blade resharpening, Bhosari, Pune.',
    foundingDate: '2016', telephone: PHONE, email: EMAIL, taxID: GST, vatID: GST, priceRange: 'Price on request',
    address: { '@type': 'PostalAddress', streetAddress: 'Gat no 117/2, Jay Ganesh Samrajya Chowk, Jayawant Nagar, Landge Industrial Estate, Bhosari', addressLocality: 'Pune', addressRegion: 'Maharashtra', postalCode: '411039', addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: 18.6298, longitude: 73.8478 },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '09:30', closes: '19:00' }],
    sameAs: [IG, GMB],
    contactPoint: [{ '@type': 'ContactPoint', telephone: PHONE, contactType: 'sales', areaServed: 'IN', availableLanguage: ['English', 'Hindi', 'Marathi'] }]
  };
  const crumbs = p.crumbs ? {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: p.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: SITE + '/' + (c[1] || p.file) }))
  } : null;
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<meta name="keywords" content="press brake tools manufacturer Pune, press brake punch, press brake die, gooseneck punch, hemming tool, radius tool, multi V die, 2V self-centering die, Bhosari, Maharashtra, India">
<meta name="author" content="Krish Metal Corporation">
<meta name="theme-color" content="#0A47C2">
<meta name="robots" content="${p.noindex ? 'noindex, follow' : 'index, follow'}">
<link rel="canonical" href="${url}">
<!-- Open Graph / Twitter -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Krish Metal Corporation">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:secure_url" content="${OG_IMAGE}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Krish Metal Corporation logo">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${OG_IMAGE}">
<!-- Icons -->
<link rel="icon" type="image/png" sizes="64x64" href="${r}assets/logo/favicon.png">
<link rel="apple-touch-icon" href="${r}assets/logo/apple-touch-icon.png">
<!-- Fonts & icons (CDN) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@500;600;700&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
<link rel="stylesheet" href="${r}css/style.css">
${p.preload || ''}<!-- Structured data. NOTE: geo coordinates are approximate for Landge Industrial Estate, Bhosari – update from Google Business Profile if needed. -->
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${crumbs ? `<script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n` : ''}</head>
<body data-root="${r}">
<a class="skip-link" href="#main">Skip to main content</a>
<!-- Preloader -->
<div class="preloader" aria-hidden="true"><div class="preloader__inner"><img src="${r}assets/logo/logo-stacked.png" alt="" width="160" height="141"><div class="preloader__bar"></div></div></div>
`;
}

function megaLinks(r, current) {
  return GROUPS.map((g) => `<div><p class="mega__title">${g.title}</p>${g.keys.map((k) => { const c = cat(k); return `<a href="${r}products/${c.slug}.html"${current === k ? ' aria-current="page"' : ''}><i class="fa-solid ${ICONS[k]}" aria-hidden="true"></i>${esc(c.menu)}</a>`; }).join('')}</div>`).join('');
}

function header(p) {
  const r = p.root;
  const NAV = [['index.html', 'Home'], ['about.html', 'About Us'], ['products', 'Products'], ['services.html', 'Services'], ['technical.html', 'Technical Info'], ['gallery.html', 'Gallery'], ['clients.html', 'Clients'], ['contact.html', 'Contact Us']];
  const items = NAV.map(([href, label]) => {
    if (href === 'products') {
      const isCur = p.nav === 'products';
      return `<li class="nav__item nav__item--mega${isCur ? ' is-current' : ''}">
          <button type="button" class="nav__toggle-sub" aria-expanded="false" aria-controls="mega-products">Products <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>
          <div class="mega" id="mega-products">
            <div class="mega__inner">
              <a href="${r}products.html" class="mega__all"><i class="fa-solid fa-table-cells-large" aria-hidden="true"></i>All Products &amp; Tool Finder</a>
              <div class="mega__cols">${megaLinks(r, p.cat)}</div>
              <div class="mega__foot"><span>KMC / EURO style tooling · induction hardened 55–60 HRC · Price on request</span><a class="btn btn--primary btn--sm" href="${r}${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Catalogue</a></div>
            </div>
          </div>
        </li>`;
    }
    return `<li class="nav__item"><a class="nav__link" href="${r}${href}"${p.file === href ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('\n        ');
  return `
<!-- ===================== TOP BAR ===================== -->
<div class="topbar">
  <div class="container">
    <div class="topbar__left">
      <a class="hide-mobile" href="tel:${PHONE}" aria-label="Call ${PHONE_TXT}"><i class="fa-solid fa-phone" aria-hidden="true"></i>${PHONE_TXT}</a>
      <a class="hide-mobile topbar__email" href="mailto:${EMAIL}"><i class="fa-solid fa-envelope" aria-hidden="true"></i>${EMAIL}</a>
      <span class="topbar__gst" title="GST Number"><i class="fa-solid fa-receipt" aria-hidden="true"></i>GST: <strong>${GST}</strong></span>
    </div>
    <div class="topbar__right">
      <a class="topbar__quote show-mobile" href="${r}contact.html#enquiry" data-quote><i class="fa-solid fa-file-invoice" aria-hidden="true"></i>Get a Quote</a>
      <a class="hide-mobile" href="${r}${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>Catalogue</a>
      <a class="topbar__icon hide-mobile" href="${WA_DEFAULT}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>
      <a class="topbar__icon hide-mobile" href="${IG}" target="_blank" rel="noopener" aria-label="Krish Metal Corporation on Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
    </div>
  </div>
</div>

<!-- ===================== HEADER ===================== -->
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="${r}index.html" aria-label="Krish Metal Corporation – Home">
      <img src="${r}assets/logo/logo.png" alt="Krish Metal Corporation logo" width="191" height="56">
    </a>
    <nav class="nav" id="site-nav" aria-label="Main navigation">
      <div class="nav__head">
        <img src="${r}assets/logo/logo.png" alt="Krish Metal Corporation" width="136" height="40">
        <button type="button" class="nav-close" aria-label="Close menu"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>
      <ul class="nav__list">
        ${items}
      </ul>
      <div class="nav__extra">
        <a class="btn btn--primary" href="${r}contact.html#enquiry" data-quote><i class="fa-solid fa-file-invoice" aria-hidden="true"></i> Get a Quote</a>
        <a class="btn btn--outline" href="${r}${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Catalogue</a>
        <a class="btn btn--wa" href="${WA_DEFAULT}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp Us</a>
      </div>
      <div class="nav__contact">
        <a href="tel:${PHONE}"><i class="fa-solid fa-phone" aria-hidden="true"></i>${PHONE_TXT}</a>
        <a href="mailto:${EMAIL}"><i class="fa-solid fa-envelope" aria-hidden="true"></i>${EMAIL}</a>
      </div>
    </nav>
    <div class="header-actions">
      <a class="btn btn--outline btn--sm btn--cat" href="${r}${CAT_PDF}" download aria-label="Download catalogue (PDF)"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Catalogue</a>
      <a class="btn btn--accent btn--sm btn--quote" href="${r}contact.html#enquiry" data-quote>Get a Quote</a>
      <button type="button" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>
<div class="nav-overlay" aria-hidden="true"></div>
`;
}

function footer(p) {
  const r = p.root;
  const prods = KMC.categories.map((c) => `<li><a href="${r}products/${c.slug}.html">${esc(c.title)}</a></li>`).join('');
  return `
<!-- ===================== FOOTER ===================== -->
<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-col">
      <a class="footer-logo" href="${r}index.html"><img src="${r}assets/logo/logo-footer.png" alt="Krish Metal Corporation" width="640" height="564" loading="lazy"></a>
      <p>Manufacturer of KMC / EURO style press brake tools since 2016 – punches, dies, radius and hemming tools, holders, shearing knives and blade resharpening, from Bhosari, Pune.</p>
      <p class="footer-gst"><span class="gst-badge"><i class="fa-solid fa-receipt" aria-hidden="true"></i>GST: <strong>${GST}</strong></span></p>
      <div class="socials">
        <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
        <a href="${WA_DEFAULT}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>
        <a href="${GMB}" target="_blank" rel="noopener" aria-label="Google Business Profile"><i class="fa-brands fa-google" aria-hidden="true"></i></a>
        <a href="mailto:${EMAIL}" aria-label="Email"><i class="fa-solid fa-envelope" aria-hidden="true"></i></a>
      </div>
      <div class="footer-btns">
        <a class="btn btn--accent btn--sm" href="${r}${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Catalogue</a>
        <a class="btn btn--light btn--sm" href="${GMB}" target="_blank" rel="noopener"><i class="fa-solid fa-star" aria-hidden="true"></i> Review us on Google</a>
      </div>
    </div>
    <div class="footer-col">
      <h3>Quick Links</h3>
      <ul class="footer-links">
        <li><a href="${r}index.html">Home</a></li>
        <li><a href="${r}about.html">About Us</a></li>
        <li><a href="${r}products.html">All Products</a></li>
        <li><a href="${r}services.html">Services</a></li>
        <li><a href="${r}technical.html">Technical Info</a></li>
        <li><a href="${r}technical.html#calculator">Bending Force Calculator</a></li>
        <li><a href="${r}gallery.html">Gallery</a></li>
        <li><a href="${r}clients.html">Clients</a></li>
        <li><a href="${r}contact.html">Contact Us</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Products</h3>
      <ul class="footer-links">${prods}</ul>
    </div>
    <div class="footer-col">
      <h3>Contact Us</h3>
      <ul class="footer-contact">
        <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>${ADDR_HTML}</span></li>
        <li><i class="fa-solid fa-phone" aria-hidden="true"></i><a href="tel:${PHONE}">${PHONE_TXT}</a></li>
        <li><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><a href="${WA_DEFAULT}" target="_blank" rel="noopener">${PHONE_TXT}</a></li>
        <li><i class="fa-solid fa-envelope" aria-hidden="true"></i><a href="mailto:${EMAIL}">${EMAIL}</a></li>
        <li><i class="fa-solid fa-clock" aria-hidden="true"></i><span>Mon – Sat: 9:30 AM – 7:00 PM</span></li>
      </ul>
      <div class="footer-map"><iframe src="${MAP}" title="Krish Metal Corporation location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-bottom__bar">
      <div>&copy; <span data-year>2026</span> Krish Metal Corporation. All rights reserved.</div>
      <div class="footer-credit">
        <span class="footer-credit__divider" aria-hidden="true">|</span>
        <span>Powered by</span>
        <a href="https://dripfunnel.com" target="_blank" rel="noopener noreferrer"><img src="${r}assets/dripfunnel/DRIPFUNNEL%20white%20logo.png" alt="DripFunnel" width="2077" height="369" loading="lazy"></a>
      </div>
    </div>
  </div>
</footer>

<!-- ===================== FLOATING ACTIONS ===================== -->
<div class="fab-stack">
  <button type="button" class="fab fab--top" aria-label="Back to top"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i><span class="fab__tip">Back to top</span></button>
  <a class="fab fab--call" href="tel:${PHONE}" aria-label="Call Krish Metal Corporation"><i class="fa-solid fa-phone" aria-hidden="true"></i></a>
  <a class="fab fab--wa" href="${WA_DEFAULT}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" aria-expanded="false" aria-controls="wa-popup"><span class="fab__label">Chat with us</span><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></a>
</div>
<div class="wa-popup" id="wa-popup" role="dialog" aria-label="Start a WhatsApp chat">
  <div class="wa-popup__head">
    <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
    <div><strong>Krish Metal Corporation</strong><span>Typically replies within an hour</span></div>
    <button type="button" class="wa-popup__close" aria-label="Close chat"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
  </div>
  <form class="wa-popup__body">
    <div class="field"><label for="wa-name">Your name</label><input id="wa-name" name="wa-name" type="text" autocomplete="name"></div>
    <div class="field"><label for="wa-mobile">Mobile</label><input id="wa-mobile" name="wa-mobile" type="tel" autocomplete="tel" inputmode="tel"></div>
    <div class="field"><label for="wa-product">Product</label><select id="wa-product" name="wa-product"><option value="">Select a product</option></select></div>
    <button class="btn btn--wa btn--block" type="submit"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Start Chat</button>
    <p class="wa-popup__quick">Opens WhatsApp with your details pre-filled.</p>
  </form>
</div>
${p.file === 'contact.html' ? '' : `<!-- "Get a Quote" popup (the contact page shows this form inline instead) -->
<div class="quote-modal" id="quote-modal" role="dialog" aria-modal="true" aria-labelledby="quote-title" hidden>
  <div class="quote-modal__panel">
    <button type="button" class="quote-modal__close" aria-label="Close enquiry form"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
    <span class="eyebrow">Enquiry Form</span>
    <h2 id="quote-title">Request a quote</h2>
${enquiryForm()}
  </div>
</div>
`}
<script src="${r}js/products-data.js" defer></script>
<script src="${r}js/main.js" defer></script>
</body>
</html>
`;
}

function banner(title, sub, crumbs, r) {
  const li = crumbs.map((c, i) => i === crumbs.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${r}${c[1]}">${esc(c[0])}</a></li>`).join('');
  return `<section class="page-banner">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol>${li}</ol></nav>
    <h1>${title}</h1>
    ${sub ? `<p>${sub}</p>` : ''}
  </div>
</section>`;
}

/* Card image: profile drawing cropped from the KMC catalogue when one exists, otherwise the generated SVG */
function cardImg(c) {
  const dir = path.join(OUT, 'assets/images/products/catalogue');
  const f = ['.png', '.jpg'].map((x) => c.slug + x).find((n) => fs.existsSync(path.join(dir, n)));
  return f ? { src: 'assets/images/products/catalogue/' + f, photo: f.endsWith('.jpg') } : { src: `assets/images/products/${c.slug}.svg` };
}

function card(c, r, delay) {
  const img = cardImg(c);
  return `<article class="card reveal${delay ? ' reveal-delay-' + delay : ''}">
  <a class="card__media${img.photo ? ' card__media--photo' : ''}" href="${r}products/${c.slug}.html" tabindex="-1" aria-hidden="true">
    <span class="card__tag">${TAG[c.key]}</span>
    <img src="${r}${img.src}" alt="${esc(c.title)}" width="300" height="225" loading="lazy">
  </a>
  <div class="card__body">
    <h3><a href="${r}products/${c.slug}.html">${esc(c.title)}</a></h3>
    <p>${esc(c.short)}</p>
    <div class="card__price">Price on Request</div>
    <div class="card__actions">
      <a class="btn btn--primary btn--sm" href="${r}products/${c.slug}.html">View Details</a>
      <a class="btn btn--outline btn--sm" href="${r}contact.html?product=${encodeURIComponent(c.title)}#enquiry">Enquire</a>
    </div>
  </div>
</article>`;
}

function ctaBand(r, title, text) {
  return `<section class="cta-band" aria-label="Contact call to action">
  <div class="container">
    <div>
      <h2>${title || 'Need a custom tool? Send us your drawing.'}</h2>
      <p>${text || 'Our engineers will propose the right punch and die geometry for your part and press brake.'}</p>
    </div>
    <div class="btn-row">
      <a class="btn btn--accent" href="tel:${PHONE}"><i class="fa-solid fa-phone" aria-hidden="true"></i> Call Now</a>
      <a class="btn btn--wa" href="${WA_DEFAULT}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
      <a class="btn btn--light" href="${r}contact.html#enquiry"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Enquiry</a>
    </div>
  </div>
</section>`;
}

const brandsMarquee = () => `<div class="marquee" aria-label="Compatible press brake brands"><div class="marquee__track brands">${KMC.brands.map((b) => `<span>${esc(b)}</span>`).join('')}</div></div>
<p class="disclaimer">KMC is not affiliated or connected with the mentioned trademarks and manufacturers; they are listed for information purposes only.</p>`;

const picture = (r, name, alt, w, h, attrs = '') => `<picture><source srcset="${r}assets/images/site/${name}.webp" type="image/webp"><img src="${r}assets/images/site/${name}.jpg" alt="${esc(alt)}" width="${w}" height="${h}" ${attrs}></picture>`;

function write(file, html) {
  const full = path.join(OUT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}
function page(p, body) {
  p.root = p.root || '';
  write(p.file, head(p) + header(p) + '\n<main id="main">\n' + body + '\n</main>\n' + footer(p));
}

/* ================================ HOME ================================ */
function home() {
  const r = '';
  const slides = [
    { h: 'Precision Press Brake Tools – <span>KMC / EURO Style</span>', p: 'Punches, dies and holders manufactured in Pune for press brakes from 50+ machine builders.', chips: ['Air bending', 'Coining', 'Bottom bending'], bg: 'hero-1', alt: '' },
    { h: 'Punches · Dies · Radius Tools · <span>Hemming Tools</span> · Adapters &amp; Holders', p: 'One partner for the complete bending set-up – from standard 88° punches to custom radius and Z-bend tooling.', chips: ['100+ profiles', 'Solid & sectioned'], bg: 'hero-2', alt: ' hero__bg--alt' },
    { h: 'Induction Hardened <span>55–60 HRC</span> for Long Tool Life', p: 'Hardened 3–4 mm deep on every working edge, in Economy, Production and Professional steel grades.', chips: ['C45', 'C45 quenched', 'Cr42Mo4'], bg: 'hero-3', alt: '' },
    { h: '<span>24h / 48h / 72h</span> Delivery on Stock Items', p: 'Common positions are kept in stock so your machine is back to bending without long waits.', chips: ['Pan-India dispatch', 'Free DXF geometry'], bg: 'hero-4', alt: ' hero__bg--alt' }
  ];
  const slideHTML = slides.map((s, i) => `<div class="hero__slide${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${slides.length}">
      <div class="hero__bg${s.alt}">${picture(r, s.bg, '', 1920, 868, i === 0 ? 'fetchpriority="high"' : 'loading="lazy"')}</div>
      <div class="container">
        <div class="hero__content">
          <span class="eyebrow">Krish Metal Corporation · Since 2016</span>
          ${i === 0 ? '<h1>' + s.h + '</h1>' : '<h2 class="hero__title">' + s.h + '</h2>'}
          <div class="hero__chips">${s.chips.map((c) => `<span>${c}</span>`).join('')}</div>
          <p>${s.p}</p>
          <div class="btn-row">
            <a class="btn btn--accent" href="products.html"><i class="fa-solid fa-grip" aria-hidden="true"></i> Explore Products</a>
            <a class="btn btn--light" href="${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Catalogue</a>
            <a class="btn btn--wa" href="${WA_DEFAULT}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp Us</a>
          </div>
        </div>
      </div>
    </div>`).join('\n    ');

  const why = [
    ['fa-fire-flame-curved', 'Induction Hardened 55–60 HRC', 'Working areas hardened 3–4 mm deep for edge life that outlasts untreated tooling.'],
    ['fa-layer-group', '3 Material Grades', 'Economy (C45), Production (C45 quenched) and Professional (Cr42Mo4) – pay only for the strength you need.'],
    ['fa-industry', 'Fits 50+ Press Brake Brands', 'Standard KMC / EURO clamping suits Amada, Bystronic, Durma, Ermaksan, Yangli and many more.'],
    ['fa-truck-fast', '24 / 48 / 72 h Stock Delivery', 'Common positions held in stock and dispatched fast across India.'],
    ['fa-compass-drafting', 'Custom Tooling to Drawing', 'Special profiles, joggles and radius tools engineered from your part drawing.'],
    ['fa-file-code', 'Free DXF for CNC Libraries', 'Every tool we sell comes with its true 2D geometry for your controller’s tool library.'],
    ['fa-cube', 'Bending Visualisation', 'Collision checks of the bending sequence on request – before you order tooling.'],
    ['fa-headset', 'Engineer-to-Engineer Support', 'Talk directly to people who understand bending: tonnage, V-openings and springback.']
  ];
  const testimonials = [
    ['Rajesh Patel', 'Production Head, Shree Ganesh Fabricators, Ahmedabad', 'The press brake punches and dies from Krish Metal are spot on. Bend angles stay consistent across long batches and we have cut our rework almost completely.'],
    ['Suresh Iyer', 'Plant Manager, Iyer Engineering Works, Chennai', 'We needed a custom gooseneck punch on short notice. The team understood the drawing, suggested a better profile and delivered before the promised date.'],
    ['Priya Sharma', 'Purchase Manager, Sharma Sheet Metal Pvt. Ltd., Pune', 'Pricing is fair, quotations come quickly and every consignment arrives well packed. Dealing with Krish Metal has been completely hassle-free.'],
    ['Amit Deshmukh', 'Owner, Deshmukh Industries, Nashik', 'Their tooling fits our CNC press brake perfectly. Hardness and finish are excellent, and the tools have lasted far longer than what we used before.'],
    ['Harpreet Singh', 'Director, Singh Metal Craft, Ludhiana', 'Very knowledgeable people. They helped us choose the right V-opening and tonnage for thicker plates, which saved us from cracked bends and wasted material.'],
    ['Venkatesh Reddy', 'Maintenance Engineer, Reddy Precision Components, Hyderabad', 'Segmented tooling from Krish Metal made our setups much faster. Quality is consistent and after-sales support responds the same day.'],
    ['Neha Agarwal', 'Operations Manager, Agarwal Enclosures, Jaipur', 'We make electrical panels and need sharp, accurate bends. Their dies give a clean finish without marking, which our customers notice.'],
    ['Manoj Kulkarni', 'Proprietor, Kulkarni Fabrication, Rajkot', 'Ordered a full set of upper and lower tools for a new machine. Everything was ready to use out of the box. Highly recommended for any fabrication shop.']
  ];
  const body = `
<!-- ===================== HERO SLIDER ===================== -->
<section class="hero" aria-roledescription="carousel" aria-label="Highlights">
  <div class="hero__track">
    ${slideHTML}
  </div>
  <div class="hero__controls">
    <div class="container">
      <div class="hero__dots" role="group" aria-label="Choose slide"></div>
      <div class="hero__arrows">
        <button type="button" class="hero__arrow hero__arrow--prev" aria-label="Previous slide"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i></button>
        <button type="button" class="hero__arrow hero__arrow--next" aria-label="Next slide"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>
  </div>
</section>

<!-- ===================== ABOUT SNAPSHOT ===================== -->
<section class="section">
  <div class="container split">
    <div class="about-media reveal">
      ${picture(r, 'press-brake-machine', 'Press brake fitted with KMC / EURO style punches', 710, 534, 'loading="lazy"')}
      <div class="exp-badge"><strong><span data-years-exp>10</span>+</strong><span class="exp-badge__label">Years of<br>Experience</span></div>
      ${picture(r, 'tool-stock', 'Stock of press brake punches ready for dispatch', 710, 534, 'loading="lazy" class="about-media__second"')}
    </div>
    <div class="reveal reveal-delay-1">
      <span class="eyebrow">About Krish Metal Corporation</span>
      <h2>Bending tools built by people who understand bending</h2>
      <p class="lead">Established in 2016 in Bhosari, Pune, Krish Metal Corporation manufactures and services Press Brake Tools, Forming Tool Dies, Shearing Machine Knives and Machine Guide-ways, and offers a Shearing Blade Resharpening Service.</p>
      <p>We supply tooling for every press brake process – air bending, coining / stamping and bottom bending – with clamping that suits most press brakes in use today. Alongside our standard range we design custom geometries for parts that standard tools cannot make.</p>
      <ul class="check-list">
        <li>Standard KMC / EURO profiles in 835 / 415 mm solid and 805 mm sectioned lengths</li>
        <li>Induction hardened working edges, 55–60 HRC</li>
        <li>Tool selection help, tonnage checks and DXF files at no extra cost</li>
      </ul>
      <a class="btn btn--primary" href="about.html">Read More <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
    </div>
  </div>
</section>

<!-- ===================== PRODUCT RANGE ===================== -->
<section class="section section--steel" id="products">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Our Product Range</span>
      <h2>Press brake tooling for every bend</h2>
      <p class="lead">Fifteen product families, one standard clamping system. Every product is <strong>Price on Request</strong> – tell us your machine and part, and we will quote the right set.</p>
    </div>
    <div class="grid-4">
      ${KMC.categories.map((c, i) => card(c, r, (i % 4) || '')).join('\n      ')}
    </div>
  </div>
</section>

<!-- ===================== COUNTERS =====================
     CLIENT: confirm the final numbers below (data-count values). -->
<section class="section section--blue">
  <div class="container">
    <div class="counters">
      <div class="counter"><div class="counter__num"><span data-count="10" data-count-years>10</span><small>+</small></div><div class="counter__label">Years of Experience</div></div>
      <div class="counter"><div class="counter__num"><span data-count="100">100</span><small>+</small></div><div class="counter__label">Tool Profiles</div></div>
      <div class="counter"><div class="counter__num"><span data-count="50">50</span><small>+</small></div><div class="counter__label">Compatible Machine Brands</div></div>
      <div class="counter"><div class="counter__num">24<small>/</small>48<small>/</small>72<small>h</small></div><div class="counter__label">Delivery Options</div></div>
    </div>
  </div>
</section>

<!-- ===================== WHY CHOOSE US ===================== -->
<section class="section">
  <div class="tech-lines" aria-hidden="true"></div>
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Why Choose Us</span>
      <h2>Tooling you can set up and forget</h2>
      <p class="lead">Consistent heights, hardened edges and honest technical advice – the things that keep a press brake productive.</p>
    </div>
    <div class="grid-4">
      ${why.map((w, i) => `<div class="feature reveal${i % 4 ? ' reveal-delay-' + (i % 4) : ''}"><div class="feature__icon"><i class="fa-solid ${w[0]}" aria-hidden="true"></i></div><h3>${w[1]}</h3><p>${w[2]}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- ===================== MISSION & VISION ===================== -->
<section class="section section--steel">
  <div class="container split split--wide">
    <div class="reveal">
      <span class="eyebrow">Mission &amp; Vision</span>
      <h2>Making every bend right the first time</h2>
      <p class="lead">From a single punch to a full machine set, we aim to give fabricators tooling that is accurate, durable and delivered when it is needed.</p>
      <div class="tabs">
        <div class="tabs__list" role="tablist" aria-label="Mission, vision and values">
          <button class="tabs__btn" role="tab" id="tab-m" aria-selected="true" aria-controls="panel-m">Our Mission</button>
          <button class="tabs__btn" role="tab" id="tab-v" aria-selected="false" aria-controls="panel-v" tabindex="-1">Our Vision</button>
          <button class="tabs__btn" role="tab" id="tab-q" aria-selected="false" aria-controls="panel-q" tabindex="-1">Our Values</button>
        </div>
        <div class="tabs__panel" role="tabpanel" id="panel-m" aria-labelledby="tab-m">
          <p class="mb-0">To manufacture press brake tooling that holds its accuracy shift after shift, to stock the profiles our customers use most, and to support every order with practical engineering advice – so Indian fabricators can bend faster, scrap less and stay competitive.</p>
        </div>
        <div class="tabs__panel" role="tabpanel" id="panel-v" aria-labelledby="tab-v" hidden>
          <p class="mb-0">To be the first name sheet-metal workshops across India think of for press brake tools – a Pune-based manufacturer known for precision, fast delivery and custom solutions that match the quality of imported tooling.</p>
        </div>
        <div class="tabs__panel" role="tabpanel" id="panel-q" aria-labelledby="tab-q" hidden>
          <ul class="check-list mb-0"><li>Accuracy we can measure</li><li>Straight answers on what a tool can and cannot do</li><li>Delivery commitments we keep</li><li>Long-term relationships over one-time sales</li></ul>
        </div>
      </div>
    </div>
    <div class="reveal reveal-delay-1">
      ${picture(r, 'tool-stock', 'Press brake punches stacked in the Krish Metal Corporation store', 710, 534, 'loading="lazy" style="border-radius:8px;box-shadow:var(--shadow-lg)"')}
    </div>
  </div>
</section>

<!-- ===================== COMPATIBLE BRANDS ===================== -->
<section class="section section--dark">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">KMC Tool System</span>
      <h2>Compatible with press brakes from 50+ manufacturers</h2>
      <p class="lead">Our standard KMC / EURO clamping fits a wide range of machines, including:</p>
    </div>
    ${brandsMarquee()}
  </div>
</section>

<!-- ===================== CLIENTS =====================
     CLIENT: replace assets/images/clients/client-1.png … client-12.png with your real client logos. -->
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Our Clients</span>
      <h2>Trusted by fabricators and OEMs</h2>
    </div>
    <div class="carousel carousel--logos" data-autoplay>
      <div class="carousel__track">
        ${Array.from({ length: 12 }, (_, i) => `<div class="logo-tile"><img src="assets/images/clients/client-${i + 1}.png" data-placeholder="Client logo ${i + 1}" alt="Client logo ${i + 1}" width="180" height="70" loading="lazy"></div>`).join('\n        ')}
      </div>
      <div class="carousel__nav"><button type="button" class="carousel__btn carousel__btn--prev" aria-label="Previous logos"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><button type="button" class="carousel__btn carousel__btn--next" aria-label="Next logos"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></div>
    </div>
  </div>
</section>

<!-- ===================== TESTIMONIALS =====================
     CLIENT: replace the eight sample testimonials with real customer feedback. -->
<section class="section section--steel">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Testimonials</span>
      <h2>What our customers say</h2>
    </div>
    <div class="grid-4">
      ${testimonials.map(t => `<figure class="testimonial reveal">
        <div class="testimonial__stars" aria-label="5 out of 5 stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        <blockquote>${t[2]}</blockquote>
        <figcaption class="testimonial__who"><span class="testimonial__avatar" aria-hidden="true">${t[0].split(' ').map(w => w[0]).join('')}</span><div><strong>${t[0]}</strong><span>${t[1]}</span></div></figcaption>
      </figure>`).join('\n      ')}
    </div>
  </div>
</section>

${ctaBand(r)}

<!-- ===================== INSTAGRAM =====================
     CLIENT: replace assets/images/instagram/insta-1.jpg … insta-6.jpg with recent posts (or embed a feed widget). -->
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Instagram</span>
      <h2>@krishmetalcorp</h2>
      <p class="lead">See new tools, dispatches and shop-floor updates.</p>
    </div>
    <div class="insta-grid">
      ${['press-brake-machine', 'tool-stock', 'hero-tools', 'press-brake-machine', 'tool-stock', 'hero-tools'].map((f, i) => `<a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram post ${i + 1}"><img src="assets/images/instagram/insta-${i + 1}.jpg" data-fallback="assets/images/site/${f}.jpg" alt="" width="200" height="200" loading="lazy"></a>`).join('')}
    </div>
    <div class="text-center mt-2"><a class="btn btn--primary" href="${IG}" target="_blank" rel="noopener"><i class="fa-brands fa-instagram" aria-hidden="true"></i> Follow us on Instagram</a></div>
  </div>
</section>

<!-- ===================== MAP ===================== -->
<section class="section section--steel">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">Visit Us</span>
      <h2>Bhosari, Pune</h2>
      <p>${ADDR_HTML}</p>
      <ul class="footer-contact" style="color:var(--text)">
        <li style="justify-content:flex-start"><i class="fa-solid fa-phone" aria-hidden="true"></i><a style="color:var(--primary)" href="tel:${PHONE}">${PHONE_TXT}</a></li>
        <li style="justify-content:flex-start"><i class="fa-solid fa-envelope" aria-hidden="true"></i><a style="color:var(--primary)" href="mailto:${EMAIL}">${EMAIL}</a></li>
      </ul>
      <div class="btn-row">
        <a class="btn btn--primary" href="${GMB}" target="_blank" rel="noopener"><i class="fa-brands fa-google" aria-hidden="true"></i> View on Google</a>
        <a class="btn btn--outline" href="${GMB}" target="_blank" rel="noopener"><i class="fa-solid fa-star" aria-hidden="true"></i> Review us on Google</a>
      </div>
    </div>
    <div class="map-wrap reveal reveal-delay-1"><iframe src="${MAP}" title="Map – Krish Metal Corporation, Bhosari, Pune" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
  </div>
  <div class="container"><p class="img-credit">Banner photos via Wikimedia Commons: <a href="https://commons.wikimedia.org/wiki/File:Mes_en_groef_van_een_kantbank.jpg" target="_blank" rel="noopener">punch and V-die</a> by Contour (CC0), <a href="https://commons.wikimedia.org/wiki/File:High-tonnage_press_brake.jpg" target="_blank" rel="noopener">press brake</a> by Gasparini Industries (CC BY-SA 4.0), <a href="https://commons.wikimedia.org/wiki/File:Kucie.jpg" target="_blank" rel="noopener">hot forging</a> by Andrzej Otrębski (CC BY-SA 3.0, mirrored and cropped), <a href="https://commons.wikimedia.org/wiki/File:Sparks_fly_at_metal_tech_150623-F-CB366-093.jpg" target="_blank" rel="noopener">CNC machining</a> by Senior Airman David Owsianka, U.S. Air Force (public domain).</p></div>
</section>`;
  page({ file: 'index.html', nav: 'home', title: 'Press Brake Tools Manufacturer in Pune | Krish Metal Corporation', desc: 'Krish Metal Corporation, Bhosari, Pune – manufacturer of KMC / EURO style press brake punches, dies, gooseneck, radius, hemming, multi-V and 2V self-centering tools. Induction hardened, fast delivery.',
    preload: '<link rel="preload" as="image" href="assets/images/site/hero-1.webp" type="image/webp">\n' }, body);
}

/* ================================ ABOUT ================================ */
function about() {
  const r = '';
  const body = `${banner('About Krish Metal Corporation', 'Press brake tool manufacturer and service provider in Bhosari, Pune – since 2016.', [['Home', 'index.html'], ['About Us']], r)}

<section class="section">
  <div class="container split">
    <div class="about-media reveal">
      ${picture(r, 'press-brake-machine', 'Press brake machine with sectioned punches', 710, 534, 'loading="lazy"')}
      <div class="exp-badge"><strong>2016</strong><span class="exp-badge__label">Established</span></div>
    </div>
    <div class="reveal reveal-delay-1">
      <span class="eyebrow">Our Story</span>
      <h2>From a Pune workshop to tooling for machines across India</h2>
      <p>Krish Metal Corporation was established in 2016 in the Landge Industrial Estate, Bhosari – at the heart of Pune’s automotive and engineering belt. We manufacture and service a focused range of products: <strong>Press Brake Tools, Forming Tool Dies, Shearing Machine Knives and Machine Guide-ways</strong>, and we run a <strong>Shearing Blade Resharpening Service</strong>.</p>
      <p>Our customers range from small job shops with a single press brake to OEMs running several lines. What they share is a need for tools that bend accurately, last long and arrive quickly – and that is exactly what we build our business around.</p>
      <div class="btn-row"><a class="btn btn--primary" href="products.html">View Products</a><a class="btn btn--outline" href="${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Catalogue</a></div>
    </div>
  </div>
</section>

<section class="section section--steel">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Press Brake Bending</span>
      <h2>What our tools do</h2>
      <p class="lead">Press brake bending is the most widely used way to form sheet metal cold. A hydraulic or electric press drives the beam and upper punch into a lower die, applying exactly the force needed to deform the sheet to the required angle and shape.</p>
    </div>
    <div class="grid-3">
      <div class="feature reveal"><div class="feature__icon"><i class="fa-solid fa-wind" aria-hidden="true"></i></div><h3>Air Bending</h3><p>The punch pushes the sheet into the V without bottoming. Flexible and low-tonnage – one die opening covers many angles.</p></div>
      <div class="feature reveal reveal-delay-1"><div class="feature__icon"><i class="fa-solid fa-down-left-and-up-right-to-center" aria-hidden="true"></i></div><h3>Bottom Bending</h3><p>The sheet is pressed against the die flanks for a more repeatable angle, using matched punch and die angles.</p></div>
      <div class="feature reveal reveal-delay-2"><div class="feature__icon"><i class="fa-solid fa-stamp" aria-hidden="true"></i></div><h3>Coining / Stamping</h3><p>High force imprints the punch tip into the material for the tightest angles and radii.</p></div>
    </div>
    <p class="text-center mt-2 reveal">Because the result depends on the geometry of the bend and of the tools, we supply the right profile for each process – and our standard clamping fits most press brakes used worldwide. Where a standard geometry will not do, we manufacture <a href="products/special-application.html">custom tooling</a>.</p>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">Stock &amp; Deliveries</span>
      <h2>24h, 48h and 72h delivery</h2>
      <p>We keep the most common positions in stock, so many orders can be dispatched within 24, 48 or 72 hours. For every project we first look for a standard tool that can do the job – it is usually the fastest and most cost-effective route – before proposing special tooling.</p>
      <ul class="check-list"><li>Stocked standard punches and dies</li><li>Solid 835 / 415 mm and sectioned 805 mm sets</li><li>Packed in wooden boxes for safe transport</li></ul>
    </div>
    <div class="reveal reveal-delay-1">${picture(r, 'tool-stock', 'Stocked press brake punches', 710, 534, 'loading="lazy" style="border-radius:8px;box-shadow:var(--shadow-lg)"')}</div>
  </div>
</section>

<section class="section section--steel" id="quality">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">Quality</span>
      <h2>Induction hardening &amp; material grades</h2>
      <p>Every tool passes through induction hardening so the areas that touch the part during bending get maximum protection. Declared hardness is <strong>55–60 HRC</strong> with a hardened depth of <strong>3–4 mm</strong>.</p>
      <p>Our standard tools are produced in three materials, identified by a colour box in the catalogue and on this website:</p>
    </div>
    <div class="reveal reveal-delay-1">
      <div class="table-wrap table-wrap--plain" tabindex="0" role="region" aria-label="Material grades">
        <table class="mat-table" style="min-width:420px">
          <thead><tr><th scope="col">Grade</th><th scope="col">Material</th><th scope="col">Internal resistance</th></tr></thead>
          <tbody>
            ${Object.keys(KMC.materials).map((k) => { const m = KMC.materials[k]; return `<tr><td><span class="mat-badge mat-badge--${k}">${m.grade}</span></td><td>${m.steel}</td><td>${m.strength}</td></tr>`; }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">What Drives Us</span><h2>Mission, vision &amp; values</h2></div>
    <div class="grid-3">
      <div class="feature reveal"><div class="feature__icon"><i class="fa-solid fa-bullseye" aria-hidden="true"></i></div><h3>Mission</h3><p>Manufacture press brake tooling that holds its accuracy, stock what customers use most, and back every order with practical engineering advice.</p></div>
      <div class="feature reveal reveal-delay-1"><div class="feature__icon"><i class="fa-solid fa-eye" aria-hidden="true"></i></div><h3>Vision</h3><p>Be India’s first-choice press brake tooling partner – known for precision, fast delivery and custom solutions on par with imported tools.</p></div>
      <div class="feature reveal reveal-delay-2"><div class="feature__icon"><i class="fa-solid fa-handshake" aria-hidden="true"></i></div><h3>Values</h3><p>Measurable accuracy, honest advice, delivery we keep and long-term relationships with every customer.</p></div>
    </div>
  </div>
</section>

<!-- CLIENT: infra-1.jpg … infra-4.jpg are free sample photos from Wikimedia Commons – replace them with photos of your own machines and delete the .img-credit line. -->
<section class="section section--steel">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Infrastructure</span><h2>Our facility</h2><p class="lead">CNC machining, induction hardening, grinding and inspection under one roof in Bhosari, Pune.</p></div>
    <div class="grid-4">
      ${['CNC machining', 'Induction hardening', 'Precision grinding', 'Inspection & packing'].map((t, i) => `<figure class="card reveal" style="margin:0"><div class="card__media"><img src="assets/images/infrastructure/infra-${i + 1}.jpg" data-placeholder="${t}" alt="${t} at Krish Metal Corporation" width="400" height="300" loading="lazy"></div><figcaption class="card__body"><h3 style="font-size:1.15rem;margin:0">${t}</h3></figcaption></figure>`).join('\n      ')}
    </div>
    <p class="img-credit">Sample photos via Wikimedia Commons: <a href="https://commons.wikimedia.org/wiki/File:DeckelMaho-DMU50e-MachiningCenter.jpg" target="_blank" rel="noopener">CNC machining</a> by Graibeard (CC BY-SA 2.0), <a href="https://commons.wikimedia.org/wiki/File:Using_induction_heating_to_observe_the_behavior_of_metals_in_high_magnetic_fields_(10349574823).jpg" target="_blank" rel="noopener">induction heating</a> by Oak Ridge National Laboratory (CC BY 2.0), <a href="https://commons.wikimedia.org/wiki/File:SurfaceGrinder-Proth-insetMagChuck.jpg" target="_blank" rel="noopener">surface grinder</a> by Graibeard (CC BY-SA 2.5), <a href="https://commons.wikimedia.org/wiki/File:Coordinate_Measuring_Machines_(5885465714).jpg" target="_blank" rel="noopener">CMM inspection</a> by NIST (public domain).</p>
  </div>
</section>

${ctaBand(r)}`;
  page({ file: 'about.html', nav: 'about', title: 'About Us – Press Brake Tool Manufacturer in Bhosari, Pune | Krish Metal Corporation', desc: 'Established in 2016, Krish Metal Corporation manufactures press brake tools, forming dies, shearing knives and guide-ways in Bhosari, Pune. Induction hardened 55–60 HRC, 24/48/72h delivery.',
    crumbs: [['Home', 'index.html'], ['About Us']] }, body);
}

/* ============================ PRODUCTS OVERVIEW ============================ */
function productsOverview() {
  const r = '';
  const body = `${banner('Our Products', 'KMC / EURO style press brake punches, dies, holders and custom tooling – every item Price on Request.', [['Home', 'index.html'], ['Products']], r)}

<section class="section">
  <div class="container">
    ${GROUPS.map((g) => `<div class="section-head section-head--left reveal"><span class="eyebrow">${g.title}</span></div>
    <div class="grid-4" style="margin-bottom:48px">${g.keys.map((k, i) => card(cat(k), r, i % 4 || '')).join('')}</div>`).join('\n    ')}
  </div>
</section>

<section class="section section--steel" id="tool-finder">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Tool Finder</span>
      <h2>Search all catalogue articles</h2>
      <p class="lead">Filter by angle, height or article code (e.g. “KGP-001”, “8808”, “gooseneck”, “V16”).</p>
    </div>
    <div class="finder" id="finder">
      <form class="finder__form" onsubmit="return false" role="search">
        <div class="field"><label for="finder-q">Search</label><input id="finder-q" type="search" placeholder="Code, article, type…" autocomplete="off"></div>
        <div class="field"><label for="finder-cat">Category</label><select id="finder-cat"><option value="">All categories</option></select></div>
        <div class="field"><label for="finder-angle">Angle</label><select id="finder-angle"><option value="">Any angle</option></select></div>
        <div class="field"><label for="finder-h">Height H</label><select id="finder-h"><option value="">Any height</option><option value="lt80">Below 80 mm</option><option value="80-120">80 – 120 mm</option><option value="gt120">Above 120 mm</option></select></div>
      </form>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><p class="finder__count" id="finder-count" aria-live="polite"></p><button type="button" class="btn btn--outline btn--sm" id="finder-reset">Reset filters</button></div>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Search results">
        <table style="min-width:760px">
          <thead><tr><th scope="col">Code</th><th scope="col">Art. N</th><th scope="col">Category</th><th scope="col" class="is-angle">Angle</th><th scope="col">H (mm)</th><th scope="col">V (mm)</th><th scope="col">Material</th><th scope="col">Price</th></tr></thead>
          <tbody id="finder-results"><tr><td colspan="8">Loading…</td></tr></tbody>
        </table>
      </div>
      <p class="scroll-hint"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> All prices on request – click “Get Quote” and we will reply quickly.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Material Grades</span><h2>Colour-coded for quick selection</h2></div>
    <div class="grid-3">
      ${Object.keys(KMC.materials).map((k, i) => { const m = KMC.materials[k]; return `<div class="feature reveal${i ? ' reveal-delay-' + i : ''}"><span class="mat-badge mat-badge--${k}">${m.grade}</span><h3 style="margin-top:10px">${m.steel}</h3><p>Internal resistance ${m.strength}. Induction hardened working areas 55–60 HRC.</p></div>`; }).join('')}
    </div>
    <div class="text-center mt-2"><a class="btn btn--primary" href="${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Full Catalogue (PDF)</a></div>
  </div>
</section>

${ctaBand(r)}`;
  page({ file: 'products.html', nav: 'products', title: 'Press Brake Punches, Dies & Holders – All Products | Krish Metal Corporation', desc: 'Browse KMC / EURO style press brake punches, gooseneck punches, radius and hemming tools, T-dies, multi-V and 2V dies, holders and clamps. Search 100+ catalogue articles. Price on request.',
    crumbs: [['Home', 'index.html'], ['Products']] }, body);
}

/* ============================ PRODUCT PAGES ============================ */
function productPage(c) {
  const r = '../';
  const list = KMC.seriesFor(c.key);
  const mats = [...new Set(list.map((s) => s.mat))];
  const matText = mats.length ? mats.map((m) => KMC.materials[m].steel + ' (' + KMC.materials[m].grade.toLowerCase() + ')').join(', ') : 'As per application / customer drawing';
  const usage = c.short;
  const msg = `Hello Krish Metal Corporation, I am interested in ${c.title}. Please share details and price.`;
  const related = KMC.categories.filter((x) => x.key !== c.key);
  const idx = KMC.categories.indexOf(c);
  const rel = related.slice(idx % related.length).concat(related.slice(0, idx % related.length)).slice(0, 8);
  const img = `${r}assets/images/products/${c.slug}.svg`;
  const thumbs = [
    [img, c.title + ' – profile drawing', img],
    [`${r}assets/images/products/${c.slug}-1.jpg`, c.title + ' – product photo', img],
    [`${r}assets/images/site/tool-stock.jpg`, 'Press brake tools in stock', null],
    [`${r}assets/images/site/press-brake-machine.jpg`, 'Tools mounted on a press brake', null]
  ];
  const tech = c.noData ? '' : `
<section class="section section--steel" id="technical-data">
  <div class="container">
    <div class="section-head section-head--left reveal">
      <span class="eyebrow">Technical Data</span>
      <h2>${esc(c.title)} – catalogue specifications</h2>
      <p class="lead">All dimensions in mm. Max t/m = maximum load per metre. Weights are approximate for 835 mm / 805 mm sectioned | 415 mm pieces. Unless stated, every tool is available as 835 mm solid, 415 mm solid and 805 mm sectioned.</p>
    </div>
    <nav class="toc" data-series-toc aria-label="Jump to profile"></nav>
    <div class="series-list" data-series="${c.key}"><p>Loading technical tables…</p></div>
    ${c.key === 'hemming' ? `<div class="mt-2"><h3>Considered tonnage for hemming</h3><p class="muted">S = sheet thickness, H = pre-bend height, 2 × S = closed hem. Tonnage in t per metre.</p><div data-hemming-table></div></div>` : ''}
    <noscript><p>Please enable JavaScript to view the technical tables, or <a href="${r}${CAT_PDF}">download the PDF catalogue</a>.</p></noscript>
  </div>
</section>`;
  const svc = c.noData ? `
<section class="section section--steel">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">How it works</span><h2>From drawing to delivered tool</h2></div>
    <div class="grid-4">
      ${[['fa-file-pen', 'Share your drawing', 'Send a part drawing, sample photo or old blade dimensions on WhatsApp or email.'], ['fa-compass-drafting', 'Engineering review', 'We check machine, material and tonnage and propose the geometry.'], ['fa-gears', 'Manufacture', 'CNC machining, hardening and precision grinding in our Pune facility.'], ['fa-truck-fast', 'Dispatch', 'Packed in wooden boxes and dispatched across India.']].map((s, i) => `<div class="feature reveal${i ? ' reveal-delay-' + i : ''}"><div class="feature__icon"><i class="fa-solid ${s[0]}" aria-hidden="true"></i></div><h3>${i + 1}. ${s[1]}</h3><p>${s[2]}</p></div>`).join('')}
    </div>
  </div>
</section>` : '';
  const body = `${banner(esc(c.title), esc(c.short), [['Home', 'index.html'], ['Products', 'products.html'], [c.title]], r)}

<section class="section">
  <div class="container product-top">
    <div class="pgallery reveal">
      <!-- CLIENT: replace product photos – assets/images/products/${c.slug}-1.jpg (and the SVG drawing if desired) -->
      <button type="button" class="pgallery__main" aria-label="Enlarge image">
        <img src="${img}" alt="${esc(c.title)} – profile drawing" width="600" height="450">
        <span class="pgallery__zoom" aria-hidden="true"><i class="fa-solid fa-magnifying-glass-plus"></i></span>
      </button>
      <div class="pgallery__thumbs">
        ${thumbs.map((t, i) => `<button type="button" class="pgallery__thumb" aria-label="Show image ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="${t[0]}"${t[2] ? ` data-fallback="${t[2]}"` : ''} alt="${esc(t[1])}" width="120" height="120" loading="lazy"></button>`).join('')}
      </div>
    </div>
    <div class="product-info reveal reveal-delay-1">
      <span class="eyebrow">KMC / EURO Style</span>
      <h2>${esc(c.title)}</h2>
      <div class="mat-badges">${mats.map((m) => `<span class="mat-badge mat-badge--${m}">${KMC.materials[m].grade} · ${KMC.materials[m].steel}</span>`).join('')}${c.noData ? '<span class="mat-badge mat-badge--note">Made to order</span>' : '<span class="mat-badge mat-badge--note">55–60 HRC</span>'}</div>
      <p>${esc(c.intro)}</p>
      <div class="price-box"><strong>Price on Request</strong><span>Quoted per length / set – tell us your machine and quantity.</span></div>
      <div class="btn-row">
        <a class="btn btn--wa" href="${wa(msg)}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp Now</a>
        <a class="btn btn--primary" href="${r}contact.html?product=${encodeURIComponent(c.title)}#enquiry"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Enquire Now</a>
        <a class="btn btn--outline" href="${r}${CAT_PDF}" download><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Download Catalogue</a>
      </div>
      ${c.noData ? '' : `<p class="mt-2 mb-0"><a class="link-arrow" href="#technical-data">View ${list.length} profile${list.length > 1 ? 's' : ''} with full specifications <i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a></p>`}
    </div>
  </div>
</section>

<section class="section ${c.noData ? '' : 'mt-0'}" style="padding-top:0">
  <div class="container info-blocks">
    <div class="info-block reveal"><h3><i class="fa-solid fa-list" aria-hidden="true"></i> Types</h3><ul class="check-list">${c.types.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <div class="info-block reveal reveal-delay-1"><h3><i class="fa-solid fa-star" aria-hidden="true"></i> Features</h3><ul class="check-list">${c.features.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <div class="info-block reveal"><h3><i class="fa-solid fa-award" aria-hidden="true"></i> Why Choose Krish Metal</h3><ul class="check-list">${KMC.whyUs.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
    <div class="info-block reveal reveal-delay-1">
      <h3><i class="fa-solid fa-clipboard-list" aria-hidden="true"></i> Specifications</h3>
      <div class="table-wrap table-wrap--kv"><table>
        <tbody>
          <tr><th scope="row">Material</th><td>${esc(matText)}</td></tr>
          <tr><th scope="row">Usage</th><td>${esc(usage)}</td></tr>
          <tr><th scope="row">Hardness</th><td>${c.noData ? 'As per application' : 'Induction hardened 55–60 HRC, depth 3–4 mm'}</td></tr>
          <tr><th scope="row">Finish</th><td>Black / ENP (electroless nickel) on request</td></tr>
          <tr><th scope="row">Packaging</th><td>Wooden box</td></tr>
          <tr><th scope="row">Brand</th><td>Krish Metal Corporation</td></tr>
          <tr><th scope="row">Country of Origin</th><td>Made in India</td></tr>
          <tr><th scope="row">Price</th><td><strong>Price on Request</strong></td></tr>
        </tbody>
      </table></div>
    </div>
  </div>
  <div class="container mt-2">
    <h3 class="reveal">Applications</h3>
    <div class="table-wrap reveal" tabindex="0" role="region" aria-label="Applications">
      <table style="min-width:560px">
        <thead><tr><th scope="col">Industry</th><th scope="col">Typical parts</th></tr></thead>
        <tbody>
          <tr><td>Automotive</td><td style="white-space:normal;text-align:left">Brackets, cross members, seat frames, bus &amp; truck body panels</td></tr>
          <tr><td>Aerospace</td><td style="white-space:normal;text-align:left">Aluminium and stainless brackets, ribs, ground-support equipment</td></tr>
          <tr><td>Construction / HVAC</td><td style="white-space:normal;text-align:left">Ducting, cable trays, cladding, door frames, purlins</td></tr>
          <tr><td>General Manufacturing</td><td style="white-space:normal;text-align:left">Electrical enclosures, control panels, furniture, kitchen &amp; agri equipment</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
${tech}${svc}

<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Related Products</span><h2>You may also need</h2></div>
    <div class="carousel">
      <div class="carousel__track">
        ${rel.map((x) => card(x, r)).join('\n        ')}
      </div>
      <div class="carousel__nav"><button type="button" class="carousel__btn carousel__btn--prev" aria-label="Previous products"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><button type="button" class="carousel__btn carousel__btn--next" aria-label="Next products"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button></div>
    </div>
  </div>
</section>

${ctaBand(r, c.noData ? 'Send us your drawing or sample' : 'Request a quote for ' + esc(c.title), 'Share your machine model, part drawing and quantity – we will recommend the right tool and reply quickly.')}`;
  page({ file: 'products/' + c.slug + '.html', root: r, nav: 'products', cat: c.key,
    title: c.seo + ' | Krish Metal Corporation',
    desc: `${c.title} by Krish Metal Corporation, Bhosari, Pune. ${c.short} KMC / EURO style, induction hardened 55–60 HRC. Price on request.`,
    crumbs: [['Home', 'index.html'], ['Products', 'products.html'], [c.title]] }, body);
}

/* ================================ SERVICES ================================ */
function services() {
  const r = '';
  const S = [
    ['fa-compass-drafting', 'Custom Press Brake Tooling to Drawing', 'Special punches and dies designed from your part drawing – joggles, offsets, special radii, louvers and profiles for non-standard clamping. We propose the geometry, you approve, we manufacture.', 'products/special-application.html'],
    ['fa-rotate', 'Shearing Blade Resharpening', 'Worn shear blades reground to a clean, square cutting edge with controlled stock removal, restoring cut quality and reducing burr at a fraction of the cost of new blades.', 'products/shear-blades.html'],
    ['fa-scissors', 'Shearing Machine Knives & Machine Guide-ways', 'New shearing knives for guillotine and swing-beam shears, plus machine guide-ways – manufactured to your machine’s drawing or sample.', 'products/shear-blades.html'],
    ['fa-cube', 'Bending Sequence Visualisation', 'Unsure if a part can be bent without collisions? On request we simulate the bending sequence with your machine, tooling and part to check for clashes before you buy.', null],
    ['fa-sliders', 'Detailed Technological Configuration', 'A full bending plan for your specific machine – every step including backgauge positioning. This engineering service is provided for an additional charge.', null],
    ['fa-list-check', 'Tool List from Part Drawing', 'Send your part drawing and we will prepare the complete list of punches, dies and holders needed to make it.', null],
    ['fa-file-code', 'DXF Tool Geometry for CNC Libraries', 'For every tool sold we supply its actual 2D geometry in DXF format for import into your CNC controller’s tool library – free of charge.', null]
  ];
  const body = `${banner('Our Services', 'Engineering support and after-sales services that keep your press brakes and shears productive.', [['Home', 'index.html'], ['Services']], r)}
<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">What We Do</span><h2>More than tooling</h2><p class="lead">From the first drawing to blade resharpening years later, we support the full life of your bending and cutting tools.</p></div>
    <div class="grid-3">
      ${S.map((s, i) => `<article class="feature service-card reveal${i % 3 ? ' reveal-delay-' + (i % 3) : ''}" id="service-${i + 1}">
        <div><span class="service-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div class="feature__icon"><i class="fa-solid ${s[0]}" aria-hidden="true"></i></div></div>
        <h3>${s[1]}</h3><p>${s[2]}</p>
        <div class="btn-row">${s[3] ? `<a class="btn btn--outline btn--sm" href="${s[3]}">Learn more</a>` : ''}<a class="btn btn--wa btn--sm" href="${wa('Hello Krish Metal Corporation, I would like to know more about: ' + s[1])}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Ask on WhatsApp</a></div>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section--steel">
  <div class="container split">
    <div class="reveal">
      <span class="eyebrow">How We Work</span>
      <h2>Simple, fast, transparent</h2>
      <ol class="check-list" style="counter-reset:none">
        <li><strong>Share</strong> – machine model, part drawing or sample, material and quantity.</li>
        <li><strong>Review</strong> – our engineers check tonnage, V-opening and clearances.</li>
        <li><strong>Quote</strong> – a clear quotation with delivery time (prices on request).</li>
        <li><strong>Deliver</strong> – stock items in 24/48/72h, special tools as committed, with DXF files.</li>
      </ol>
      <a class="btn btn--primary" href="contact.html#enquiry">Start an Enquiry</a>
    </div>
    <div class="reveal reveal-delay-1">${picture(r, 'press-brake-machine', 'Press brake set up with Krish Metal tooling', 710, 534, 'loading="lazy" style="border-radius:8px;box-shadow:var(--shadow-lg)"')}</div>
  </div>
</section>
${ctaBand(r)}`;
  page({ file: 'services.html', nav: 'services', title: 'Custom Press Brake Tooling & Shear Blade Resharpening in Pune | Krish Metal Corporation', desc: 'Custom press brake tooling to drawing, shearing blade resharpening, shearing knives, bending sequence visualisation, tool lists and free DXF geometry – Krish Metal Corporation, Pune.',
    crumbs: [['Home', 'index.html'], ['Services']] }, body);
}

/* ================================ TECHNICAL ================================ */
function technical() {
  const r = '';
  const clampSVG = `<svg viewBox="0 0 320 300" role="img" aria-labelledby="clamp-t"><title id="clamp-t">KMC tool system clamping dimensions</title>
  <defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#0A47C2"/></marker></defs>
  <path d="M120 40h70v120h-20l0 10h20v120H100V170h0v-14h10v-36h-10V60z" fill="#E9EDF2" stroke="#0F1724" stroke-width="2.5"/>
  <line x1="170" y1="20" x2="170" y2="290" stroke="#5B6676" stroke-dasharray="10 4 2 4"/>
  <g stroke="#0A47C2" stroke-width="1.5" fill="none">
    <line x1="100" y1="30" x2="170" y2="30" marker-start="url(#ar)" marker-end="url(#ar)"/><line x1="170" y1="18" x2="190" y2="18" marker-start="url(#ar)" marker-end="url(#ar)"/>
    <line x1="230" y1="40" x2="230" y2="160" marker-start="url(#ar)" marker-end="url(#ar)"/><line x1="190" y1="40" x2="236" y2="40"/><line x1="190" y1="160" x2="236" y2="160"/>
    <line x1="60" y1="120" x2="60" y2="156" marker-start="url(#ar)" marker-end="url(#ar)"/><line x1="56" y1="120" x2="100" y2="120"/><line x1="56" y1="156" x2="100" y2="156"/>
    <line x1="70" y1="100" x2="100" y2="100" marker-end="url(#ar)"/><line x1="140" y1="100" x2="110" y2="100" marker-end="url(#ar)"/>
  </g>
  <g font-family="Arial" font-size="14" fill="#0F1724" font-weight="bold">
    <text x="128" y="24">13</text><text x="173" y="13">7</text><text x="238" y="105">30</text><text x="28" y="143">8.4</text><text x="120" y="96">3</text>
  </g></svg>`;
  const lens = (pieces, horns) => { const total = pieces.reduce((a, b) => a + b, 0); let x = 0; return `<svg viewBox="0 0 ${total + 20} 60" role="img" aria-label="Sectioned set ${pieces.join(' + ')} mm"><g transform="translate(10,10)">${pieces.map((p, i) => { const rect = `<rect x="${x + 1}" y="0" width="${p - 2}" height="32" fill="${(horns && (i === 0 || i === pieces.length - 1)) ? '#F5A623' : '#DCE2EA'}" stroke="#0A47C2" stroke-width="1.5"/>`; const t = p >= 40 ? `<text x="${x + p / 2}" y="48" text-anchor="middle" font-size="12" font-family="Arial" fill="#1F2937">${p}</text>` : ''; x += p; return rect + t; }).join('')}</g></svg>`; };
  const body = `${banner('Technical Information', 'Bending force calculator, tonnage tables, clamping dimensions and standard lengths from the KMC catalogue.', [['Home', 'index.html'], ['Technical Info']], r)}

<section class="section" id="calculator">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Bending Force Calculator</span><h2>Choose the right V-die and tonnage</h2><p class="lead">Enter your sheet thickness, material, bend angle and length. Results use the rules and mild-steel tonnage table from our catalogue.</p></div>
    <div class="calc">
      <form class="calc__panel form" id="calc-form" novalidate>
        <div class="form-grid">
          <div class="field"><label for="c-s">Sheet thickness S (mm)</label><input id="c-s" type="number" min="0.3" max="25" step="0.1" value="2" inputmode="decimal" required></div>
          <div class="field"><label for="c-mat">Material (tensile strength)</label>
            <select id="c-mat"><option value="45">Mild steel – 45 kg/mm²</option><option value="80">Stainless steel – 80 kg/mm²</option><option value="45">Aluminium – 45 kg/mm²</option></select></div>
          <div class="field"><label for="c-angle">Bend angle α</label>
            <select id="c-angle"><option>30</option><option>45</option><option>60</option><option selected>90</option><option>120</option><option>135</option><option>165</option></select></div>
          <div class="field"><label for="c-len">Bend length (mm)</label><input id="c-len" type="number" min="1" step="1" value="1000" inputmode="numeric" required></div>
          <div class="field span-2"><label for="c-r">Inside radius R for radius bending (mm, optional)</label><input id="c-r" type="number" min="0" step="0.5" value="0" inputmode="decimal"><span class="field__hint">Leave 0 for normal air bending. For radius bending V = 2R + 2S.</span></div>
        </div>
        <p class="field__error" id="calc-error" role="alert"></p>
        <button class="btn btn--primary" type="submit"><i class="fa-solid fa-calculator" aria-hidden="true"></i> Calculate</button>
      </form>
      <div class="calc__panel" aria-live="polite">
        <div class="calc__results">
          <div class="result"><span>Calculated V</span><strong id="r-v">–</strong></div>
          <div class="result"><span>Nearest standard die</span><strong id="r-vstd">–</strong></div>
          <div class="result"><span>Inside radius Ri</span><strong id="r-ri">–</strong></div>
          <div class="result"><span>Min. flange h</span><strong id="r-h">–</strong></div>
          <div class="result"><span>Force per metre</span><strong id="r-tpm">–</strong></div>
          <div class="result result--big"><span>Approx. total bending force</span><strong id="r-total">–</strong></div>
        </div>
        <p class="calc__note" id="r-src"></p>
        <p class="calc__note"><strong>Disclaimer:</strong> Values are for reference only and may differ from real values. Always check the rated capacity (max t/m) of your tools and press brake.</p>
        <a class="btn btn--wa" id="r-wa" href="${WA_DEFAULT}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Ask for matching tools</a>
      </div>
    </div>
  </div>
</section>

<section class="section section--steel">
  <div class="container">
    <div class="section-head section-head--left reveal"><span class="eyebrow">Formulas</span><h2>Bending parameters</h2></div>
    <div class="grid-2">
      <div class="info-block reveal">
        <h3>Die opening V</h3>
        <div class="table-wrap" tabindex="0" role="region" aria-label="Die opening rules"><table><thead><tr><th>S (mm)</th><th>≤ 0.7</th><th>0.8 – 3.0</th><th>3.1 – 9.0</th><th>9.1 – 14.0</th><th>&gt; 14</th><th>Radius bending</th></tr></thead>
        <tbody><tr><th scope="row">V</th><td>S × 6</td><td>S × 8</td><td>S × 10</td><td>S × 12</td><td>S × 14</td><td>R × 2 + S × 2</td></tr></tbody></table></div>
        <p class="mt-2 mb-0"><strong>Inside radius:</strong> Ri = (5 × V) / 32</p>
      </div>
      <div class="info-block reveal reveal-delay-1">
        <h3>Minimum flange h</h3>
        <div class="table-wrap" tabindex="0" role="region" aria-label="Minimum flange factors"><table><thead><tr><th>α</th><th>30°</th><th>45°</th><th>60°</th><th>90°</th><th>120°</th><th>135°</th><th>165°</th></tr></thead>
        <tbody><tr><th scope="row">h</th><td>V × 1.94</td><td>V × 1.31</td><td>V × 1</td><td>V × 0.71</td><td>V × 0.58</td><td>V × 0.55</td><td>V × 0.51</td></tr></tbody></table></div>
        <p class="mt-2 mb-0"><strong>Tensile strength (TS):</strong> mild steel 45 kg/mm² · stainless steel 80 kg/mm² · aluminium 45 kg/mm²</p>
      </div>
    </div>
  </div>
</section>

<section class="section" id="tonnage">
  <div class="container">
    <div class="section-head section-head--left reveal"><span class="eyebrow">Tonnage Table</span><h2>Mild steel – tonnes per 1 m of bend</h2><p class="lead">Columns = sheet thickness S (mm). Highlighted cells show the recommended V for each thickness; the cell matching your calculator input is outlined.</p></div>
    <div data-tonnage-table></div>
    <p class="disclaimer" style="text-align:left">All presented information is for information purposes only and based on theory; real values may differ.</p>
  </div>
</section>

<section class="section section--steel" id="hemming">
  <div class="container">
    <div class="section-head section-head--left reveal"><span class="eyebrow">Hemming</span><h2>Considered tonnage for hemming</h2><p class="lead">S = sheet thickness, H = open-hem height, 2 × S = flattened hem. Tonnage per metre for mild steel and INOX (stainless). <a href="products/hemming-tools.html">See hemming dies</a>.</p></div>
    <div data-hemming-table></div>
  </div>
</section>

<section class="section" id="clamping">
  <div class="container split">
    <div class="diagram reveal">${clampSVG}</div>
    <div class="reveal reveal-delay-1">
      <span class="eyebrow">KMC Tool System</span>
      <h2>Clamping dimensions</h2>
      <p>The standard KMC / EURO tang: <strong>13 mm</strong> clamping width plus <strong>7 mm</strong> to the tool axis, <strong>30 mm</strong> tang height, <strong>3 mm</strong> safety groove depth and <strong>8.4 mm</strong> groove height.</p>
      <p>This catalogue covers the standard KMC clamping configuration. If your machine uses a modified clamping, please <a href="contact.html#enquiry">contact us to verify</a> before ordering.</p>
      <ul class="check-list"><li>Induction hardened 55–60 HRC, depth 3–4 mm</li><li>Free 2D DXF geometry for your CNC tool library</li></ul>
    </div>
  </div>
</section>

<section class="section section--steel" id="lengths">
  <div class="container">
    <div class="section-head section-head--left reveal"><span class="eyebrow">Standard Lengths</span><h2>Solid and sectioned tools</h2></div>
    <div class="grid-2">
      <div class="info-block reveal">
        <h3>Punches</h3>
        <ul class="check-list"><li>Solid piece L = 415 mm</li><li>Solid piece L = 835 mm</li><li>Sectioned set, total L = 805 mm: Horn L 100 + 10 + 15 + 20 + 40 + 50 + 200 + 270 + Horn R 100 mm</li><li>Horn detail: 100 mm long, R25 relief, 20 mm, 6 mm foot</li></ul>
        <div class="diagram">${lens([100, 10, 15, 20, 40, 50, 200, 270, 100], true)}</div>
        <p class="scroll-hint">Orange = left / right horns</p>
      </div>
      <div class="info-block reveal reveal-delay-1">
        <h3>Dies</h3>
        <ul class="check-list"><li>Solid piece L = 415 mm</li><li>Solid piece L = 835 mm</li><li>Sectioned set, total L = 805 mm: 100 + 10 + 15 + 20 + 40 + 50 + 200 + 370 mm</li></ul>
        <div class="diagram">${lens([100, 10, 15, 20, 40, 50, 200, 370], false)}</div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Material Grades</span><h2>Economy · Production · Professional</h2></div>
    <div class="table-wrap reveal" tabindex="0" role="region" aria-label="Material grades" style="max-width:760px;margin-inline:auto">
      <table class="mat-table"><thead><tr><th>Grade</th><th>Material</th><th>Internal resistance</th></tr></thead>
      <tbody>${Object.keys(KMC.materials).map((k) => { const m = KMC.materials[k]; return `<tr><td><span class="mat-badge mat-badge--${k}">${m.grade}</span></td><td>${m.steel}</td><td>${m.strength}</td></tr>`; }).join('')}</tbody></table>
    </div>
  </div>
</section>

<section class="section section--dark" id="brands">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Compatibility</span><h2>Press brake brands using KMC tool system</h2><p class="lead">Including the following trademarks, but not limited to:</p></div>
    <div class="brands" data-brands></div>
    <p class="disclaimer">KMC is not affiliated or connected with the mentioned trademarks and manufacturers; they are listed for information purposes only.</p>
  </div>
</section>
${ctaBand(r, 'Not sure which tool you need?', 'Send us your part drawing – we will prepare the tool list and check the tonnage for you.')}`;
  page({ file: 'technical.html', nav: 'technical', title: 'Press Brake Bending Force Calculator & Tonnage Chart | Krish Metal Corporation', desc: 'Free press brake bending force calculator: die opening V, inside radius, minimum flange and tonnage. Mild steel and hemming tonnage tables, KMC clamping dimensions and standard tool lengths.',
    crumbs: [['Home', 'index.html'], ['Technical Info']] }, body);
}

/* ================================ GALLERY ================================ */
function gallery() {
  const r = '';
  const P = (k) => `assets/images/products/${cat(k).slug}.svg`;
  const items = [
    ['workshop', 'Press brake fitted with sectioned punches', 'assets/images/site/press-brake-machine.jpg'],
    ['punches', 'Standard 88° punch', P('punches')], ['punches', 'Gooseneck punch', P('gooseneck')], ['dies', 'T-die', P('tdies')],
    ['workshop', 'Punch stock ready for dispatch', 'assets/images/site/tool-stock.jpg'],
    ['dies', 'Multi-V die', P('multiv')], ['punches', 'Radius punch', P('radius')], ['holders', 'Die holder rail', P('holders')],
    ['workshop', 'KMC / EURO style tool profiles', 'assets/images/site/hero-tools.jpg'],
    ['dies', 'Single-V die', P('singlev')], ['dies', '2-V self-centering die', P('2v')], ['holders', 'Insert die holder', P('insert')],
    ['dies', 'Hemming die', P('hemming')], ['dies', 'PU insert die', P('nylon')], ['dies', 'Z-bend die set', P('zbend')], ['punches', 'Flattening set', P('flattening')]
  ];
  const body = `${banner('Gallery', 'Our tools, our machines and our work – a look inside Krish Metal Corporation.', [['Home', 'index.html'], ['Gallery']], r)}
<section class="section">
  <div class="container">
    <!-- CLIENT: replace placeholders with real photos: assets/images/gallery/gallery-01.jpg … gallery-16.jpg (01, 02 and 10 are currently Wikimedia Commons sample photos – update the .img-credit line when you replace them) -->
    <div class="filter-bar" role="group" aria-label="Filter gallery">
      <button type="button" class="filter-btn" data-filter="all" aria-pressed="true">All</button>
      <button type="button" class="filter-btn" data-filter="punches" aria-pressed="false">Punches</button>
      <button type="button" class="filter-btn" data-filter="dies" aria-pressed="false">Dies</button>
      <button type="button" class="filter-btn" data-filter="holders" aria-pressed="false">Holders</button>
      <button type="button" class="filter-btn" data-filter="workshop" aria-pressed="false">Workshop</button>
    </div>
    <div class="masonry">
      ${items.map((it, i) => `<div class="masonry__item" data-cat="${it[0]}" data-caption="${esc(it[1])}"><button type="button" class="masonry__btn" aria-label="Open image: ${esc(it[1])}"><img src="assets/images/gallery/gallery-${String(i + 1).padStart(2, '0')}.jpg" data-fallback="${it[2]}" alt="${esc(it[1])}" width="400" height="${it[0] === 'workshop' ? 300 : 400}" loading="lazy"><span class="masonry__cap">${esc(it[1])}</span></button></div>`).join('\n      ')}
    </div>
    <p class="img-credit">Some photos via Wikimedia Commons: <a href="https://commons.wikimedia.org/wiki/File:Bystronic_Bending.jpg" target="_blank" rel="noopener">sectioned punches</a> by Bystronic (CC BY-SA 2.5), <a href="https://commons.wikimedia.org/wiki/File:Mes_en_groef_van_een_kantbank.jpg" target="_blank" rel="noopener">punch and V-die</a> by Contour (CC0).</p>
  </div>
</section>
${ctaBand(r)}`;
  page({ file: 'gallery.html', nav: 'gallery', title: 'Gallery – Press Brake Tools & Workshop | Krish Metal Corporation', desc: 'Photo gallery of press brake punches, dies, holders and the Krish Metal Corporation workshop in Bhosari, Pune.', crumbs: [['Home', 'index.html'], ['Gallery']] }, body);
}

/* ================================ CLIENTS ================================ */
function clients() {
  const r = '';
  const ind = [['fa-car', 'Automotive & Auto Components'], ['fa-plane', 'Aerospace & Defence'], ['fa-fan', 'HVAC & Ducting'], ['fa-bolt', 'Electrical Panels & Enclosures'], ['fa-tractor', 'Agricultural Equipment'], ['fa-building', 'Construction & Infrastructure'], ['fa-couch', 'Office & Steel Furniture'], ['fa-train', 'Railways & Bus Body Building']];
  const body = `${banner('Our Clients', 'Fabricators, OEMs and job shops that rely on Krish Metal Corporation tooling.', [['Home', 'index.html'], ['Clients']], r)}
<section class="section">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Clientele</span><h2>Companies we work with</h2></div>
    <!-- CLIENT: replace assets/images/clients/client-1.png … client-12.png (transparent PNG/SVG, approx. 360×140 px) -->
    <div class="logo-grid">
      ${Array.from({ length: 12 }, (_, i) => `<div class="logo-tile reveal"><img src="assets/images/clients/client-${i + 1}.png" data-placeholder="Client logo ${i + 1}" alt="Client logo ${i + 1}" width="180" height="70" loading="lazy"></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section--steel">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Industries Served</span><h2>Where our tools work</h2></div>
    <div class="grid-4">${ind.map((x, i) => `<div class="feature industry reveal${i % 4 ? ' reveal-delay-' + (i % 4) : ''}"><i class="fa-solid ${x[0]}" aria-hidden="true"></i><h3 style="font-size:1.15rem;margin:0">${x[1]}</h3></div>`).join('')}</div>
  </div>
</section>
${ctaBand(r, 'Become our next satisfied customer', 'Tell us about your press brake and parts – we will recommend the right tooling.')}`;
  page({ file: 'clients.html', nav: 'clients', title: 'Our Clients & Industries Served | Krish Metal Corporation, Pune', desc: 'Krish Metal Corporation supplies press brake tooling to automotive, aerospace, HVAC, electrical, agricultural and general fabrication industries across India.', crumbs: [['Home', 'index.html'], ['Clients']] }, body);
}

/* ================================ CONTACT ================================ */
/* Enquiry form – shown on the contact page and in the "Get a Quote" popup on every other page */
function enquiryForm() {
  return `      <p class="muted">Fields marked <span class="req" style="color:var(--danger)">*</span> are required. Choose how you want to send it – WhatsApp or email.</p>
      <!-- To receive submissions directly (with file upload), connect Formspree or a PHP mailer – see comment in js/main.js (CONTACT / ENQUIRY FORM). -->
      <form class="form" id="enquiry-form" novalidate>
        <div class="form-grid">
          <div class="field"><label for="f-name">Name <span class="req">*</span></label><input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="e-name"><span class="field__error" id="e-name" aria-live="polite"></span></div>
          <div class="field"><label for="f-company">Company</label><input id="f-company" name="company" type="text" autocomplete="organization"></div>
          <div class="field"><label for="f-mobile">Mobile <span class="req">*</span></label><input id="f-mobile" name="mobile" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="e-mobile"><span class="field__error" id="e-mobile" aria-live="polite"></span></div>
          <div class="field"><label for="f-email">Email <span class="req">*</span></label><input id="f-email" name="email" type="email" autocomplete="email" required aria-describedby="e-email"><span class="field__error" id="e-email" aria-live="polite"></span></div>
          <div class="field"><label for="f-city">City</label><input id="f-city" name="city" type="text" autocomplete="address-level2"></div>
          <div class="field"><label for="f-product">Product</label><select id="f-product" name="product"><option value="">Select a product</option></select></div>
          <div class="field"><label for="f-code">Article code</label><input id="f-code" name="code" type="text" placeholder="e.g. KGP-001 / 8808"></div>
          <div class="field"><label for="f-qty">Quantity</label><input id="f-qty" name="quantity" type="text" placeholder="e.g. 2 sets of 835 mm" aria-describedby="e-qty"><span class="field__error" id="e-qty" aria-live="polite"></span></div>
          <div class="field span-2"><label for="f-msg">Message</label><textarea id="f-msg" name="message" placeholder="Machine model, material, thickness, bend angle…"></textarea></div>
          <div class="field span-2"><label for="f-file">Drawing (PDF, DWG, DXF, JPG, PNG)</label><input id="f-file" name="drawing" type="file" accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"><span class="field__hint">The file name is added to your message – please attach the file in WhatsApp / email when it opens.</span></div>
        </div>
        <div class="form-status" id="form-status" role="status" aria-live="polite"></div>
        <div class="btn-row">
          <button class="btn btn--wa" type="submit" value="whatsapp"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Send via WhatsApp</button>
          <button class="btn btn--primary" type="submit" value="email"><i class="fa-solid fa-envelope" aria-hidden="true"></i> Send via Email</button>
        </div>
      </form>`;
}

function contact() {
  const r = '';
  /* Quick-action rows: [modifier, icon, label, value, href, external] – whole row is the link */
  const actions = [
    ['call', 'fa-solid fa-phone', 'Call us', PHONE_TXT, `tel:${PHONE}`, false],
    ['wa', 'fa-brands fa-whatsapp', 'WhatsApp', PHONE_TXT, WA_DEFAULT, true],
    ['mail', 'fa-solid fa-envelope', 'Email', EMAIL, `mailto:${EMAIL}`, false]
  ];
  const socials = [
    ['ig', 'fa-brands fa-instagram', 'Instagram', '@krishmetalcorp', IG],
    ['gmb', 'fa-brands fa-google', 'Google', 'View &amp; review us', GMB]
  ];
  const contactPanel = `<div class="contact-cards">
        <div class="cc-address reveal">
          <span class="cc-address__icon"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span>
          <h3>Our Workshop</h3>
          <address>${ADDR_HTML}</address>
          <a class="btn btn--accent btn--sm" href="${GMB}" target="_blank" rel="noopener"><i class="fa-solid fa-diamond-turn-right" aria-hidden="true"></i> Get Directions</a>
        </div>
        ${actions.map((a) => `<a class="cc-row cc-row--${a[0]} reveal" href="${a[4]}"${a[5] ? ' target="_blank" rel="noopener"' : ''}>
          <span class="cc-row__icon"><i class="${a[1]}" aria-hidden="true"></i></span>
          <span class="cc-row__text"><span class="cc-row__label">${a[2]}</span><span class="cc-row__value">${a[3]}</span></span>
          <i class="fa-solid fa-arrow-right cc-row__go" aria-hidden="true"></i>
        </a>`).join('\n        ')}
        <div class="cc-gst reveal">
          <span class="cc-row__icon"><i class="fa-solid fa-receipt" aria-hidden="true"></i></span>
          <span class="cc-row__text"><span class="cc-row__label">GST Number</span><span class="cc-row__value" id="gst-value">${GST}</span></span>
          <button type="button" class="cc-copy" data-copy="${GST}" aria-label="Copy GST number"><i class="fa-regular fa-copy" aria-hidden="true"></i><span>Copy</span></button>
        </div>
        <div class="cc-socials">
          ${socials.map((s) => `<a class="cc-social cc-social--${s[0]} reveal" href="${s[4]}" target="_blank" rel="noopener"><i class="${s[1]}" aria-hidden="true"></i><span><strong>${s[2]}</strong><small>${s[3]}</small></span></a>`).join('\n          ')}
        </div>
      </div>`;
  const body = `${banner('Contact Us', 'Call, WhatsApp or send an enquiry – we usually reply the same working day.', [['Home', 'index.html'], ['Contact Us']], r)}
<section class="section">
  <div class="container contact-layout">
    <div>
      <div class="section-head section-head--left reveal"><span class="eyebrow">Get in Touch</span><h2>Krish Metal Corporation</h2></div>
      ${contactPanel}
      <div class="info-block mt-2 reveal">
        <h3><i class="fa-solid fa-clock" aria-hidden="true"></i> Business Hours</h3>
        <!-- CLIENT: confirm business hours -->
        <ul class="hours"><li><span>Monday – Saturday</span><strong>9:30 AM – 7:00 PM</strong></li><li><span>Sunday</span><strong>Closed</strong></li></ul>
      </div>
    </div>
    <div class="calc__panel reveal reveal-delay-1" id="enquiry">
      <span class="eyebrow">Enquiry Form</span>
      <h2>Request a quote</h2>
${enquiryForm()}
    </div>
  </div>
</section>
<section class="section section--steel" style="padding-top:clamp(32px,5vw,56px)">
  <div class="container">
    <div class="map-wrap reveal"><iframe src="${MAP}" title="Map – Krish Metal Corporation, Landge Industrial Estate, Bhosari, Pune" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
    <div class="btn-row mt-2" style="justify-content:center"><a class="btn btn--primary" href="${GMB}" target="_blank" rel="noopener"><i class="fa-brands fa-google" aria-hidden="true"></i> View on Google</a><a class="btn btn--outline" href="${GMB}" target="_blank" rel="noopener"><i class="fa-solid fa-star" aria-hidden="true"></i> Review us on Google</a></div>
  </div>
</section>`;
  page({ file: 'contact.html', nav: 'contact', title: 'Contact Krish Metal Corporation – Press Brake Tools, Bhosari, Pune', desc: 'Contact Krish Metal Corporation, Landge Industrial Estate, Bhosari, Pune 411039. Call or WhatsApp +91 99210 66212, email krishmetalcorp@gmail.com. Send your drawing for a quote.', crumbs: [['Home', 'index.html'], ['Contact Us']] }, body);
}

/* ================================ 404 ================================ */
function notFound() {
  /* Absolute root ("/") so styles load from any missing URL depth when served from the domain root */
  const body = `<section class="section notfound">
  <div class="container">
    <div class="notfound__code">404</div>
    <h1>This page has been bent out of shape</h1>
    <p class="lead">The page you are looking for does not exist or has moved.</p>
    <div class="btn-row" style="justify-content:center">
      <a class="btn btn--primary" href="${SITE}/index.html"><i class="fa-solid fa-house" aria-hidden="true"></i> Back to Home</a>
      <a class="btn btn--outline" href="${SITE}/products.html">View Products</a>
      <a class="btn btn--wa" href="${WA_DEFAULT}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp Us</a>
    </div>
  </div>
</section>`;
  page({ file: '404.html', root: SITE + '/', nav: '', noindex: true, title: 'Page Not Found | Krish Metal Corporation', desc: 'The requested page could not be found.' }, body);
}

/* ================================ RUN ================================ */
fs.mkdirSync(path.join(OUT, 'assets/images/products'), { recursive: true });
KMC.categories.forEach((c) => fs.writeFileSync(path.join(OUT, 'assets/images/products', c.slug + '.svg'), productSVG(c.draw, c.title)));
['profiles', 'clients', 'gallery', 'instagram', 'infrastructure'].forEach((d) => {
  fs.mkdirSync(path.join(OUT, 'assets/images', d), { recursive: true });
});
home(); about(); productsOverview(); KMC.categories.forEach(productPage); services(); technical(); gallery(); clients(); contact(); notFound();

const urls = ['', 'about.html', 'products.html', ...KMC.categories.map((c) => 'products/' + c.slug + '.html'), 'services.html', 'technical.html', 'gallery.html', 'clients.html', 'contact.html'];
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE}/${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === '' ? '1.0' : u.startsWith('products') ? '0.9' : '0.7'}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log('built', urls.length + 1, 'pages');
