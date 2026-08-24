# Cal Pac Painting of Nevada — website redesign

A complete, ready-to-publish static site for **Cal Pac Painting of Nevada, Inc.** (Las Vegas, NV),
built by **Digital Horizon** as a spec redesign of [calpac.us](https://calpac.us).

> **Status: pitch / spec work.** Cal Pac has not commissioned or approved this. Nothing here should be
> published under their name until they sign off — see **Pre-publish TODOs** at the bottom.

---

## Run it

No build step, no dependencies. Open `index.html`, or serve the folder:

```bash
python -m http.server 8000
```

---

## Pages

| File | Purpose | Primary keyword target |
|---|---|---|
| `index.html` | Home | painting contractors Las Vegas |
| `commercial.html` | Commercial & industrial | commercial painting contractors Las Vegas |
| `hoa-painting.html` | HOA & community associations | **HOA painting Las Vegas** |
| `residential.html` | Residential interior/exterior | house painters Las Vegas |
| `projects.html` | Project portfolio (12 real jobs) | — |
| `about.html` | Company, leadership, crew, community | — |
| `contact.html` | Contact + estimate request | — |

Plus `robots.txt` and `sitemap.xml`.

### Why HOA gets its own page
SERP-tested on 2026-08-21: **"HOA painting Las Vegas" returns zero directories in the top 8** — every
result is a contractor site, and one ranking slot is an expired domain now serving spam. It is the
highest-value, lowest-competition term in this market, and Cal Pac already does HOA and REO work.
By contrast, "interior/exterior house painters Las Vegas" is dominated by Yelp, Thumbtack, HomeAdvisor
and Houzz, so residential is deliberately *not* the lead.

---

## The design

**Concept: "the straight line."** Precision, masked edges, mirror symmetry — the things a painting
contractor is actually selling.

**Why light blue.** Every Las Vegas painting competitor was screenshotted and colour-sampled. Red is
the most contested hue (4 competitors, including two commercial specialists), so leaving Cal Pac's
legacy red is defensible on competitive grounds, not just taste. Light blue is claimed by exactly one
firm — Unforgettable Coatings (#00aeee) — and only as a small hot accent. **Not one competitor runs a
light ground.** So this site owns light blue as a *dominant, airy surface system* rather than a button
colour, which is structurally unique in this market.

### Palette — AA-verified by math, on every band and every state

| Token | Hex | Role | Contrast on paper |
|---|---|---|---|
| `--ink` | `#0A2740` | headings, body | 14.85 |
| `--muted` | `#2E4A61` | secondary text | 9.01 |
| `--blue` | `#115C8D` | links, primary fill | 6.96 (white on it: 7.14) |
| `--blue-hover` | `#0C4569` | hover — **darkens** | 9.87 |
| `--clay` | `#A34420` | accent, CTA fill | 6.00 (white on it: 6.17) |
| `--clay-hover` | `#873516` | hover — **darkens** | 8.01 |
| `--sky` | `#8FCBEA` | **decoration/large fills only** — never small text | ink on it: 8.64 |
| `--sky-tint` | `#E6F3FB` | pale band | — |
| `--sand` | `#EFE3D6` | warm alternating band | — |
| `--paper` | `#FBFCFD` | base ground | — |

Nothing ships within 0.1 of the 4.5 threshold. The dark `--ink` band and the easter-egg end state were
both audited separately; all pass. `--sky` is deliberately restricted to surfaces and decoration
because it fails as small text — that restriction is load-bearing, don't relax it.

### Type
**Archivo** (variable, width + weight axes) for display, **Hanken Grotesk** for body — both
**self-hosted** in `assets/fonts/`. No Google Fonts request, no external dependency, renders offline.
Verified rendering by canvas `measureText` width delta (Archivo 59.4px, Hanken 84.5px against
fallback), with a deliberately fake family as a control. Note: `document.fonts.check()` returned
**true** for the nonexistent family — it is not proof, and was not trusted.

### Motion (GSAP)

The site carries a scroll-orchestrated motion layer (`motion.js`) built on **GSAP 3.15 +
ScrollTrigger + SplitText, vendored into `assets/js/`** — no CDN, so the "zero external runtime
requests" guarantee still holds. GSAP's license permits vendoring in client work, no attribution
required. Concept: **everything moves the way a painter works** — taped edges, one clean pass,
straight lines drawn straight.

- **Hero**: image settles from a slow zoom while the headline is revealed line-by-line from behind
  a mask (a straightedge pass); the credentials rail slides up and its numbers **count** (55 →
  $750,000). SplitText DOM is reverted after the entrance, so a11y/SEO see the original markup.
- **"The line" is scroll-driven**: on desktop a barely-visible ghost of the finished 1971→2026
  timeline sits behind (the penciled layout), and scroll drags a clip front across the real one,
  painting rule, ticks, years and text into full visibility in place — dots pop the moment the
  front crosses them (in-flow scrub, no pinning — the band is deliberately compact and sits
  directly beneath the hero's credential rail). The following section's heading is parked
  (`motion-static`) — it never animates, it's simply settled in its normal position when you
  reach it. On mobile it's a simple reveal; reduced-motion and no-JS never get a ghost layer.
- **Paint-in reveals**: nothing slides over the photos. Each one starts as a primer coat —
  desaturated under a sky-tint wash with the site's grain — and one clean pass paints the full
  color in: a clipped full-color layer sweeping behind a clay wet edge. Media left of the page's
  center line paints L→R, right of it R→L (outer boxes lead), so reveals converge on the
  layout's center seam. Helper nodes are removed on completion and inline styles cleared, so the
  CSS hover zooms keep working.
- **Scroll progress** is a 3px paint line filling across the top of the viewport.
- Interior pages get the same system (masked `pagehead` intro, section choreography, counters).

Safety contracts, all verified headlessly (see table below):

- Every pre-hide style sits inside a `prefers-reduced-motion: no-preference` block **and** is
  gated on `html.js` — reduced-motion and no-JS visitors get the complete page instantly, with
  the counters' final values and zero injected elements.
- A 3-second inline failsafe (`motion-fail`) force-reveals everything if GSAP ever fails to boot,
  and any exception in `motion.js` triggers the same path immediately.
- Transforms + opacity only; scrubbed tweens run `ease: 'none'`; one motion library per page.

### Easter egg
Type **C-O-A-T** anywhere (or the Konami code, or tap the logo three times) and a roller sweeps a
fresh coat across the page, repainting the entire site in the inverse colourway. Type it again to
strip it back. Reduced-motion safe (skips the sweep, keeps the flip). There's a styled `console.log`
hint. Both colour states are AA-audited.

---

## Imagery — what's real and what isn't

**This matters for the pitch. Be straight with the client about it.**

- **The client's own project photos are real** — all 12 tiles on `projects.html` are Cal Pac's
  archive photography, crawled from their live site. Real named jobs: Bank of America, Capital One,
  Chase, Harry Reid Terminal 3, Green Valley HS, Parsons Elementary, Brooks Brothers, Fogo de Chão,
  Pita Pit, The Jewelers, Turnberry Place, One Las Vegas.
- **The team photos are real** — the crew shot and six staff headshots are theirs.
- **The hero and section bands are generated** (FLUX 1.1-pro-ultra, hero upscaled 2× with Topaz High
  Fidelity V2). This was **necessary, not a shortcut**: their largest project photo is 955×636 and
  their largest file of any kind is 1100×598. A retina full-bleed hero needs ~2560px+. Upscaling
  their archive 3× would visibly mush.
- **Nine images from the old site were deliberately NOT reused** — they are licensed stock, not Cal
  Pac's work, and no licence transfers to us. One of them (a "graffiti removal" shot) isn't even Las
  Vegas.
- **No fabricated proof anywhere.** No star ratings, no review counts, no invented certifications, no
  third-party logo wall. Projects are named as work performed — never as endorsements.

---

## Honesty guardrails held throughout

- The **NAHB "second in the nation" claim** is presented as *Cal Pac's own claim*, never as
  unqualified fact. A 2010 KB HOME letter independently references their NAHB certification.
- The **$750,000 bid limit** is stated as a capability, never as "the biggest" — it isn't. AllPro
  states $9M and American Graffiti states $850,000.
- **Financing** is mentioned as available; no rates or terms are stated.
- All six testimonials are **verbatim** from the client's existing site, attributed to the real people
  who wrote them.

---

## Technical

- Semantic landmarks, one `<h1>` per page, skip link, visible focus rings, keyboard-operable nav.
- Every `<img>` has `alt`, `width` and `height` (CLS = 0). Responsive `srcset` on all generated art.
- One `@graph` JSON-LD block per page. `HousePainter` (the most specific valid schema.org subtype)
  declared once on the homepage; every other page references it by `@id`. `Service`, `FAQPage`,
  `AboutPage`+`Person`, `ContactPage`, `BreadcrumbList` per page type. FAQ schema is byte-identical
  to the visible DOM — verified by diff. **No `AggregateRating`/`Review`** (self-serving markup;
  Google ignores it and it risks a manual action).
- Geo coordinates (36.16137, -115.15344) geocoded from the real address via OpenStreetMap.
- Verified at 1440 and a **true 390** viewport (iframe harness — headless Chromium clamps at ~492px).
  All 7 pages: `scrollWidth` exactly 390, zero horizontal overflow.

### Verification actually run
| Check | Result |
|---|---|
| All 7 pages: schema parses, one `@graph`, no Review/AggregateRating | pass |
| FAQ schema ↔ DOM parity | pass |
| Dead links / missing anchors (incl. cross-page) | 0 |
| `<img>` without alt / without dimensions | 0 |
| 390px horizontal overflow | 0 real (3 flagged = intentional off-screen honeypot) |
| Contrast, base state + dark band + easter-egg state | 0 fails |
| Fonts render (measured, with known-bad control) | pass |
| External runtime requests | 0 |
| Motion: desktop end-states (hero, pinned line scene 0→0.51→1.00, wipes, counters, no `.reveal` left hidden) | pass |
| Motion: reduced-motion = instantly complete page, no injected elements, no counting | pass |
| Motion: mobile 390px (no pin, no overflow, all content resolves) | pass |
| Motion: no-JS (nothing pre-hidden) + subpage intro + SplitText DOM reverted | pass |

---

## Pre-publish TODOs (client input required)

1. **Confirm the rebrand.** This proposes moving Cal Pac from red to light blue. That is a real brand
   decision and theirs to make. The legacy red mark is preserved in the asset library.
2. **A real photo shoot** is the single highest-value thing they could supply — there is no
   publishable photo of a Cal Pac crew or branded truck actually working. The generated hero is good,
   but their own crew on their own job would be better.
3. **Unwatermarked before/after originals.** The four on the old site are 525px with a logo bar burned
   into the pixels — unusable.
4. **Full-resolution originals of the project photos**, if the photographer's files still exist. The
   crawled versions are WordPress-resized derivatives (851–955px), which caps them at card size.
5. **Confirm hours** (Mon–Fri 7:30am–3:30pm, from YellowPages) against the Google Business Profile.
6. **Confirm the NAHB certificate** and current financing terms.
7. **Google Business Profile audit** — no GBP rating/review count could be confirmed. This is the #1
   local ranking lever and should be step one of any engagement.
8. **Verify the social profiles are still active** before the `sameAs` links go live.
9. **Wire the estimate form to a real endpoint.** It currently composes a `mailto:` — honest and
   functional on static hosting, but a proper form handler (or the existing CMS) is better.
10. **A vector of the logo.** The mark here is newly authored SVG; if they hold an AI/EPS of the
    original, it should inform the final mark.
11. `calpacpainting.com` does **not** resolve — the live domain is `calpac.us` only. Worth raising.

---

Built by [Digital Horizon](https://digitalhorizon.dev) · Carson City, NV
