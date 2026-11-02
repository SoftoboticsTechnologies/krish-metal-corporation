/* =====================================================================
   KRISH METAL CORPORATION – MAIN SCRIPT (vanilla ES6, no libraries)
   ---------------------------------------------------------------------
   Modules (each runs only if its markup exists on the page):
    1. Utilities & config        9. Product gallery + lightbox
    2. Preloader, year, years   10. Technical series tables (renderSeries)
    3. Sticky header            11. Products finder (search / filter)
    4. Off-canvas nav + mega    12. Gallery filter
    5. Scroll reveal            13. Contact form (WhatsApp / email)
    6. Counters                 14. WhatsApp chat popup
    7. Hero slider              15. Bending force calculator
    8. Carousels & tabs         16. Image placeholder fallback
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 1. UTILITIES & CONFIG ---------- */
  var CONFIG = {
    phone: '+919921066212',
    whatsapp: '919921066212',
    email: 'krishmetalcorp@gmail.com',
    company: 'Krish Metal Corporation',
    founded: 2016
  };
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ROOT = document.body.getAttribute('data-root') || ''; /* "" for root pages, "../" for /products/ */
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var waLink = function (msg) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg); };
  document.documentElement.classList.add('js');

  /* Simple swipe helper (used by hero slider + lightbox) */
  function onSwipe(el, left, right) {
    var x0 = null, y0 = null;
    el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { (dx < 0 ? left : right)(); }
      x0 = null;
    }, { passive: true });
  }

  /* ---------- 2. PRELOADER, YEAR, YEARS OF EXPERIENCE ---------- */
  var preloader = $('.preloader');
  function hidePreloader() { if (preloader) preloader.classList.add('is-hidden'); }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1200); /* never block content for long */

  var year = new Date().getFullYear();
  $$('[data-year]').forEach(function (el) { el.textContent = year; });
  $$('[data-years-exp]').forEach(function (el) { el.textContent = year - CONFIG.founded; });
  $$('[data-count-years]').forEach(function (el) { el.setAttribute('data-count', year - CONFIG.founded); });

  /* ---------- 3. STICKY HEADER + BACK TO TOP ---------- */
  var header = $('.site-header');
  var topBtn = $('.fab--top');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 40);
    if (topBtn) topBtn.classList.toggle('is-visible', y > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  /* ---------- 4. OFF-CANVAS NAV + MEGA MENU ---------- */
  var nav = $('#site-nav');
  var navToggle = $('.nav-toggle');
  var navClose = $('.nav-close');
  var overlay = $('.nav-overlay');
  var desktopMQ = window.matchMedia('(min-width: 1024px)');
  var lastFocus = null;

  function openNav() {
    if (!nav) return;
    lastFocus = document.activeElement;
    nav.classList.add('is-open');
    if (header) header.classList.add('nav-open');
    overlay.classList.add('is-visible');
    document.body.classList.add('no-scroll');
    navToggle.setAttribute('aria-expanded', 'true');
    setTimeout(function () { navClose && navClose.focus({ preventScroll: true }); }, 50);
  }
  function closeNav() {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    if (header) header.classList.remove('nav-open');
    overlay.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
    navToggle.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }
  if (navToggle) navToggle.addEventListener('click', openNav);
  if (navClose) navClose.addEventListener('click', closeNav);
  if (overlay) overlay.addEventListener('click', closeNav);
  desktopMQ.addEventListener ? desktopMQ.addEventListener('change', closeNav) : desktopMQ.addListener(closeNav);

  /* Focus trap inside the open off-canvas panel */
  if (nav) nav.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !nav.classList.contains('is-open')) return;
    var f = $$('a, button', nav).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  /* Products sub-menu: accordion on mobile, click-toggle on desktop (hover/focus also handled in CSS) */
  $$('.nav__toggle-sub').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('is-open', !open);
    });
  });
  document.addEventListener('click', function (e) {
    if (!desktopMQ.matches) return;
    $$('.nav__item--mega').forEach(function (item) {
      if (!item.contains(e.target)) {
        var b = $('.nav__toggle-sub', item);
        b.setAttribute('aria-expanded', 'false');
        $('.mega', item).classList.remove('is-open');
      }
    });
  });

  /* ESC closes nav, mega menu, popup and lightbox */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeNav();
    $$('.mega.is-open').forEach(function (m) {
      m.classList.remove('is-open');
      var b = $('[aria-controls="' + m.id + '"]');
      if (b) { b.setAttribute('aria-expanded', 'false'); if (desktopMQ.matches) b.focus(); }
    });
    closeWaPopup();
    closeLightbox();
    closeQuote();
  });

  /* Close the off-canvas when an in-page link is followed */
  if (nav) $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { if (!desktopMQ.matches) closeNav(); }); });

  /* ---------- 5. SCROLL REVEAL ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 6. ANIMATED COUNTERS ---------- */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounter(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else counters.forEach(runCounter);

  /* ---------- 7. HERO SLIDER ---------- */
  var hero = $('.hero');
  if (hero) {
    var slides = $$('.hero__slide', hero);
    var dotsWrap = $('.hero__dots', hero);
    var idx = 0, timer = null, DELAY = 3000;
    slides.forEach(function (s, i) {
      var d = document.createElement('button');
      d.className = 'hero__dot';
      d.type = 'button';
      d.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + slides.length);
      d.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(d);
    });
    var dots = $$('.hero__dot', hero);
    function go(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var on = i === idx;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', String(!on));
        $$('a, button', s).forEach(function (el) { el.tabIndex = on ? 0 : -1; });
      });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === idx)); });
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); if (!reduceMotion) timer = setInterval(next, DELAY); }
    $('.hero__arrow--next', hero).addEventListener('click', function () { next(); restart(); });
    $('.hero__arrow--prev', hero).addEventListener('click', function () { prev(); restart(); });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', restart);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', restart);
    hero.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); restart(); }
      if (e.key === 'ArrowLeft') { prev(); restart(); }
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : restart(); });
    onSwipe(hero, function () { next(); restart(); }, function () { prev(); restart(); });
    go(0); restart();
  }

  /* ---------- 8. CAROUSELS & TABS ---------- */
  $$('.carousel').forEach(function (c) {
    var track = $('.carousel__track', c);
    var step = function () { var item = track.firstElementChild; return item ? item.getBoundingClientRect().width + 16 : 300; };
    var prevB = $('.carousel__btn--prev', c), nextB = $('.carousel__btn--next', c);
    function move(dir) {
      var max = track.scrollWidth - track.clientWidth - 4;
      if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0 });
      else if (dir < 0 && track.scrollLeft <= 0) track.scrollTo({ left: max });
      else track.scrollBy({ left: dir * step() });
    }
    if (prevB) prevB.addEventListener('click', function () { move(-1); });
    if (nextB) nextB.addEventListener('click', function () { move(1); });
    if (c.hasAttribute('data-autoplay') && !reduceMotion) {
      var t = setInterval(function () { move(1); }, 3500);
      ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { c.addEventListener(ev, function () { clearInterval(t); }, { passive: true }); });
    }
  });

  $$('.tabs').forEach(function (tabs) {
    var btns = $$('[role="tab"]', tabs);
    function select(b) {
      btns.forEach(function (x) {
        var on = x === b;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
        if (n === null) return;
        var t = btns[(n + btns.length) % btns.length]; select(t); t.focus();
      });
    });
  });

  /* Brand marquee – duplicate content for a seamless loop */
  $$('.marquee__track').forEach(function (t) {
    t.insertAdjacentHTML('beforeend', t.innerHTML.replace(/<span/g, '<span aria-hidden="true"'));
  });

  /* ---------- 9. LIGHTBOX (shared by product gallery & gallery page) ---------- */
  var lb = null, lbItems = [], lbIndex = 0, lbReturn = null;
  function buildLightbox() {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = '<button type="button" class="lightbox__btn lightbox__close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
      '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>' +
      '<figure class="lightbox__fig"><img class="lightbox__img" alt=""><figcaption class="lightbox__cap"></figcaption></figure>' +
      '<button type="button" class="lightbox__btn lightbox__next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>';
    document.body.appendChild(lb);
    $('.lightbox__close', lb).addEventListener('click', closeLightbox);
    $('.lightbox__prev', lb).addEventListener('click', function () { showLb(lbIndex - 1); });
    $('.lightbox__next', lb).addEventListener('click', function () { showLb(lbIndex + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') showLb(lbIndex + 1);
      if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      if (e.key === 'Tab') { /* keep focus inside */
        var f = $$('button', lb); var i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    onSwipe(lb, function () { showLb(lbIndex + 1); }, function () { showLb(lbIndex - 1); });
  }
  function showLb(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    var it = lbItems[lbIndex];
    var img = $('.lightbox__img', lb);
    img.src = it.src; img.alt = it.alt || '';
    $('.lightbox__cap', lb).textContent = it.caption || it.alt || '';
    var multi = lbItems.length > 1;
    $('.lightbox__prev', lb).hidden = !multi; $('.lightbox__next', lb).hidden = !multi;
  }
  function openLightbox(items, start) {
    buildLightbox();
    lbItems = items; lbReturn = document.activeElement;
    showLb(start || 0);
    lb.classList.add('is-open');
    document.body.classList.add('no-scroll');
    $('.lightbox__close', lb).focus();
  }
  function closeLightbox() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (lbReturn) lbReturn.focus();
  }

  /* Product gallery: thumbnails switch main image, main image opens lightbox */
  $$('.pgallery').forEach(function (g) {
    var main = $('.pgallery__main img', g);
    var thumbs = $$('.pgallery__thumb', g);
    var items = thumbs.map(function (t) { var im = $('img', t); return { src: t.getAttribute('data-full') || im.src, alt: im.alt }; });
    var cur = 0;
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        cur = i; main.src = items[i].src; main.alt = items[i].alt;
        thumbs.forEach(function (x, j) { x.setAttribute('aria-current', String(j === i)); });
      });
    });
    $('.pgallery__main', g).addEventListener('click', function () { openLightbox(items.length ? items : [{ src: main.src, alt: main.alt }], cur); });
  });

  /* ---------- 10. TECHNICAL SERIES TABLES ---------- */
  var KMC = window.KMC;
  var CAT_IMG = {}; /* category key -> placeholder drawing */
  if (KMC) KMC.categories.forEach(function (c) { CAT_IMG[c.key] = ROOT + 'assets/images/products/' + c.slug + '.svg'; });

  function matBadge(code, label) {
    var m = KMC.materials[code];
    return '<span class="mat-badge mat-badge--' + code + '" title="' + esc(m.steel + ' – ' + m.strength) + '">' + esc(m.grade) + ' · ' + esc(label || m.steel) + '</span>';
  }
  function tableHTML(s) {
    var angleIdx = s.cols.indexOf('Angle');
    var head = s.cols.map(function (c, i) { return '<th scope="col"' + (i === angleIdx ? ' class="is-angle"' : '') + '>' + esc(c) + '</th>'; }).join('');
    var body = s.rows.map(function (r) {
      return '<tr>' + r.map(function (v, i) {
        if (i === 0) {
          var star = /\*$/.test(v);
          var t = v.replace(/\*$/, '');
          return '<td>' + esc(t) + (star ? '<span class="horn" title="' + (s.pneumatic ? 'Also in pneumatic version' : 'Available in standard horns configuration') + '">●</span>' : '') + '</td>';
        }
        if (i === angleIdx) return '<td class="angle">' + esc(v) + '°</td>';
        return '<td>' + esc(v) + '</td>';
      }).join('') + '</tr>';
    }).join('');
    return '<div class="table-wrap" tabindex="0" role="region" aria-label="' + esc(s.code) + ' specifications"><table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<p class="scroll-hint"><i class="fa-solid fa-arrows-left-right" aria-hidden="true"></i> Swipe / scroll sideways to see all columns</p>';
  }
  /* renderSeries('punches') – renders every profile of a category into [data-series] */
  window.renderSeries = function (catKey, target) {
    target = target || $('[data-series="' + catKey + '"]');
    if (!KMC || !target) return;
    var list = KMC.seriesFor(catKey);
    var toc = $('[data-series-toc]');
    if (toc) toc.innerHTML = list.map(function (s) { return '<a href="#' + s.code + '">' + esc(s.code) + '</a>'; }).join('');
    target.innerHTML = list.map(function (s) {
      var first = s.rows[0][0].replace(/\*$/, '');
      var msg = 'Hello ' + CONFIG.company + ', I would like a quotation for ' + s.code + (s.title ? ' (' + s.title + ')' : '') + '. Art. N: ' + first + '. Quantity / length: ';
      return '<article class="series reveal is-visible" id="' + s.code + '">' +
        '<figure class="series__figure">' +
          /* CLIENT: place the line drawing at assets/images/profiles/<CODE>.png – a generic drawing is shown until then */
          '<img src="' + ROOT + 'assets/images/profiles/' + s.code + '.png" data-fallback="' + CAT_IMG[s.cat] + '" alt="' + esc(s.code) + ' profile drawing" loading="lazy" width="220" height="293">' +
          '<figcaption>Profile drawing</figcaption></figure>' +
        '<div class="series__body">' +
          '<div class="series__head"><h3>' + esc(s.code) + '</h3>' + matBadge(s.mat, s.matLabel) + '</div>' +
          (s.title ? '<p class="series__sub">' + esc(s.title) + '</p>' : '') +
          tableHTML(s) +
          '<ul class="series__meta">' +
            '<li><strong>Material:</strong> ' + esc(s.matLabel || KMC.materials[s.mat].steel) + '</li>' +
            '<li><strong>Available sections:</strong> ' + esc(s.sections) + '</li>' +
            (s.weight ? '<li><strong>Approx. weight (835/805S | 415 mm):</strong> ' + esc(s.weight) + '</li>' : '') +
            (s.width ? '<li><strong>Body width:</strong> ' + s.width + ' mm</li>' : '') +
            (s.note ? '<li><strong>Note:</strong> ' + esc(s.note) + '</li>' : '') +
          '</ul>' +
          (s.horn ? '<p class="series__note">● Position available in standard horns configuration</p>' : '') +
          (s.pneumatic ? '<p class="series__note">● Position also available in pneumatic version</p>' : '') +
          '<div class="series__actions">' +
            '<a class="btn btn--primary btn--sm" href="' + ROOT + 'contact.html?product=' + encodeURIComponent(KMC.category(s.cat).title) + '&code=' + encodeURIComponent(s.code) + '#enquiry" data-quote><i class="fa-solid fa-file-invoice" aria-hidden="true"></i> Request Quote for ' + esc(s.code) + '</a>' +
            '<a class="btn btn--wa btn--sm" href="' + waLink(msg) + '" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp for Price</a>' +
          '</div>' +
        '</div></article>';
    }).join('');
    bindFallbacks(target);
  };
  $$('[data-series]').forEach(function (el) { window.renderSeries(el.getAttribute('data-series'), el); });

  /* Hemming tonnage + bending tonnage tables (technical page & hemming page) */
  $$('[data-hemming-table]').forEach(function (el) {
    el.innerHTML = '<div class="table-wrap" tabindex="0" role="region" aria-label="Hemming tonnage table"><table><thead>' +
      '<tr><th rowspan="2">S mm</th><th rowspan="2">H mm</th><th colspan="2">Tonnage / metre</th><th rowspan="2">2 × S mm</th><th colspan="2">Tonnage / metre</th></tr>' +
      '<tr><th>Mild steel</th><th>INOX</th><th>Mild steel</th><th>INOX</th></tr></thead><tbody>' +
      KMC.hemming.map(function (r) { return '<tr>' + r.map(function (v) { return '<td>' + v + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  });
  $$('[data-tonnage-table]').forEach(function (el) {
    var cols = KMC.tonnageCols;
    var html = '<div class="table-wrap" tabindex="0" role="region" aria-label="Bending tonnage table for mild steel"><table class="tonnage-table"><thead><tr><th>V</th><th>h min</th><th>R</th>' +
      cols.map(function (c) { return '<th>S ' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
    /* Recommended thickness per V (highlighted in the catalogue) */
    var REC = { 6: 0.5, 8: 0.8, 10: 1, 12: 1.2, 15: 1.5, 20: 1.8, 26: 2, 30: 2.5, 32: 3, 37: 3.5, 42: 4, 45: 4.5, 50: 5, 60: 6, 70: 7, 80: 8, 90: 9, 100: 10, 130: 12, 180: 15, 200: 18, 250: 20 };
    KMC.tonnage.forEach(function (row) {
      html += '<tr data-v="' + row[0] + '"><th scope="row">' + row[0] + '</th><td>' + row[1] + '</td><td>' + row[2] + '</td>' +
        cols.map(function (c) { var v = row[3][c]; return v === undefined ? '<td class="empty">·</td>' : '<td data-s="' + c + '"' + (REC[row[0]] === c ? ' class="hl"' : '') + '>' + v + '</td>'; }).join('') + '</tr>';
    });
    el.innerHTML = html + '</tbody></table></div><p class="scroll-hint"><i class="fa-solid fa-arrows-left-right" aria-hidden="true"></i> Values in tonnes per metre of bend length (mild steel, TS 45 kg/mm²)</p>';
  });
  $$('[data-brands]').forEach(function (el) {
    el.innerHTML = KMC.brands.map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '<span>…and more</span>';
  });

  /* ---------- 11. PRODUCTS FINDER (products.html) ---------- */
  var finder = $('#finder');
  if (finder && KMC) {
    var records = [];
    KMC.order.forEach(function (code) {
      var s = KMC.series[code], cat = KMC.category(s.cat);
      var ai = s.cols.indexOf('Angle');
      var hi = ['H', 'H1', 'Hmax'].map(function (k) { return s.cols.indexOf(k); }).filter(function (i) { return i > -1; })[0];
      var vi = s.cols.indexOf('V'); if (vi < 0) vi = s.cols.indexOf('V1');
      s.rows.forEach(function (r) {
        records.push({ code: code, cat: cat, art: r[0].replace(/\*$/, ''), angle: ai > -1 ? r[ai] : '', h: hi !== undefined ? r[hi] : '', v: vi > -1 ? r[vi] : '', mat: s.mat, title: s.title || cat.title });
      });
    });
    var q = $('#finder-q'), fa = $('#finder-angle'), fc = $('#finder-cat'), fh = $('#finder-h');
    KMC.categories.filter(function (c) { return !c.noData; }).forEach(function (c) { fc.insertAdjacentHTML('beforeend', '<option value="' + c.key + '">' + esc(c.title) + '</option>'); });
    var angles = {}; records.forEach(function (r) { if (r.angle && /^\d+$/.test(r.angle)) angles[r.angle] = 1; });
    Object.keys(angles).map(Number).sort(function (a, b) { return b - a; }).forEach(function (a) { fa.insertAdjacentHTML('beforeend', '<option value="' + a + '">' + a + '°</option>'); });
    var out = $('#finder-results'), count = $('#finder-count');
    function hBand(h) { h = parseFloat(h); if (isNaN(h)) return ''; return h < 80 ? 'lt80' : h <= 120 ? '80-120' : 'gt120'; }
    function render() {
      var term = q.value.trim().toLowerCase();
      var list = records.filter(function (r) {
        if (fc.value && r.cat.key !== fc.value) return false;
        if (fa.value && r.angle !== fa.value) return false;
        if (fh.value && hBand(r.h) !== fh.value) return false;
        if (term) { var hay = (r.code + ' ' + r.art + ' ' + r.code + '-' + r.art + ' ' + r.title + ' ' + r.cat.title + ' ' + r.angle + '° h' + r.h + ' v' + r.v).toLowerCase(); if (!term.split(/\s+/).every(function (t) { return hay.indexOf(t) > -1; })) return false; }
        return true;
      });
      count.textContent = list.length + ' article' + (list.length === 1 ? '' : 's') + ' found';
      out.innerHTML = list.length ? list.slice(0, 400).map(function (r) {
        return '<tr><td><a href="products/' + r.cat.slug + '.html#' + r.code + '">' + esc(r.code) + '</a></td><td>' + esc(r.art) + '</td><td>' + esc(r.cat.title) + '</td><td class="angle">' + (r.angle ? esc(r.angle) + '°' : '–') + '</td><td>' + (esc(r.h) || '–') + '</td><td>' + (esc(r.v) || '–') + '</td><td>' + matBadge(r.mat) + '</td>' +
          '<td><a class="btn btn--outline btn--sm" href="contact.html?product=' + encodeURIComponent(r.cat.title) + '&code=' + encodeURIComponent(r.code + ' / ' + r.art) + '#enquiry" data-quote>Get Quote</a></td></tr>';
      }).join('') : '<tr><td colspan="8">No matching tools. Try a different search or <a href="contact.html#enquiry">ask us for a custom tool</a>.</td></tr>';
    }
    [q, fa, fc, fh].forEach(function (el) { el.addEventListener('input', render); el.addEventListener('change', render); });
    $('#finder-reset').addEventListener('click', function () { q.value = ''; fa.value = ''; fc.value = ''; fh.value = ''; render(); q.focus(); });
    render();
  }

  /* ---------- 12. GALLERY FILTER ---------- */
  var gallery = $('.masonry');
  if (gallery) {
    var gItems = $$('.masonry__item', gallery);
    $$('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        $$('.filter-btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        gItems.forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f); });
      });
    });
    gItems.forEach(function (it) {
      $('.masonry__btn', it).addEventListener('click', function () {
        var visible = gItems.filter(function (x) { return !x.hidden; });
        var items = visible.map(function (x) { var im = $('img', x); return { src: im.currentSrc || im.src, alt: im.alt, caption: x.getAttribute('data-caption') }; });
        openLightbox(items, visible.indexOf(it));
      });
    });
  }

  /* ---------- 13. CONTACT / ENQUIRY FORM ---------- */
  var form = $('#enquiry-form');
  /* Pre-fill product / article code (from contact.html?product=T-Dies&code=PTD-001 or a quote link) */
  function prefillEnquiry(params) {
    var sel = $('#f-product'), p = params.get('product');
    if (p) {
      if (!$$('option', sel).some(function (o) { return o.value === p; })) sel.insertAdjacentHTML('beforeend', '<option>' + esc(p) + '</option>');
      sel.value = p;
    }
    if (params.get('code')) $('#f-code').value = params.get('code');
  }
  if (form) {
    var sel = $('#f-product');
    if (KMC && sel) KMC.categories.forEach(function (c) { sel.insertAdjacentHTML('beforeend', '<option>' + esc(c.title) + '</option>'); });
    if (sel) sel.insertAdjacentHTML('beforeend', '<option>Shearing Blade Resharpening</option><option>Other / Not sure</option>');
    prefillEnquiry(new URLSearchParams(location.search));

    var rules = {
      name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
      mobile: function (v) { return /^[+]?[\d\s-]{10,15}$/.test(v.trim()) || 'Please enter a valid mobile number (10+ digits).'; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.'; },
      quantity: function (v) { return v === '' || /^[\w\s.,/-]{1,40}$/.test(v) || 'Please enter a valid quantity.'; }
    };
    function validateField(input) {
      var rule = rules[input.name]; if (!rule) return true;
      var res = rule(input.value);
      var field = input.closest('.field');
      var errEl = $('.field__error', field);
      var ok = res === true;
      field.classList.toggle('has-error', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      errEl.textContent = ok ? '' : res;
      return ok;
    }
    $$('input, select, textarea', form).forEach(function (el) {
      el.addEventListener('blur', function () { validateField(el); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
    });
    function collect() {
      var d = {}; $$('input, select, textarea', form).forEach(function (el) { if (el.name && el.type !== 'file') d[el.name] = el.value.trim(); });
      var file = $('#f-file'); d.file = file && file.files.length ? file.files[0].name : '';
      return d;
    }
    function message(d) {
      return 'New enquiry – ' + CONFIG.company + ' website\n\n' +
        'Name: ' + d.name + '\n' + (d.company ? 'Company: ' + d.company + '\n' : '') +
        'Mobile: ' + d.mobile + '\nEmail: ' + d.email + '\n' + (d.city ? 'City: ' + d.city + '\n' : '') +
        (d.product ? 'Product: ' + d.product + '\n' : '') + (d.code ? 'Article code: ' + d.code + '\n' : '') +
        (d.quantity ? 'Quantity: ' + d.quantity + '\n' : '') + (d.message ? '\nMessage: ' + d.message + '\n' : '') +
        (d.file ? '\nDrawing: ' + d.file + ' (I will share the file in this chat / by email)\n' : '');
    }
    var status = $('#form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || 'whatsapp';
      var ok = $$('input, select, textarea', form).map(validateField).every(Boolean);
      if (!ok) {
        status.className = 'form-status is-err';
        status.textContent = 'Please correct the highlighted fields.';
        var firstErr = $('.has-error input, .has-error select, .has-error textarea', form); if (firstErr) firstErr.focus();
        return;
      }
      var d = collect(), msg = message(d);
      /* ------------------------------------------------------------------
         SERVER-SIDE OPTION (later): to receive enquiries + file uploads by
         email, set <form action="https://formspree.io/f/XXXX" method="POST"
         enctype="multipart/form-data"> (or a PHP mailer script) and replace
         this block with fetch(form.action, { method: 'POST', body: new FormData(form) }).
         ------------------------------------------------------------------ */
      if (via === 'email') {
        location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Enquiry: ' + (d.product || 'Press brake tools') + (d.code ? ' – ' + d.code : '')) + '&body=' + encodeURIComponent(msg);
      } else {
        window.open(waLink(msg), '_blank', 'noopener');
      }
      status.className = 'form-status is-ok';
      status.textContent = 'Thank you! Your ' + (via === 'email' ? 'email app' : 'WhatsApp') + ' has opened with your enquiry. ' + (d.file ? 'Please attach your drawing there before sending.' : 'Just press send.');
    });
  }

  /* "Get a Quote" popup – any [data-quote] link opens the enquiry form in a modal
     (links still go to contact.html#enquiry without JS, and on the contact page itself) */
  var quoteModal = $('#quote-modal'), quoteReturn = null;
  function openQuote(link) {
    var url = new URL(link.href, location.href);
    prefillEnquiry(url.searchParams);
    quoteReturn = link;
    quoteModal.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(function () { quoteModal.classList.add('is-open'); $('#f-name').focus({ preventScroll: true }); }, 20);
  }
  function closeQuote() {
    if (!quoteModal || quoteModal.hidden) return;
    quoteModal.classList.remove('is-open');
    quoteModal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (quoteReturn && quoteReturn.offsetParent !== null) quoteReturn.focus();
  }
  if (quoteModal) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a[data-quote]');
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      openQuote(link);
    });
    $('.quote-modal__close', quoteModal).addEventListener('click', closeQuote);
    quoteModal.addEventListener('click', function (e) { if (e.target === quoteModal) closeQuote(); });
    quoteModal.addEventListener('keydown', function (e) { /* keep focus inside */
      if (e.key !== 'Tab') return;
      var f = $$('a, button, input, select, textarea', quoteModal);
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  }

  /* Copy-to-clipboard buttons (GST number on contact page) */
  $$('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var label = $('span', btn), txt = btn.getAttribute('data-copy');
      var done = function () { btn.classList.add('is-done'); label.textContent = 'Copied'; setTimeout(function () { btn.classList.remove('is-done'); label.textContent = 'Copy'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, function () {});
    });
  });

  /* ---------- 14. WHATSAPP CHAT POPUP ---------- */
  var waBtn = $('.fab--wa'), waPop = $('#wa-popup');
  function closeWaPopup() { if (waPop && waPop.classList.contains('is-open')) { waPop.classList.remove('is-open'); waBtn.setAttribute('aria-expanded', 'false'); } }
  if (waBtn && waPop) {
    /* The button is a real wa.me link (works without JS). With JS it opens the mini form first. */
    waBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = waPop.classList.toggle('is-open');
      waBtn.setAttribute('aria-expanded', String(open));
      if (open) setTimeout(function () { $('input', waPop).focus(); }, 60);
    });
    $('.wa-popup__close', waPop).addEventListener('click', function () { closeWaPopup(); waBtn.focus(); });
    var wsel = $('select', waPop);
    if (KMC && wsel) KMC.categories.forEach(function (c) { wsel.insertAdjacentHTML('beforeend', '<option>' + esc(c.title) + '</option>'); });
    $('form', waPop).addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('[name="wa-name"]', waPop).value.trim(), m = $('[name="wa-mobile"]', waPop).value.trim(), pr = wsel.value;
      var txt = 'Hello ' + CONFIG.company + ', I want to enquire about ' + (pr || 'press brake tools') + '.' + (n ? '\nName: ' + n : '') + (m ? '\nMobile: ' + m : '');
      window.open(waLink(txt), '_blank', 'noopener');
      closeWaPopup();
    });
  }

  /* ---------- 15. BENDING FORCE CALCULATOR ---------- */
  var calc = $('#calc-form');
  if (calc && KMC) {
    var H_FACTOR = { 30: 1.94, 45: 1.31, 60: 1, 90: 0.71, 120: 0.58, 135: 0.55, 165: 0.51 };
    var STD_V = KMC.tonnage.map(function (r) { return r[0]; });
    function vFor(S, R) {
      if (R > 0) return R * 2 + S * 2; /* radius bending */
      if (S <= 0.7) return S * 6;
      if (S <= 3.0) return S * 8;
      if (S <= 9.0) return S * 10;
      if (S <= 14.0) return S * 12;
      return S * 14;
    }
    /* Tonnage: exact table lookup when possible, otherwise air-bending formula
       F(t/m) ≈ 1.42 × TS × S² / V  (calibrated so it matches the catalogue table) */
    function tonsPerM(S, V) {
      var row = KMC.tonnage.filter(function (r) { return r[0] === V; })[0];
      if (row && row[3][S] !== undefined) return { t: row[3][S], src: 'table' };
      return { t: 1.42 * 45 * S * S / V, src: 'formula' };
    }
    function fmt(n, d) { return Number(n).toLocaleString('en-IN', { maximumFractionDigits: d === undefined ? 1 : d, minimumFractionDigits: 0 }); }
    function compute() {
      var S = parseFloat($('#c-s').value), TS = parseFloat($('#c-mat').value), A = parseInt($('#c-angle').value, 10);
      var L = parseFloat($('#c-len').value), R = parseFloat($('#c-r').value) || 0;
      var err = $('#calc-error');
      if (!(S > 0 && S <= 25) || !(L > 0)) { err.textContent = 'Enter a sheet thickness between 0.3 and 25 mm and a bend length above 0.'; return; }
      err.textContent = '';
      var Vcalc = vFor(S, R);
      /* round to the nearest standard die opening from the table */
      var V = STD_V.reduce(function (a, b) { return Math.abs(b - Vcalc) < Math.abs(a - Vcalc) ? b : a; });
      var Ri = (5 * V) / 32, h = V * H_FACTOR[A];
      var base = tonsPerM(S, V);
      var tpm = base.t * (TS / 45);
      var total = tpm * (L / 1000);
      $('#r-v').textContent = fmt(Vcalc) + ' mm';
      $('#r-vstd').textContent = 'V ' + V + ' mm';
      $('#r-ri').textContent = fmt(Ri) + ' mm';
      $('#r-h').textContent = fmt(h) + ' mm';
      $('#r-tpm').textContent = fmt(tpm) + ' t/m';
      $('#r-total').textContent = fmt(total) + ' t';
      $('#r-src').textContent = base.src === 'table' ? 'Tonnage taken from the catalogue table (V ' + V + ', S ' + S + ' mm) and scaled for material & length.' : 'S ' + S + ' mm is not listed for V ' + V + ' in the table – value estimated with the air-bending formula.';
      $$('.tonnage-table td.match').forEach(function (td) { td.classList.remove('match'); });
      var cell = $('.tonnage-table tr[data-v="' + V + '"] td[data-s="' + S + '"]'); if (cell) cell.classList.add('match');
      var q = 'Hello ' + CONFIG.company + ', I need tooling for S ' + S + ' mm, ' + A + '° bend, length ' + L + ' mm. Recommended die V ' + V + ' mm (~' + fmt(total) + ' t). Please suggest punch & die.';
      $('#r-wa').href = waLink(q);
    }
    calc.addEventListener('submit', function (e) { e.preventDefault(); compute(); });
    $$('input, select', calc).forEach(function (el) { el.addEventListener('input', compute); });
    compute();
  }

  /* ---------- 16. IMAGE PLACEHOLDER FALLBACK ----------
     Any <img data-fallback="..."> whose file is missing (e.g. client photos
     not uploaded yet) is swapped for the given placeholder; images without
     data-fallback get a neutral generated placeholder. */
  function placeholderSVG(label) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#E9EDF2"/><path d="M0 0h400v300H0z" fill="none" stroke="#C9D2DF" stroke-width="6" stroke-dasharray="14 10"/><text x="200" y="158" text-anchor="middle" font-family="Arial" font-size="20" fill="#5B6676">' + esc(label || 'Image coming soon') + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }
  function fallback(img) {
    if (img.dataset.fbDone) return;
    img.dataset.fbDone = '1';
    var pic = img.closest('picture');
    if (pic) $$('source', pic).forEach(function (s) { s.remove(); });
    img.src = img.getAttribute('data-fallback') || placeholderSVG(img.getAttribute('data-placeholder') || img.alt);
  }
  function bindFallbacks(ctx) {
    /* only images explicitly marked as replaceable placeholders */
    $$('img[data-fallback], img[data-placeholder]', ctx).forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fallback(img);
      img.addEventListener('error', function () { fallback(img); });
    });
  }
  bindFallbacks(document);
})();
