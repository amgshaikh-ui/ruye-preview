/* =========================================================
   رؤى لخدمات الأعمال — سلوك الصفحة
   بلا اعتماديات · يعمل بفتح الملف مباشرة
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) الهيدر: حالة التمرير ---------- */
  var header = document.getElementById('header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2) قائمة الجوال ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  var label = function (key, fallback) {
    return (window.RuyeI18n && window.RuyeI18n.t(key)) || fallback;
  };

  var closeNav = function () {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', label('menuOpen', 'فتح القائمة'));
  };

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? label('menuClose', 'إغلاق القائمة') : label('menuOpen', 'فتح القائمة'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- 3) الظهور عند التمرير ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 4) عدّادات الأرقام ---------- */
  // الأرقام لاتينية في اللغتين (قرار ٢٠٢٦-١١-٠٧): الرقم نفسه ثابت،
  // والمتغيّر وحده هو اللاحقة — «70 مليون» عربيًا و«70M» إنجليزيًا.
  var isRTL = function () { return document.documentElement.getAttribute('dir') !== 'ltr'; };

  var renderCount = function (el, value) {
    el.__ruyeValue = value;
    var rtl = isRTL();
    var suffix = el.getAttribute(rtl ? 'data-suffix-ar' : 'data-suffix-en') || '';
    // العربية: «٧٠ مليون» بمسافة — الإنجليزية: «70M» بلا مسافة
    el.textContent = String(value) + (suffix ? (rtl ? ' ' + suffix : suffix) : '');
  };

  var runCounter = function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;

    if (reduced) { renderCount(el, target); return; }

    var duration = 1600;
    var start = null;

    var step = function (timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);           // easeOutCubic
      renderCount(el, Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  var counters = document.querySelectorAll('[data-count]');

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { renderCount(el, parseInt(el.getAttribute('data-count'), 10) || 0); });
  } else {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  // أعد رسم الأرقام عند تبديل اللغة دون إعادة تشغيل الحركة
  document.addEventListener('ruye:lang', function () {
    counters.forEach(function (el) {
      renderCount(el, el.__ruyeValue != null ? el.__ruyeValue : 0);
    });
  });

  /* ---------- 5) إبراز رابط القسم الحالي ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    // شريط رصد ضيّق بين ٢٥٪ و٤٥٪ من ارتفاع الشاشة.
    // العتبة صفر إجبارًا لا اختيارًا: العتبة تُقاس من حجم القسم لا من الشريط،
    // وأقسامنا أطول من ١٠٠٠ بكسل بينما الشريط ~١٥٤، فأقصى تقاطع ممكن ~٠٫١٤.
    // أي عتبة فوق ذلك شرطٌ لا يتحقّق في أي موضع تمرير فلا يُفعَّل رابط أبدًا.
    var order = sections.map(function (section) { return section.id; });
    var inBand = [];

    var paint = function () {
      // الأدنى في ترتيب المستند = القسم الذي ندخله، لا الذي نغادره
      var current = inBand.length ? inBand[inBand.length - 1] : null;
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', current !== null && link.getAttribute('href') === '#' + current);
      });
    };

    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var at = inBand.indexOf(entry.target.id);
        if (entry.isIntersecting) { if (at === -1) inBand.push(entry.target.id); }
        else if (at !== -1) { inBand.splice(at, 1); }
      });
      // رتّب حسب المستند: الاختيار يجب ألّا يتعلّق بترتيب وصول الأحداث
      inBand.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
      paint();
    }, { threshold: 0, rootMargin: '-25% 0px -55% 0px' });

    sections.forEach(function (section) { spyObserver.observe(section); });
  }

  /* ---------- 6) معاينة الأعمال ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxAvif = document.getElementById('lightboxAvif');
  var lightboxClose = document.getElementById('lightboxClose');
  var lastFocused = null;

  var openLightbox = function (src, alt) {
    lastFocused = document.activeElement;
    // المصدر أولًا ثم الصورة: <picture> يحسم اختياره عند إسناد src
    if (lightboxAvif) lightboxAvif.setAttribute('srcset', src.replace(/\.jpg$/, '.avif'));
    lightboxImg.setAttribute('src', src);
    lightboxImg.setAttribute('alt', alt || '');
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };

  var closeLightbox = function () {
    lightbox.classList.remove('is-open');
    if (lightboxAvif) lightboxAvif.removeAttribute('srcset');
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  // اللوحات الفعلية في قسم التقارير تُفتح بنفس نافذة المعاينة
  document.querySelectorAll('.work-card, .proof').forEach(function (card) {
    card.addEventListener('click', function () {
      var img = card.querySelector('img');
      openLightbox(card.getAttribute('data-full'), img ? img.getAttribute('alt') : '');
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });

  /* ---------- 7) سنة الحقوق ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
