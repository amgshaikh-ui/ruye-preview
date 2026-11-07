/* =========================================================
   رؤى لخدمات الأعمال — طبقة الحركة
   بلا اعتماديات · تحترم prefers-reduced-motion
   ========================================================= */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // مؤشّر دقيق فقط: اللمس لا «يمرّ» فوق العناصر، فالتفاعل مع المؤشّر بلا معنى عليه
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* =========================================================
     ١) كشف العناوين كلمةً كلمة
     ملاحظة جوهرية: التقطيع يتم على الكلمات لا الحروف.
     تقطيع الحروف يضع كل حرف في عنصر مستقل فينكسر وصل
     الحروف العربية ويصير «مرحبا» ← «م ر ح ب ا».
     ========================================================= */
  var splittables = Array.prototype.slice.call(document.querySelectorAll('[data-split]'));

  function unwrapWords(host) {
    var words = host.querySelectorAll('.w');
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      w.parentNode.replaceChild(document.createTextNode(w.textContent), w);
    }
    host.normalize();
  }

  function wrapWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        if (!node.textContent.trim()) return;
        var frag = document.createDocumentFragment();
        // احتفظ بالمسافات كعقد نصية مستقلة ليبقى الالتفاف طبيعيًا
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          var w = document.createElement('span');
          w.className = 'w';
          w.textContent = part;
          frag.appendChild(w);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') {
        wrapWords(node);
      }
    });
  }

  function split(el) {
    unwrapWords(el);
    wrapWords(el);
    var words = el.querySelectorAll('.w');
    for (var i = 0; i < words.length; i++) {
      words[i].style.setProperty('--i', i);
    }
    el.classList.add('is-split');
  }

  if (!reduced && splittables.length) {
    splittables.forEach(function (el) {
      split(el);
      // العناوين بلا .reveal (الهيرو) تظهر عند التحميل؛ البقية يتكفّل بها مراقب الظهور
      if (!el.classList.contains('reveal')) {
        requestAnimationFrame(function () { el.classList.add('is-in'); });
      }
    });

    // عند تبديل اللغة يستبدل i18n نص العنوان فتضيع الكلمات — أعد التقطيع فورًا وبلا حركة
    document.addEventListener('ruye:lang', function () {
      splittables.forEach(function (el) {
        el.classList.add('is-instant');
        split(el);
      });
      // أجبر المتصفّح على تطبيق الحالة قبل إعادة تفعيل الانتقالات
      void document.body.offsetHeight;
      requestAnimationFrame(function () {
        splittables.forEach(function (el) { el.classList.remove('is-instant'); });
      });
    });
  }

  /* =========================================================
     ٢) تجاوب العلامات الزخرفية مع المؤشّر
     تُكتب على خاصية translate المستقلة لا على transform،
     لأن transform محجوزة لحركة الطفو (floatY) والاثنتان تتركّبان.
     ========================================================= */
  var marks = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

  if (finePointer && !reduced && marks.length) {
    var targetX = 0, targetY = 0, curX = 0, curY = 0, running = false;

    var frame = function () {
      curX += (targetX - curX) * 0.06;   // تتبّع متأخّر = إحساس بالثِقل
      curY += (targetY - curY) * 0.06;

      marks.forEach(function (el) {
        var depth = parseFloat(el.getAttribute('data-parallax')) || 12;
        el.style.translate = (curX * depth).toFixed(2) + 'px ' + (curY * depth).toFixed(2) + 'px';
      });

      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001) {
        requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    window.addEventListener('pointermove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;    // ‎-1..1
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });
  }

  /* =========================================================
     ٣) أزرار تنجذب للمؤشّر
     ========================================================= */
  if (finePointer && !reduced) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        // translate لا transform: الأخيرة مشغولة بـ ‎:hover{translateY(-2px)}
        btn.style.translate = (dx * 5).toFixed(2) + 'px ' + (dy * 4).toFixed(2) + 'px';
      }, { passive: true });

      btn.addEventListener('pointerleave', function () { btn.style.translate = ''; });
      btn.addEventListener('blur', function () { btn.style.translate = ''; });
    });
  }

  /* =========================================================
     ٤) شريط تقدّم القراءة
     مؤشّر موضع لا زخرفة، فيعمل حتى مع تقليل الحركة.
     ========================================================= */
  var bar = document.getElementById('progress');

  if (bar) {
    var update = function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = 'scaleX(' + Math.min(Math.max(ratio, 0), 1).toFixed(4) + ')';
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
})();
