/* =========================================================
   رؤى لخدمات الأعمال — تبديل اللغة في المحل
   صفحة واحدة، قاموس عربي/إنجليزي، بلا اعتماديات
   النص الإنجليزي إعادة صياغة (transcreation) لا ترجمة حرفية
   ========================================================= */
(function (window, document) {
  'use strict';

  var STORAGE_KEY = 'ruye-lang';

  var META = {
    ar: {
      title: 'رؤى لخدمات الأعمال — حضور يترك أثر',
      desc: 'رؤى لخدمات الأعمال: خدمات إبداعية وتسويقية ورقمية تشمل بناء الهوية البصرية، وإدارة المحتوى، وتطوير المنصات، وتنظيم الفعاليات والتصوير والإنتاج الإعلامي.'
    },
    en: {
      title: 'Ruye Business Services — A presence that leaves a mark',
      desc: 'Ruye Business Services: creative, marketing and digital services — visual identity, content management, platform development, events, photography and media production.'
    }
  };

  var DICT = {
    ar: {
      skip: 'تخطَّ إلى المحتوى',
      logoHome: 'رؤى لخدمات الأعمال — الصفحة الرئيسية',
      logoAlt: 'رؤى لخدمات الأعمال',
      menuOpen: 'فتح القائمة',
      menuClose: 'إغلاق القائمة',
      navMain: 'التنقّل الرئيسي',
      langSwitch: 'Switch to English',

      navAbout: 'من نحن', navServices: 'خدماتنا', navImpact: 'الأثر',
      navTech: 'التقنية', navWork: 'أعمالنا',
      ctaStart: 'ابدأ مشروعك', ctaWork: 'شاهد أعمالنا', ctaWork2: 'شاهد أعمالنا',

      heroLine1: 'مو بس فكرة…',
      heroLine2: 'حضور يترك أثر',
      heroDisciplines: 'تصميم &nbsp;/&nbsp; محتوى &nbsp;/&nbsp; تقنية &nbsp;/&nbsp; تجارب',

      ebAbout: 'من نحن',
      aboutTitle: 'الفكرة الصح تبدأ<br>بفهم مشروعك.',
      aboutLead: 'رؤى لخدمات الأعمال تقدم خدمات إبداعية وتسويقية ورقمية، تشمل بناء الهوية البصرية، وإدارة المحتوى، وتطوير المنصات، وتنظيم الفعاليات والتصوير والإنتاج الإعلامي.',
      aboutClosingTitle: 'من الفكرة إلى حضور متكامل',
      aboutClosingLead: 'نجمع التصميم والمحتوى والتقنية لتقديم تجربة متناسقة تعكس هوية المشروع وتوضح رسالته عبر نقاط التواصل المختلفة.',
      altTeam: 'فريق رؤى لخدمات الأعمال أثناء العمل',

      ebServices: 'خدماتنا',
      servicesTitle: 'خبرات تتكامل.<br>وحضور يكتمل.',
      servicesLead: 'مجالات تتكامل بحسب احتياج مشروعك، من بناء الهوية إلى صناعة التجربة.',
      svc1Title: 'الهوية البصرية والتصميم الإبداعي',
      svc1Text: 'بناء هوية متكاملة من الشعار إلى تطبيقاته، بلغة بصرية ثابتة تظهر بنفس الحضور في كل نقطة تواصل.',
      svc2Title: 'التسويق الرقمي واستراتيجيات التسويق',
      svc2Text: 'حملات مبنية على هدف واضح، وقياس يتابع الأثر من أول ظهور إلى آخر تحويل.',
      svc3Title: 'إدارة المحتوى ومنصات التواصل الاجتماعي',
      svc3Text: 'خطط محتوى وإدارة يومية للمنصات، بصوت واحد يعرف جمهوره ويتحدّث بلغته.',
      svc4Title: 'الحلول التقنية وتطوير المنصات الرقمية',
      svc4Text: 'مواقع وتطبيقات وواجهات استخدام، من تنظيم المحتوى ومسارات الاستخدام إلى التسليم التقني.',
      svc5Title: 'التصوير والإنتاج الإعلامي',
      svc5Text: 'تصوير فوتوغرافي وفيديو ومونتاج ومؤثرات، بصورة تحمل رسالة المشروع وتوصلها.',
      svc6Title: 'تنظيم الفعاليات والتغطيات الإعلامية',
      svc6Text: 'تخطيط الفعاليات وتنفيذها وتغطيتها، من أول تصوّر للمشهد إلى آخر لقطة تُنشر.',
      servicesNote: 'والباقي تشوفه بعينك',

      ebImpact: 'التسويق الرقمي',
      impactTitle: 'كل حملة لها هدف.<br>وكل أثر يُقاس.',
      impactLead: 'نبني حملات تسويقية مدروسة تحوّل الانتباه إلى تفاعل، والتفاعل إلى نتائج.',
      mViews: 'مشاهدة', mClicks: 'نقرة', mFollowers: 'متابع',
      mWhatsapp: 'رسالة واتس آب', mVisits: 'زيارة', mSignups: 'تسجيل ومبيعات',
      channelsTitle: 'قنوات الحملات',
      ch1: 'تيك توك', ch2: 'إكس', ch3: 'إنستغرام', ch4: 'سناب شات',
      ch5: 'يوتيوب', ch6: 'واتس آب', ch7: 'اللوحات والشاشات',

      ebTech: 'التقنية',
      techTitle: 'الحلول التقنية وتطوير المنصات الرقمية',
      techLead: 'حضور متناسق يجمع تجربة الاستخدام والرسالة البصرية.',
      techSubTitle: 'واجهات وتجربة مستخدم',
      techSubLead: 'تصميم واجهات للمواقع والتطبيقات، وتنظيم المحتوى ومسارات الاستخدام ضمن خدمات الحلول التقنية وتطوير المنصات الرقمية.',
      altMockWeb: 'نموذج واجهة موقع من أعمال رؤى',
      altMockPhone: 'نموذج واجهة تطبيق جوال من أعمال رؤى',

      ebReports: 'القياس والتقارير',
      reportsTitle: 'التقارير ومؤشرات الأداء',
      reportsLead: 'رؤى واضحة تدعم قياس الأداء والمتابعة واتخاذ القرار.',
      altReport: 'نموذج من تقارير الأداء',
      dashTitle: 'لوحة الأداء', dashTag: 'نموذج · تقرير شهري',
      dashTrend: 'اتجاه الوصول', dashIncludes: 'ما يشمله التقرير',
      kpiViews: '70 مليون', kpiClicks: '10 مليون',
      kpiFollowers: '500 ألف', kpiSignups: '300 ألف',
      ri1: 'مؤشرات الأداء الرئيسية', ri2: 'مؤشرات الجودة والإنجاز',
      ri3: 'تحليل القنوات', ri4: 'الشكاوى والتصعيدات',
      ri5: 'التحديات والتوصيات',
      reportsProof: 'من تقارير سُلّمت فعلًا',

      ebWork: 'أعمالنا',
      workTitle: 'مشاريعنا تتكلم عنّا.',
      workLead: 'نماذج من الهوية والتصميم، والفعاليات، والتصوير والإنتاج، ولحظات صنعناها مع شركائنا.',
      work1: 'الهوية البصرية والتصميم الإبداعي', work1Sub: 'هوية وتطبيقاتها',
      work2: 'تنظيم الفعاليات والتغطيات', work2Sub: 'فعاليات ومؤتمرات',
      work3: 'التصوير والإنتاج الإعلامي', work3Sub: 'صورة تحمل رسالة',
      work4: 'الناس واللحظات', work4Sub: 'تغطيات ومناسبات',
      work5: 'مشاهد وتفاصيل', work5Sub: 'منتجات وبورتريه',
      altWork1: 'أعمال الهوية البصرية والتصميم الإبداعي',
      altWork2: 'أعمال تنظيم الفعاليات والتغطيات الإعلامية',
      altWork3: 'أعمال التصوير والإنتاج الإعلامي',
      altWork4: 'تغطيات الناس واللحظات',
      altWork5: 'مشاهد وتفاصيل من الإنتاج',

      ebContact: 'تواصل معنا',
      contactTitle: 'خلّنا نبدأ <strong>وتواصل معنا..</strong>',
      contactSub: 'من فكرة في بالك، إلى حضور يعبّر عنك.',
      labelEmail: 'البريد الإلكتروني', labelPhone: 'الهاتف',
      ctaWhatsapp: 'راسلنا على واتس آب', ctaEmail: 'أرسل بريدًا',
      footerNote: 'رؤى لخدمات الأعمال &nbsp;/&nbsp; RUYE — جميع الحقوق محفوظة © <span id="year">2026</span>',

      lbTitle: 'معاينة العمل', lbClose: 'إغلاق المعاينة'
    },

    en: {
      skip: 'Skip to content',
      logoHome: 'Ruye Business Services — home',
      logoAlt: 'Ruye Business Services',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      navMain: 'Main navigation',
      langSwitch: 'التبديل إلى العربية',

      navAbout: 'About', navServices: 'Services', navImpact: 'Impact',
      navTech: 'Technology', navWork: 'Work',
      ctaStart: 'Start your project', ctaWork: 'See our work', ctaWork2: 'See our work',

      heroLine1: 'Not just an idea…',
      heroLine2: 'a presence that leaves a mark',
      heroDisciplines: 'Design &nbsp;/&nbsp; Content &nbsp;/&nbsp; Technology &nbsp;/&nbsp; Experience',

      ebAbout: 'About us',
      aboutTitle: 'The right idea starts<br>with understanding your business.',
      aboutLead: 'Ruye Business Services delivers creative, marketing and digital work — building visual identity, running content, developing platforms, and producing events, photography and media.',
      aboutClosingTitle: 'From idea to a presence that holds together',
      aboutClosingLead: 'We bring design, content and technology into one coherent experience that carries your identity and makes your message clear at every touchpoint.',
      altTeam: 'The Ruye Business Services team at work',

      ebServices: 'Services',
      servicesTitle: 'Expertise that connects.<br>Presence that completes.',
      servicesLead: 'Disciplines that combine around what your project needs — from building the identity to crafting the experience.',
      svc1Title: 'Visual Identity & Creative Design',
      svc1Text: 'A complete identity, from the mark to every application, in one visual language that holds the same presence at every touchpoint.',
      svc2Title: 'Digital Marketing & Strategy',
      svc2Text: 'Campaigns built on a clear objective, measured from the first impression to the final conversion.',
      svc3Title: 'Content & Social Media Management',
      svc3Text: 'Content plans and day-to-day channel management, in one voice that knows its audience and speaks its language.',
      svc4Title: 'Technology & Digital Platforms',
      svc4Text: 'Websites, apps and interfaces — from content structure and user journeys through to technical delivery.',
      svc5Title: 'Photography & Media Production',
      svc5Text: 'Photography, film, editing and effects — images that carry your message and get it across.',
      svc6Title: 'Events & Media Coverage',
      svc6Text: 'Planning, running and covering events — from the first idea of the scene to the last frame published.',
      servicesNote: 'The rest, you will see for yourself',

      ebImpact: 'Digital marketing',
      impactTitle: 'Every campaign has a goal.<br>Every impact is measured.',
      impactLead: 'We build considered campaigns that turn attention into engagement, and engagement into results.',
      mViews: 'Views', mClicks: 'Clicks', mFollowers: 'Followers',
      mWhatsapp: 'WhatsApp messages', mVisits: 'Visits', mSignups: 'Signups & sales',
      channelsTitle: 'Campaign channels',
      ch1: 'TikTok', ch2: 'X', ch3: 'Instagram', ch4: 'Snapchat',
      ch5: 'YouTube', ch6: 'WhatsApp', ch7: 'Billboards & screens',

      ebTech: 'Technology',
      techTitle: 'Technology and digital platform development',
      techLead: 'A coherent presence where the way it works and the way it looks say the same thing.',
      techSubTitle: 'Interfaces & user experience',
      techSubLead: 'Interface design for websites and apps, with content structure and user journeys, as part of our technology and digital platform work.',
      altMockWeb: 'A website interface from Ruye projects',
      altMockPhone: 'A mobile app interface from Ruye projects',

      ebReports: 'Measurement & reporting',
      reportsTitle: 'Reports & performance indicators',
      reportsLead: 'Clear insight that supports measurement, follow-up and decision-making.',
      altReport: 'A sample performance report',
      dashTitle: 'Performance dashboard', dashTag: 'Sample · monthly report',
      dashTrend: 'Reach trend', dashIncludes: 'What the report covers',
      kpiViews: '70M', kpiClicks: '10M',
      kpiFollowers: '500K', kpiSignups: '300K',
      ri1: 'Key performance indicators', ri2: 'Quality & delivery indicators',
      ri3: 'Channel analysis', ri4: 'Complaints & escalations',
      ri5: 'Challenges & recommendations',
      reportsProof: 'From reports we actually delivered',

      ebWork: 'Our work',
      workTitle: 'Our projects speak for us.',
      workLead: 'A selection from identity and design, events, photography and production, and moments we made with our partners.',
      work1: 'Visual Identity & Creative Design', work1Sub: 'Identity and its applications',
      work2: 'Events & Coverage', work2Sub: 'Events and conferences',
      work3: 'Photography & Media Production', work3Sub: 'An image that carries a message',
      work4: 'People & Moments', work4Sub: 'Coverage and occasions',
      work5: 'Scenes & Details', work5Sub: 'Products and portraits',
      altWork1: 'Visual identity and creative design work',
      altWork2: 'Event organisation and media coverage work',
      altWork3: 'Photography and media production work',
      altWork4: 'Coverage of people and moments',
      altWork5: 'Scenes and details from production',

      ebContact: 'Get in touch',
      contactTitle: "Let's begin <strong>talk to us..</strong>",
      contactSub: 'From an idea in your head, to a presence that speaks for you.',
      labelEmail: 'Email', labelPhone: 'Phone',
      ctaWhatsapp: 'Message us on WhatsApp', ctaEmail: 'Send an email',
      footerNote: 'Ruye Business Services &nbsp;/&nbsp; RUYE — All rights reserved © <span id="year">2026</span>',

      lbTitle: 'Work preview', lbClose: 'Close preview'
    }
  };

  var current = 'ar';

  function t(key) {
    var pack = DICT[current] || DICT.ar;
    return Object.prototype.hasOwnProperty.call(pack, key) ? pack[key] : null;
  }

  function apply(lang) {
    current = DICT[lang] ? lang : 'ar';
    var rtl = current === 'ar';

    var root = document.documentElement;
    root.setAttribute('lang', current);
    root.setAttribute('dir', rtl ? 'rtl' : 'ltr');

    document.title = META[current].title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', META[current].desc);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (v !== null) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-alt'));
      if (v !== null) el.setAttribute('alt', v);
    });

    // سهم الأزرار يتبع اتجاه القراءة
    document.querySelectorAll('.btn__arrow').forEach(function (el) {
      el.textContent = rtl ? '←' : '→';
    });

    // زر التبديل يعرض اللغة الأخرى
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.textContent = rtl ? 'EN' : 'ع';
      toggle.setAttribute('lang', rtl ? 'en' : 'ar');
      toggle.setAttribute('dir', rtl ? 'ltr' : 'rtl');
    }

    // سنة الحقوق (الفوتر يُعاد بناؤه مع كل تبديل)
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}

    document.dispatchEvent(new CustomEvent('ruye:lang', { detail: { lang: current, rtl: rtl } }));
  }

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (stored !== 'ar' && stored !== 'en') stored = 'ar';

  window.RuyeI18n = {
    get lang() { return current; },
    get rtl() { return current === 'ar'; },
    t: t,
    set: apply,
    toggle: function () { apply(current === 'ar' ? 'en' : 'ar'); }
  };

  function init() {
    apply(stored);
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.addEventListener('click', window.RuyeI18n.toggle);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
