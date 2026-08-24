/* Cal Pac Painting — motion layer (GSAP 3)
   Concept: everything moves the way a painter works — taped edges, one clean
   pass, straight lines drawn straight. Measured, never bouncy.

   Contracts this file honors:
   - Self-contained: vendored GSAP in assets/js/, zero external requests.
   - prefers-reduced-motion: every pre-hide style in styles.css lives inside a
     no-preference media block, and every tween here registers through
     gsap.matchMedia() — reduced-motion users get the complete page instantly.
   - Failure-safe: the inline <head> failsafe adds `motion-fail` after 3s
     unless this file boots; `motion-fail` CSS forces every pre-hidden element
     visible. Any exception here triggers the same path immediately.
   - Visibility rule: elements pre-hidden by CSS are animated with to()/fromTo()
     (never from(), whose end state is the current — hidden — one). from() is
     reserved for elements that are NOT pre-hidden by CSS.
   - Transforms + opacity only; scrubbed tweens use ease:'none'. */
(function () {
  'use strict';

  var d = document, root = d.documentElement;

  function fail() {
    if (window.__mfs) clearTimeout(window.__mfs);
    root.classList.add('motion-fail');
    var i, els = d.querySelectorAll('.reveal');
    for (i = 0; i < els.length; i++) els[i].classList.add('in');
  }

  function boot() {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitText) { fail(); return; }

    gsap.registerPlugin(ScrollTrigger, SplitText);
    if (window.__mfs) clearTimeout(window.__mfs);

    var mm = gsap.matchMedia();
    var MOTION = '(prefers-reduced-motion: no-preference)';
    var DESK = MOTION + ' and (min-width: 961px)';
    var HAND = MOTION + ' and (max-width: 960px)';

    /* Owned by dedicated choreography below — the generic reveal skips these. */
    var OWNED = '.tl, .section-head, .split__body, .tile, .split__media, .crew__media, .faces';

    /* ================================================================
       BASE — every width
       ================================================================ */
    mm.add(MOTION, function () {

      /* -- scroll progress: a paint line filling across the top ------ */
      var bar = d.createElement('div');
      bar.className = 'scrollline';
      bar.setAttribute('aria-hidden', 'true');
      d.body.appendChild(bar);
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true }
      });

      /* -- generic staggered reveals (replaces the old IO pass) ------ */
      var reveals = gsap.utils.toArray('.reveal').filter(function (el) {
        return !el.matches(OWNED);
      });
      ScrollTrigger.batch(reveals, {
        start: 'top 88%',
        once: true,
        onEnter: function (els) {
          gsap.to(els, {
            opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
            stagger: 0.09, overwrite: true
          });
        }
      });

      /* -- roller-pass wipe reveals on media ------------------------- */
      var veils = [];
      gsap.utils.toArray('.door__media, .split__media, .crew__media, .tile')
        .forEach(function (box) {
          box.classList.add('has-wipe');
          var img = box.querySelector('img');
          var veil = d.createElement('div');
          veil.className = 'wipe-veil';
          veil.setAttribute('aria-hidden', 'true');
          box.appendChild(veil);
          veils.push(veil);

          var tl = gsap.timeline({
            scrollTrigger: { trigger: box, start: 'top 82%', once: true }
          });
          tl.set(box, { opacity: 1, y: 0 })
            .fromTo(veil, { xPercent: 0 }, { xPercent: 101, duration: 0.9, ease: 'power4.inOut' });
          if (img) tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0.1);
        });

      /* -- counters: creds rail + stat blocks ------------------------ */
      gsap.utils.toArray('.creds__n, .stat b').forEach(function (el) {
        var m = el.textContent.match(/^([^0-9]*)([\d,]+)(.*)$/s);
        if (!m || m[1].indexOf('#') > -1) return;   /* license numbers are IDs, not quantities */
        var end = parseInt(m[2].replace(/,/g, ''), 10);
        if (!isFinite(end) || end === 0) return;
        var grouped = m[2].indexOf(',') > -1;
        var state = { v: 0 };
        gsap.to(state, {
          v: end, duration: 1.2, ease: 'power2.out',
          /* creds sit inside the hero entrance — hold until the rail lands */
          delay: el.closest('.creds') ? 1.05 : 0,
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
          onUpdate: function () {
            var n = Math.round(state.v);
            el.textContent = m[1] + (grouped ? n.toLocaleString('en-US') : n) + m[3];
          }
        });
      });

      /* -- crew faces cascade ---------------------------------------- */
      var faces = d.querySelector('.faces');
      if (faces) {
        gsap.set(faces, { opacity: 1, y: 0 });
        gsap.from(faces.children, {
          y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: faces, start: 'top 86%', once: true }
        });
      }

      /* -- CTA band (below the fold on every page) ------------------- */
      var cta = d.querySelector('.cta');
      if (cta) {
        var ctaImg = cta.querySelector('.cta__media img');
        if (ctaImg) {
          gsap.set(ctaImg, { scale: 1.16 });
          gsap.fromTo(ctaImg, { yPercent: -5 }, {
            yPercent: 5, ease: 'none',
            scrollTrigger: { trigger: cta, start: 'top bottom', end: 'bottom top', scrub: true }
          });
        }
        var ctaTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: cta, start: 'top 74%', once: true }
        });
        var ctaEb = cta.querySelector('.eyebrow'), ctaH = cta.querySelector('h2'),
            ctaP = cta.querySelector('.shell > p'), ctaRow = cta.querySelectorAll('.cta__row > *');
        if (ctaEb) ctaTl.from(ctaEb, { y: 18, opacity: 0, duration: 0.6 }, 0);
        if (ctaH) ctaTl.from(ctaH, { y: 30, opacity: 0, duration: 0.9 }, 0.08);
        if (ctaP) ctaTl.from(ctaP, { y: 24, opacity: 0, duration: 0.8 }, 0.22);
        if (ctaRow.length) ctaTl.from(ctaRow, { y: 20, opacity: 0, duration: 0.7, stagger: 0.09 }, 0.34);
      }

      /* cleanup if the media condition stops matching */
      return function () {
        bar.remove();
        veils.forEach(function (v) { v.remove(); });
      };
    });

    /* ================================================================
       DESKTOP — pinned timeline scene + parallax
       ================================================================ */
    mm.add(DESK, function () {

      /* hero image: cinematic settle, then parallax drift on scroll.
         Ends at 1.12 so the ±4.5% drift never exposes an edge. */
      var heroImg = d.querySelector('.hero__media img');
      if (heroImg) {
        gsap.fromTo(heroImg, { scale: 1.18 }, { scale: 1.12, duration: 2.4, ease: 'power2.out' });
        gsap.fromTo(heroImg, { yPercent: -4.5 }, {
          yPercent: 4.5, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('.hero__copy', {
          yPercent: -16, opacity: 0.25, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: '88% top', scrub: true }
        });
      }

      /* THE LINE — the 1971→2026 rule draws itself under scroll control;
         each milestone (and its dot/tick, via --tl-dot) pops exactly as the
         leading edge reaches it. Pinned when the section fits the viewport,
         otherwise scrubbed in normal flow — never a clipped pin. */
      var tlWrap = d.querySelector('.tl');
      var section = d.querySelector('.timeline');
      if (tlWrap && section && d.querySelector('.tl__rule')) {
        gsap.set(tlWrap, { opacity: 1, y: 0 });
        var fits = section.offsetHeight + 32 <= window.innerHeight;
        var scene = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: fits
            ? { trigger: section, start: 'top top', end: '+=950', scrub: 0.5, pin: true, anticipatePin: 1 }
            : { trigger: section, start: 'top 62%', end: 'bottom 92%', scrub: 0.5 }
        });
        scene.fromTo('.tl__rule', { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: 4 });
        gsap.utils.toArray('.tl__item').forEach(function (item, i) {
          scene.fromTo(item, { y: 34, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, i + 0.22)
            .fromTo(item, { '--tl-dot': 0 },
              { '--tl-dot': 1, duration: 0.4, ease: 'back.out(2.2)' }, i + 0.28);
        });
      }
    });

    /* ================================================================
       SMALL SCREENS — hero settles crisp, timeline reveals simply
       ================================================================ */
    mm.add(HAND, function () {
      var heroImg = d.querySelector('.hero__media img');
      if (heroImg) gsap.fromTo(heroImg, { scale: 1.16 }, { scale: 1, duration: 2.2, ease: 'power2.out' });

      var tlWrap = d.querySelector('.tl');
      if (tlWrap) {
        gsap.to(tlWrap, {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: tlWrap, start: 'top 88%', once: true }
        });
      }
    });

    /* ================================================================
       TYPE — masked line reveals, built once fonts have settled.
       Fonts are self-hosted and preloaded, so this normally resolves in
       well under 200ms; the race caps the wait either way.
       ================================================================ */
    var fontsReady = (d.fonts && d.fonts.ready)
      ? Promise.race([d.fonts.ready, new Promise(function (r) { setTimeout(r, 1200); })])
      : Promise.resolve();

    fontsReady.then(function () {
      try {
        mm.add(MOTION, function () {
          var splits = [];
          function splitLines(el) {
            var s = new SplitText(el, { type: 'lines', mask: 'lines' });
            splits.push(s);
            return s;
          }
          function safeRevert(s) { try { s.revert(); } catch (e) { /* already reverted */ } }

          /* -- hero headline: revealed like a straightedge pass ------ */
          var heroH = d.querySelector('.hero h1');
          if (heroH) {
            var split = splitLines(heroH);
            var hero = gsap.timeline({
              defaults: { ease: 'power3.out' },
              onComplete: function () { safeRevert(split); } /* restore clean DOM + full text-shadow */
            });
            hero.set(heroH, { opacity: 1 })
              .fromTo('.hero .eyebrow', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.05)
              .from(split.lines, { yPercent: 112, duration: 1.05, stagger: 0.14 }, 0.12)
              .fromTo('.hero__sub', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, '-=0.6')
              .fromTo('.hero__cta > *', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09 }, '-=0.55')
              .fromTo('.creds', { yPercent: 26, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.5');
          }

          /* -- interior page header ---------------------------------- */
          var ph = d.querySelector('.pagehead');
          if (ph) {
            var phH = ph.querySelector('h1');
            var phSplit = phH ? splitLines(phH) : null;
            var intro = gsap.timeline({
              defaults: { ease: 'power3.out' },
              onComplete: function () { if (phSplit) safeRevert(phSplit); }
            });
            var cr = ph.querySelector('.crumbs');
            if (cr) intro.fromTo(cr, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.05);
            if (phSplit) intro.set(phH, { opacity: 1 }, 0)
              .from(phSplit.lines, { yPercent: 112, duration: 0.95, stagger: 0.12 }, 0.12);
            var phPs = ph.querySelectorAll('h1 ~ p');
            if (phPs.length) intro.fromTo(phPs, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.55');
          }

          /* -- section heads: eyebrow → masked h2 → standfirst.
                Children use from(): they are hidden with the parent, whose
                pre-hide is lifted by the leading set(). ------------------ */
          gsap.utils.toArray('.section-head').forEach(function (head) {
            var h2 = head.querySelector('h2');
            var split2 = h2 ? splitLines(h2) : null;
            var tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: { trigger: head, start: 'top 84%', once: true },
              onComplete: function () { if (split2) safeRevert(split2); }
            });
            tl.set(head, { opacity: 1, y: 0 });
            var eb = head.querySelector('.eyebrow');
            if (eb) tl.from(eb, { y: 18, opacity: 0, duration: 0.6 }, 0);
            if (split2) tl.from(split2.lines, { yPercent: 112, duration: 0.9, stagger: 0.1 }, 0.08);
            var ps = head.querySelectorAll(':scope > p');
            if (ps.length) tl.from(ps, { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.3);
          });

          /* -- split bodies (craft band, crew story): text + ticks --- */
          gsap.utils.toArray('.split__body').forEach(function (body) {
            var tl = gsap.timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: { trigger: body, start: 'top 82%', once: true }
            });
            tl.set(body, { opacity: 1, y: 0 });
            var eb = body.querySelector('.eyebrow');
            if (eb) tl.from(eb, { y: 18, opacity: 0, duration: 0.6 }, 0);
            var h2 = body.querySelector('h2');
            if (h2) tl.from(h2, { y: 26, opacity: 0, duration: 0.85 }, 0.08);
            var ps = body.querySelectorAll(':scope > p');
            if (ps.length) tl.from(ps, { y: 22, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.24);
            var ticks = body.querySelectorAll('.ticks li');
            if (ticks.length) tl.from(ticks, { x: -22, opacity: 0, duration: 0.55, stagger: 0.08 }, 0.42);
            var rest = body.querySelectorAll('.stat-row, .btn-row');
            if (rest.length) tl.from(rest, { y: 20, opacity: 0, duration: 0.7 }, 0.55);
          });

          return function () { splits.forEach(safeRevert); };
        });

        ScrollTrigger.refresh();
      } catch (e) {
        fail();
        if (window.console && console.error) console.error('motion layer:', e);
      }
    });
  }

  try {
    if (d.readyState === 'loading') {
      d.addEventListener('DOMContentLoaded', function () {
        try { boot(); } catch (e) { fail(); if (window.console) console.error('motion layer:', e); }
      });
    } else {
      boot();
    }
  } catch (e) {
    fail();
    if (window.console && console.error) console.error('motion layer:', e);
  }
})();
