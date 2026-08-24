/* Cal Pac Painting — site behaviour
   Boot is readyState-guarded so it runs whether or not DCL has already fired. */
(function () {
  'use strict';

  function boot() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- current year ------------------------------------------------ */
    var yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ---- mobile nav -------------------------------------------------- */
    var toggle = document.getElementById('navtoggle');
    var nav = document.getElementById('nav');
    if (toggle && nav) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        nav.classList.toggle('open', open);
        document.body.classList.toggle('nav-locked', open);  // lock page scroll behind the drawer
      };
      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
          setOpen(false);
          toggle.focus();
        }
      });
    }

    /* ---- masthead shadow on scroll ----------------------------------- */
    var mast = document.getElementById('masthead');
    if (mast) {
      var onScroll = function () { mast.classList.toggle('is-stuck', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---- on-scroll reveals live in motion.js (GSAP) ------------------- */

    /* ---- estimate form (static host: no backend) ---------------------- */
    var form = document.getElementById('estimate-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = form.querySelector('[name="company_website"]');
        if (hp && hp.value) return;              // honeypot: silently drop bots
        if (!form.reportValidity()) return;

        var d = new FormData(form);
        var lines = [
          'Name: ' + (d.get('name') || ''),
          'Phone: ' + (d.get('phone') || ''),
          'Email: ' + (d.get('email') || ''),
          'Property type: ' + (d.get('type') || ''),
          'Service: ' + (d.get('service') || ''),
          '',
          (d.get('message') || '')
        ].join('\n');

        window.location.href = 'mailto:calpacpaintingnv@calpac.us'
          + '?subject=' + encodeURIComponent('Estimate request — ' + (d.get('name') || 'website'))
          + '&body=' + encodeURIComponent(lines);

        var note = document.getElementById('form-status');
        if (note) {
          note.hidden = false;
          note.textContent = 'Opening your email app with the request ready to send. '
            + 'If nothing happens, call (702) 383-5144 or email calpacpaintingnv@calpac.us directly.';
        }
      });
    }

    /* ==================================================================
       EASTER EGG — "the second coat"
       Type C-O-A-T, or the Konami code, and a roller sweeps a fresh coat
       across the whole site, repainting every surface in the inverse
       colourway. Type it again to strip it back.
       ================================================================== */
    var COAT = ['c', 'o', 'a', 't'];
    var KONAMI = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
    var bufC = [], bufK = [], busy = false;

    function repaint() {
      if (busy) return;
      busy = true;
      var on = document.documentElement.classList.contains('second-coat');

      if (reduced) {                       // no sweep, just flip
        document.documentElement.classList.toggle('second-coat');
        toast(on ? 'Back to the original colour.' : 'Second coat on.');
        busy = false;
        return;
      }

      var sweep = document.createElement('div');
      sweep.className = 'coat-sweep';
      document.body.appendChild(sweep);
      // force layout so the animation always starts from the reset position
      void sweep.offsetWidth;
      sweep.classList.add('go');

      setTimeout(function () {             // flip while the wall is covered
        document.documentElement.classList.toggle('second-coat');
      }, 730);
      setTimeout(function () {
        sweep.remove();
        toast(on ? 'Back to the original colour.' : 'Second coat on. Try it again to strip it.');
        busy = false;
      }, 1550);
    }

    var toastEl;
    function toast(msg) {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'coat-toast';
        toastEl.setAttribute('role', 'status');
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = msg;
      void toastEl.offsetWidth;
      toastEl.classList.add('show');
      clearTimeout(toastEl._t);
      toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
    }

    document.addEventListener('keydown', function (e) {
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      var k = (e.key || '').toLowerCase();

      bufC.push(k); if (bufC.length > COAT.length) bufC.shift();
      if (bufC.join('') === COAT.join('')) { bufC = []; repaint(); return; }

      bufK.push(k); if (bufK.length > KONAMI.length) bufK.shift();
      if (bufK.join(',') === KONAMI.join(',')) { bufK = []; repaint(); }
    });

    /* the wink: three taps on the logo also does it */
    var brand = document.querySelector('.brand');
    if (brand) {
      var taps = 0, tapT;
      brand.addEventListener('click', function (e) {
        taps++;
        clearTimeout(tapT);
        if (taps >= 3) { e.preventDefault(); taps = 0; repaint(); return; }
        tapT = setTimeout(function () { taps = 0; }, 600);
      });
    }

    if (window.console && console.log) {
      console.log(
        '%c Cal Pac Painting %c 55 years of getting it right the first time. ',
        'background:#0A2740;color:#8FCBEA;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px',
        'background:#8FCBEA;color:#0A2740;padding:4px 8px;border-radius:0 4px 4px 0'
      );
      console.log('%cFancy a second coat? Type  C O A T  anywhere on the page.', 'color:#A34420;font-weight:600');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
