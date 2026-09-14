# CLAUDE.md — Milkim landing page

Project memory for every future session. Read this before writing any code.
Nothing in here is a suggestion.

---

## 1. Client brief

**Milkim** — a single-master permanent makeup studio in Omsk, Russia.

- **Services:** brows, lips, inter-lash line, correction / cover-up of old permanent
  makeup done by other artists.
- **Audience:** Russian-speaking women, 25–55, deciding whether to trust their face to
  this master. In this industry the visual IS the product — the decision is made by
  looking. The page must feel expensive and calm, not loud.
- **Language:** Russian only. Currency: ₽.
- **Traffic:** Yandex Maps, 2GIS, Avito, Yandex Search — predominantly mobile.
- **Deliverable:** one long-scroll landing page, no multi-page site.
- **Materials** (real photos, price list, logo, master bio, address, messenger links) are
  supplied by the studio. Assume nothing about them — see `assets/MANIFEST.md`.

### Decisions already made by the client

| Question | Answer | Consequence |
|---|---|---|
| Hosting | Russian shared hosting (Timeweb / Beget / Reg.ru), FTP or SSH | Build must produce a plain static folder. No serverless functions, no edge runtime, no host-specific features |
| Booking | Messenger + phone links **and** a YCLIENTS / DIKIDI widget | Messenger links are the primary CTA and must work with JS disabled. The CRM widget is third-party and loads **on click only**, never on page load |
| Hero video | Undecided | Hero is designed photo-first. Video is an optional layer that can be dropped in without relayout |
| Content editing | The master edits prices herself — **but the admin UI is deliberately deferred**, not cancelled | No CMS is built now. The enabling condition is mandatory and non-negotiable: prices, services, FAQ and reviews live in `src/content/` as structured data from the very first commit, never hardcoded in markup. A git-based CMS then attaches later as an admin UI over those same files, with zero changes to the page |

### Confirmed studio data — supplied 2026-09-13, do not re-ask

| | |
|---|---|
| Master | Анастасия Мильвиц. 5 years of experience |
| Legal | ИП Мильвиц Анастасия Михайловна · ОГРНИП 326554300075067 · ИНН 553102271152 · ОКВЭД 96.02 · registered 19.08.2026 |
| Address | Омск, ул. Дмитриева, 5/1, 2 этаж. Parking available. No entrance/facade photo — the master gives directions by phone |
| Hours | 10:00–19:00, Mon–Sun, by appointment, usually booked a few days ahead |
| Phone, primary | +7 901 006-93-11 — also carries Telegram and MAX. This is the site owner |
| Telegram | `@ananas_ananasovich` — supplied 2026-09-14. A `t.me/<phone>` link does not open a chat, so the handle is the only usable form |
| MAX | Profile link supplied 2026-09-14, in `site.links.max`. MAX has no chat link for a phone number — a personal link is `https://max.ru/u/<hash>` and only the app produces it (profile → «Пригласить друзей» → «Скопировать ссылку»), so it can never be derived from the number. Clearing that one field removes the MAX button from the hero and contacts again |
| Phone, secondary | +7 906 197-70-77 — publish both |
| Online booking | DIKIDI — https://dikidi.net/833342 |
| VK | https://vk.ru/milvicpm |
| Listings | Avito, 2GIS (`70000001064923408`), Yandex Maps (`205810346343`) |
| Deposit | 500 ₽. Forfeited if cancelled less than 24 hours ahead |
| Promo | "Приведи друга" — 15% off a correction. Currently active, publish it |
| Brand | Full SVG pack (full lockup / emblem / wordmark × gold / black / white / transparent). Screen gold `#F3CF83`, light signature `#F4F1E8`, ground `#000000` |

Answers covering almost all page copy — positioning, what each price includes, procedure
length, the correction / refresh / cover-up distinction, which cover-up cases are accepted,
the full contraindication list, aftercare for brows and for lips, and answers to the standard
fears — are in the studio's "Р0 вопросы и ответы" document on Google Drive.

### Price list — client-confirmed 2026-09-13

| Service | Base | Correction |
|---|---|---|
| Брови | 5 500 ₽ | 3 500 ₽ |
| Губы | 6 000 ₽ | 4 000 ₽ |
| Межресничка | 4 500 ₽ | 2 500 ₽ |
| Перекрытие | 6 500 ₽ | 4 500 ₽ |
| Рефреш | 5 000 ₽ | — |
| Губы + брови | 10 500 ₽ | 7 000 ₽ |
| Губы + межресничка | 9 500 ₽ | 5 500 ₽ |
| Брови + межресничка | 9 000 ₽ | 5 500 ₽ |

The client confirmed this whole table verbatim on 2026-09-13 ("таблица верна"). These are
final figures, not placeholders. They must match the prices published on the studio's Yandex
Maps and 2GIS cards — a mismatch between the card and the site destroys trust on its own.

### Content decisions — client's call, do not re-litigate

- **Only брови and перекрытие get presented.** Губы and межресничка appear as price rows and
  nothing else: no section, no cases, no photography, no copy. The master rarely does lips and
  accepts losing that traffic. Lips therefore ship with zero portfolio by design.
- **Ремувер is not mentioned anywhere on the site.** The master decides case by case from a
  photo whether she can work with old pigment. Do not build a "removal" path.
- **Prices display as the base figure alone** — `5 500 ₽`, not "5 500 ₽ + коррекция". The
  client's position is that clients already know a correction is required, so it is not a
  surprise. Correction prices remain visible as their own column in the price table.
- **Portfolio is accepted as complete.** 11 brow cases, 8 cover-up cases. Case folders follow
  `до / сразу после / зажившие`; several single files are before/after collages. Brow cases 5
  and 6 have no "before" frame — present those as a finished result, never labelled as a pair.
- **Publication consent obtained** for the client photos supplied.
- **Reviews come from mixed platforms.** Label each one with its source; where the platform is
  not visible in the screenshot, put the source in text beside it.
- Adding or replacing a case must never require touching markup: one folder of photos plus a
  short data file per case.
- **Cases carry no written description.** The client decided on 2026-09-13 that none will be
  supplied, so the card is images and a stage caption, nothing else. Do not add a placeholder
  for copy that is not coming.
- **Ten of the nineteen cases are ready-made square collages** supplied by the studio, several
  already carrying the studio's own baked captions. They are captioned "До и после, одним
  кадром" and are never cropped - forcing them into the card ratio would cut into the halves
  being compared, which is the entire content of the image.
- Do not bake captions onto the photos. Text in a raster does not scale between a 220px and a
  680px rendering, is invisible to screen readers, cannot be edited without re-exporting every
  file, and would sit on top of the captions several collages already have. The HTML captions
  are already one consistent style across every card.

### Design decisions — settled 2026-09-13

- **Split theme.** Hero and footer are dark, carrying the brand as it was designed; portfolio,
  prices and everything showing skin sit on the light ground so healed pigment reads truthfully.
- **Hero is a static photo** or a lightweight CSS/SVG animation. Never video — the LCP budget wins.
- **Palette is derived from the brand pack**, whose guide states the colours outright, so there
  is no need to eyedropper the logo. Measured contrast against WCAG 2.2 AA:

| Pair | Ratio | Verdict |
|---|---|---|
| gold `#F3CF83` on black `#000000` | 14.06:1 | passes everything |
| bone `#F4F1E8` on black `#000000` | 18.59:1 | passes everything |
| black `#000000` on bone `#F4F1E8` | 18.59:1 | passes everything |
| **gold `#F3CF83` on white** | **1.49:1** | **fails — never text or an icon on a light ground** |
| **gold `#F3CF83` on bone `#F4F1E8`** | **1.32:1** | **fails — same** |

  So gold is a dark-ground colour only. On the light sections it may appear as a large
  decorative fill or a rule, never as text or a thin glyph. Where a gold-family colour must
  carry text on the light ground, use the darkened `#7A5C27` (5.49:1) — it reads as the same
  metal, and it passes.

### Positioning — decided, per the client's own research

Research V2 (`assets/raw/docs/research-v2-audit.docx`) audits V1 and downgrades "cover-up as
the umbrella brand" to an unproven hypothesis. The working basis is V2's option 2: a broad
brand of natural, face-appropriate permanent makeup with an honest process, plus a **separate
expert branch** for diagnosing old pigment. Practically: the hero speaks about a natural
result and a clear process, and splits two entry paths — first-time and "I already have old
permanent makeup" — with the second leading to assessment by photo rather than instant booking.

Never promise: covering any old pigment, a guaranteed colour, a fixed number of sessions, or
that it is completely painless. Pain is described through the process, in the master's own
words, without the absolute.

---

## 2. HARD RULES — verbatim, never edit, never soften

- NEVER use AI-generated, stock or borrowed images of faces, brows, lips, or any "before/after" as portfolio, results or testimonials. Every image showing a result MUST be a real photo supplied by the studio. This is non-negotiable: it is the studio's entire credibility and a legal risk when advertising a cosmetic procedure.
- AI-generated or stock visuals are allowed ONLY as abstract, non-representational ambience: light, texture, fabric, pigment dispersing in liquid, macro surfaces. Never a person. Never a result.
- Every placeholder MUST be visibly marked as a placeholder in the rendered page until real material replaces it. Never ship a plausible-looking fake price, review, name or photo.
- Mobile-first. Design and verify at 375px before any desktop layout.
- Every animation MUST respect `prefers-reduced-motion` and MUST NOT block first paint. The page must stay fully readable with JavaScript disabled.
- No Instagram/Facebook embeds, pixels or ad scripts — legally unusable for advertising in Russia.
- Accessibility: visible keyboard focus, real contrast ratios, alt text on every meaningful image.

---

## 3. Stack

### Primary

| Layer | Choice |
|---|---|
| Framework | **Astro 7**, `output: 'static'` — zero client JS by default |
| Templating | `.astro` components, no UI framework |
| Styling | Hand-written CSS with custom properties + `@layer`. No CSS framework |
| Images | Astro's built-in `<Image>` / `<Picture>` pipeline (sharp) → AVIF + WebP, `srcset` generated at build |
| Content | Astro Content Collections with Zod schemas (`src/content/`) — CMS-ready |
| Animation | CSS-first (see below) |
| Build output | `dist/` — a plain static folder, uploaded over FTP/SSH |
| Deploy | GitHub Actions: build → upload `dist/` to the Russian host |

### Fallback

**Eleventy 3 + Nunjucks.** Same CSS and animation layer, same deploy path, even lighter.
Chosen only if Astro's build or sharp cannot be installed in the target environment.
Cost: the image pipeline (`eleventy-img`) and the lazy CRM widget must be wired by hand.

### Animation approach — explicit

The full effect catalogue, easing vocabulary and per-effect cost table live in the project
skill **`.claude/skills/milkim-visual/`**. Load it before writing any keyframe, scroll
effect or hover state. Summary:

1. **CSS first.** `@keyframes`, `transition`, and native scroll-driven animations
   (`animation-timeline: view()`), with an `IntersectionObserver` fallback (~1 KB) for
   Safari and older Android.
2. **Motion One** (`motion`, ~5 KB, WAAPI-based) — loaded lazily **after** LCP, and only
   for orchestrated sequences CSS genuinely cannot express.
3. **Lenis** (~3 KB) for smooth scroll — **desktop only**, dynamically imported after
   `load`, skipped under `prefers-reduced-motion`, `pointer: coarse` or `saveData`.
4. **View Transitions API** (built into Astro) for modal and route transitions. No library.
5. Carousels use native **CSS scroll-snap**, not a slider library. The before/after slider
   is an `<input type=range>` driving `clip-path` — keyboard-operable, zero dependencies.
6. Everything sits inside `@media (prefers-reduced-motion: reduce) { }` guards that reduce
   motion to opacity or remove it entirely. Hover effects are gated behind
   `@media (hover: hover) and (pointer: fine)`.
7. `transform` / `opacity` / `clip-path` only. Nothing animates before LCP.

Total JS motion budget with every effect shipped: **~6 KB**.

### Explicitly NOT used, and why

| Rejected | Why |
|---|---|
| React / Next.js / Nuxt | Hydration cost destroys the mobile LCP budget for a page with zero app logic |
| Framer Motion | Requires React |
| GSAP + ScrollTrigger | 70 KB+ for effects CSS now does natively |
| Three.js / WebGL | Hundreds of KB and GPU load on mid-range Android, for ambience |
| Lottie | Heavy runtime; the same look is achievable in SVG + CSS |
| Tailwind | A bespoke "expensive and calm" design is cleaner as tokens + plain CSS; one less build dependency |
| Swiper / Slick / AOS / jQuery / Bootstrap | Replaced by scroll-snap, IntersectionObserver and modern CSS |
| Instagram / Facebook embeds, Meta Pixel, any ad script | Forbidden by the hard rules and legally unusable in Russia |
| Interactive map iframe | Static map image + link to Yandex Maps instead — an iframe alone would blow the weight budget |

---

## 4. Budgets — checkable numbers, not aspirations

### Weight (transferred, compressed, cold cache, 375 px viewport)

| Item | Budget | Hard cap |
|---|---|---|
| First view, everything | **≤ 600 KB** | 750 KB |
| HTML | ≤ 25 KB | 35 KB |
| CSS total | ≤ 30 KB | 40 KB |
| Critical inline CSS | ≤ 10 KB | 14 KB |
| JS on first load | ≤ 40 KB | 60 KB |
| JS before LCP | ≤ 15 KB | 15 KB |
| Render-blocking JS | **0 KB** | 0 KB |
| Fonts | ≤ 120 KB | 150 KB |
| LCP image (hero) | ≤ 180 KB AVIF | 250 KB |
| Hero video, if used | ≤ 1.8 MB, ≤ 8 s, ≤ 1280 × 720 | — |
| Full page, after scrolling to the bottom | ≤ 2.5 MB | 3 MB |
| Requests on first view | ≤ 25 | 30 |
| YCLIENTS / DIKIDI widget | not counted — loads on click only | must never load automatically |

### Core Web Vitals (Lighthouse mobile: Moto G Power class, 4G, 1.6 Mbit/s, RTT 150 ms, CPU ×4)

| Metric | Target | Hard cap |
|---|---|---|
| LCP | ≤ 2.0 s | **2.5 s** |
| CLS | ≤ 0.05 | 0.1 |
| INP | ≤ 150 ms | 200 ms |
| FCP | ≤ 1.5 s | 1.8 s |
| TBT | ≤ 150 ms | 200 ms |
| Lighthouse Performance | ≥ 90 | 85 |
| Lighthouse Accessibility | 100 | 95 |

### Images

- **Formats:** AVIF primary → WebP fallback → JPEG only for `og:image`.
  PNG only for transparency in UI. SVG for logo and icons.
- **`srcset` widths:** 400, 800, 1200, 1600, 2000, 2400 px. DPR capped at 2 —
  no 3× assets.
- Every `<img>` ships explicit `width`/`height` or `aspect-ratio`. No exceptions — this is
  how CLS stays at 0.
- Below the fold: `loading="lazy" decoding="async"`. Hero: `fetchpriority="high"`,
  never lazy.

### Breakpoints (mobile-first, `min-width`)

`375` (baseline, design here first) · `480` · `768` · `1024` · `1280` · `1600`

### Fonts — CHOSEN, do not revisit

The client picked **pairing C** on 2026-09-11 after seeing all four rendered at 375 px.

| Role | Face | Weights | Cyrillic subset, measured |
|---|---|---|---|
| Headings | **Tenor Sans** | 400 | 11.4 KB |
| Body | **Golos Text** | 400, 500 | 13.7 KB |

Total 25.1 KB for Cyrillic; roughly 50 KB once Basic Latin (digits, `₽`, Latin words) is
added — comfortably inside the 120 KB budget, with better than 2× headroom.

Why this pairing: an all-sans setting is rare in Russian beauty, where Prata-style didones
are the default. Tenor Sans reads as calm competence rather than glamour, which is the
right register for correcting other artists' failed work. The cost is that "luxury" is
signalled quietly, so it survives only on disciplined spacing — see the `milkim-visual`
skill.

**Downloaded and in the repo** since 2026-09-13, with the client's approval: six woff2
files in `public/fonts/`, 66.7 KB total, generated into `src/styles/fonts.css` from
`public/fonts/_subsets.json` rather than typed by hand.

Request each weight in its own call. Asking for two weights at once returns the variable
font, which cost 146.6 KB instead of 66.7 KB for the same two faces.

Google's `unicode-range` values are copied verbatim and must not be widened: a character
declared in range but absent from the file renders as `.notdef`, a tofu box, instead of
falling back. **The rouble sign U+20BD is in no subset of either family** and always comes
from a fallback face — verified against the served CSS. It renders acceptably at price
sizes; re-check if the price type ever gets much larger.

Both faces are SIL Open Font License 1.1; see `public/fonts/OFL.txt`.

Rules that still apply: `woff2` only, self-hosted in `public/fonts/`, subset to
Cyrillic + Basic Latin + punctuation, `font-display: swap`, and `<link rel="preload">` for
the single face used above the fold.

### Accessibility

**WCAG 2.2 level AA**, verified with real measured contrast ratios:

- Body text ≥ 4.5:1, large text and UI components ≥ 3:1.
- Visible focus: 2 px outline + 2 px offset, ≥ 3:1 against its background. `:focus-visible`
  is styled, never removed.
- Touch targets ≥ 44 × 44 CSS px.
- Every meaningful image has alt text; decorative and ambience images get `alt=""`.
- Full keyboard operability, logical tab order, skip link to main content.
- Page stays readable and usable with JS disabled and with CSS animations off.

### How these numbers get checked

`node .claude/skills/milkim-visual/scripts/verify.mjs <url>` loads the page at 375 px under
exactly this profile, prints PASS / WARN / FAIL for every row above, and screenshots the
page three ways: normal, `prefers-reduced-motion: reduce`, and JavaScript disabled.
It needs no npm install — it drives the Chromium already present at `/opt/pw-browsers`.

---

## 5. Repository layout

```
CLAUDE.md              this file
.claude/skills/
  milkim-visual/       visual + motion playbook and the budget verifier
assets/
  MANIFEST.md          every media slot the page needs — read before requesting materials
  raw/                 untouched originals from the studio; never shipped as-is
public/                copied to dist/ verbatim: fonts, icons, favicons, video
src/
  assets/images/       source images processed by the build pipeline
  components/          .astro components
  layouts/             page shells
  pages/               routes
  content/             editable content: prices, services, FAQ, reviews (CMS target)
  styles/              tokens, base, layers
```

---

## 6. Naming conventions

- **Files and folders:** `kebab-case`, ASCII only. Never Cyrillic in a filename.
- **Images:** `<section>-<subject>-<NN>[-<state>].<ext>` —
  e.g. `portfolio-brows-03-before.avif`, `studio-interior-02.avif`.
- **Components:** `PascalCase.astro`. **Layouts:** `PascalCase.astro`.
- **Content entries:** `src/content/<collection>/<slug>.md` or `.json`.
- **CSS custom properties:** `--mk-<group>-<name>` — e.g. `--mk-color-ink`,
  `--mk-space-4`.
- **CSS classes:** `.mk-<block>__<element>--<modifier>`.
- **Branches:** `claude/<name>`. **Commits:** Conventional Commits, English.
- **Placeholders:** filename contains `placeholder`, and the rendered element carries
  `data-placeholder="true"` plus a visible badge. Never a silent stand-in.

---

## 7. Content rules

- Russian only. Currency `₽`, written after the number with a non-breaking space:
  `8 000 ₽`. Price ranges as `от 8 000 ₽`.
- Typography: `«ёлочки»` for quotes, em dash `—` for dashes, no ALL CAPS in body text.
- Phone displayed as `+7 913 000-00-00`, linked as `tel:+79130000000`.
- **No medical claims and no guaranteed outcomes.** Permanent makeup is a cosmetic
  procedure: contraindications and the need for a consultation must be stated on the page.
- Required legal blocks: business details (ИП / самозанятый), address, contacts, and —
  if any form collects personal data — a 152-ФЗ privacy notice and an explicit consent
  checkbox.
- Reviews: only real ones, shown as screenshots from Yandex Maps / 2GIS / Avito with the
  source and date visible in the screenshot. Never a retyped, unattributed quote.
- Portfolio entries carry the service name, the interval before the "after" shot, and a
  recorded publication consent from the client.
- No Instagram or Facebook anywhere: no embeds, no icons, no links, no logos.

---

## 8. Environment — verified, do not re-probe

Ubuntu 24.04, bash 5.2, root with passwordless sudo. Verified on 2026-09-11.

| Tool | State |
|---|---|
| Node 22.22 / npm 10.9 / pnpm 10.33 / bun 1.3 / yarn 1.22 | present |
| git 2.43 | present |
| **ffmpeg 6.1.1** (libx264, libvpx-vp9, libaom-av1, libsvtav1, libwebp) | present — encodes video **and** still AVIF/WebP |
| **ImageMagick 6.9.12** | present — **reads HEIC/AVIF**, writes JPEG/PNG/WebP. This is how iPhone originals from the studio get ingested |
| **Chromium 141 + Playwright 1.56** at `/opt/pw-browsers` | present — drives the verifier, no install needed |
| Static servers: `serve`, `http-server`, `python3 -m http.server`, `php` | present |
| prettier 3.8, eslint 10.1, typescript 6.0 (global) | present |
| **astro 7.3.2, sharp 0.35.4 (libvips 8.18.6), motion 13.2.0, lenis 1.3.26** | installed and smoke-tested |
| svgo 4.1.0, @astrojs/check, typescript 6.0 | installed |
| lighthouse | not installed and not needed — the verifier measures the budgets directly |

Toolchain proven end to end on 2026-09-11: a throwaway page built with `astro build`
produced AVIF derivatives with `srcset`, and the verifier measured LCP 216 ms / CLS 0 with
every budget row green. The test page was deleted; only config remains.

Image pipeline fallback, if `sharp` ever breaks: ingest HEIC/JPEG with ImageMagick, encode
AVIF and WebP derivatives with ffmpeg (`-c:v libaom-av1 -still-picture 1`), and wire
`<picture>` / `srcset` by hand. Slower to author, identical output weight.

Network: outbound HTTPS goes through an agent proxy. Third-party apt PPAs are blocked;
the Ubuntu archives and the npm registry are reachable.

---

## 9. Commands

```bash
npm run dev        # dev server on :4321
npm run build      # static build into dist/
npm run check      # astro + TypeScript diagnostics
npm run serve      # serves dist/ WITH GZIP on :4173 - required before verify
npm run verify     # budgets, reduced-motion, no-JS, screenshots into .verify/
```

**Never measure against `http-server`, `serve` or `python -m http.server`.** None of them
compress, and the budgets in §4 are stated for compressed bytes. Measured uncompressed, the
HTML read 44.2 KB against a 25 KB budget; served the way real hosting serves it, 20.6 KB.

`dist/` is the deployable folder: upload its contents to the host's web root.

---

## 10. Working agreements for future sessions

- Mobile-first is procedural, not stylistic: build and verify 375 px, then widen.
- Never install a dependency, download a font or an asset, or run a network command
  without asking the client first and showing the exact command.
- Never invent content. If material is missing, ship a marked placeholder and say what is
  missing.
- Do not add CI, tests, tooling or abstractions that were not asked for.
- Work only inside this project directory.
- Check every change against the budgets in §4 before calling it done — by running the
  verifier, not by eye.
- Load the `milkim-visual` skill before designing or animating anything.
