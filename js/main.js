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

  /* ---------- 7) نموذج التواصل ---------- */
  // وجهة الإرسال. ما دامت فارغة، يفتح النموذج برنامج البريد عند الزائر
  // برسالة معبّأة — يعمل بلا خادم وبلا اشتراك، لكنه يتطلّب منه ضغطة أخيرة.
  // وبوضع رابط خدمة إرسال ومفتاحها هنا (Web3Forms أو ما شابهها) تصل
  // الرسالة إلى info@ruye.sa دون أن يغادر الزائر الصفحة. هذان السطران
  // هما كل ما يلزم للانتقال من الحالة الأولى إلى الثانية.
  var FORM_ENDPOINT = '';
  var FORM_KEY = '';
  var MAIL_TO = 'info@ruye.sa';

  var form = document.getElementById('contactForm');

  if (form) {
    var statusEl = document.getElementById('formStatus');
    var sendBtn = form.querySelector('.cform__send');
    var T = function (key, fallback) {
      return (window.RuyeI18n && window.RuyeI18n.t(key)) || fallback;
    };

    var fields = [
      { el: document.getElementById('f-name'), err: 'e-name', key: 'errName',
        fb: 'اكتب اسمك من فضلك',
        ok: function (v) { return v.length > 1; } },
      { el: document.getElementById('f-email'), err: 'e-email', key: 'errEmail',
        fb: 'اكتب بريدًا إلكترونيًّا صحيحًا',
        // تحقّق متساهل عن قصد: الغرض منع الخطأ المطبعي لا الحكم على صحّة
        // العنوان، والقاعدة الصارمة ترفض عناوين سليمة أكثر ممّا تصطاد
        ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
      { el: document.getElementById('f-msg'), err: 'e-msg', key: 'errMessage',
        fb: 'اكتب لنا شيئًا عن مشروعك',
        ok: function (v) { return v.length > 4; } }
    ];

    var paint = function (f, bad) {
      var box = document.getElementById(f.err);
      if (bad) {
        f.el.setAttribute('aria-invalid', 'true');
        box.textContent = T(f.key, f.fb);
        box.hidden = false;
        box.__key = f.key; box.__fb = f.fb;
      } else {
        f.el.removeAttribute('aria-invalid');
        box.textContent = ''; box.hidden = true; box.__key = null;
      }
    };

    var say = function (key, fallback, state) {
      statusEl.textContent = key ? T(key, fallback) : '';
      statusEl.__key = key; statusEl.__fb = fallback;
      if (state) statusEl.setAttribute('data-state', state);
      else statusEl.removeAttribute('data-state');
    };

    // الخطأ يختفي بمجرّد التصحيح، لا عند الإرسال التالي
    fields.forEach(function (f) {
      f.el.addEventListener('input', function () {
        if (f.el.getAttribute('aria-invalid') === 'true' && f.ok(f.el.value.trim())) paint(f, false);
      });
    });

    var mailtoFallback = function (data) {
      var lines = [
        'الاسم: ' + data.name,
        'البريد: ' + data.email,
        data.phone ? 'الجوال: ' + data.phone : '',
        data.service ? 'الخدمة: ' + data.service : '',
        '',
        data.message
      ].filter(Boolean).join('\n');
      window.location.href = 'mailto:' + MAIL_TO +
        '?subject=' + encodeURIComponent('طلب من الموقع — ' + data.name) +
        '&body=' + encodeURIComponent(lines);
      say('fMailOpened', 'فتحنا برنامج البريد برسالة معبّأة. وإن لم يفتح شيء، راسلنا على info@ruye.sa أو على واتساب.', 'ok');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // الفخّ ممتلئ = روبوت. نُظهر نجاحًا ولا نرسل شيئًا: إخباره بأنه
      // كُشف يعلّمه كيف يتفادى الفخّ في المرّة القادمة.
      if (form.querySelector('#f-company').value) {
        say('fOk', 'وصلتنا رسالتك، ونردّ عليك خلال يوم عمل.', 'ok');
        form.reset();
        return;
      }

      var firstBad = null;
      fields.forEach(function (f) {
        var bad = !f.ok(f.el.value.trim());
        paint(f, bad);
        if (bad && !firstBad) firstBad = f.el;
      });
      if (firstBad) { say(null, ''); firstBad.focus(); return; }

      var sel = document.getElementById('f-service');
      var data = {
        name: document.getElementById('f-name').value.trim(),
        email: document.getElementById('f-email').value.trim(),
        phone: document.getElementById('f-phone').value.trim(),
        service: sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].textContent.trim() : '',
        message: document.getElementById('f-msg').value.trim()
      };

      if (!FORM_ENDPOINT) { mailtoFallback(data); return; }

      say('fSending', 'جارٍ الإرسال…');
      sendBtn.setAttribute('aria-disabled', 'true');

      var payload = {
        access_key: FORM_KEY,
        subject: 'طلب من موقع رؤى — ' + data.name,
        name: data.name, email: data.email,
        phone: data.phone, service: data.service, message: data.message
      };

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        say('fOk', 'وصلتنا رسالتك، ونردّ عليك خلال يوم عمل.', 'ok');
        form.reset();
      }).catch(function () {
        say('fErrSend', 'تعذّر الإرسال. راسلنا على واتساب أو على info@ruye.sa', 'err');
      }).then(function () {
        sendBtn.removeAttribute('aria-disabled');
      });
    });

    // عند تبديل اللغة تُعاد كتابة ما هو ظاهر من أخطاء وحالة
    document.addEventListener('ruye:lang', function () {
      document.querySelectorAll('.field__err').forEach(function (box) {
        if (box.__key && !box.hidden) box.textContent = T(box.__key, box.__fb);
      });
      if (statusEl.__key) statusEl.textContent = T(statusEl.__key, statusEl.__fb);
    });
  }

  /* ---------- 8) سنة الحقوق ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
