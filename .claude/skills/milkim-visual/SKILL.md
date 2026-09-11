---
name: milkim-visual
description: Visual and motion playbook for the Milkim permanent-makeup landing page. Load before designing or animating ANY section, before choosing colors, type or spacing, and before writing a single keyframe, transition, scroll effect or hover state. Also covers the verification loop - measuring LCP, CLS, page weight and request count at 375px against the project budgets, and checking reduced-motion and JS-disabled behaviour. Triggers on - hero, animation, motion, scroll effect, parallax, reveal, transition, hover, carousel, before/after slider, gallery, section design, typography, palette, spacing, grain, "make it look expensive", performance check, budget check, Lighthouse, web vitals, LCP, CLS, screenshot at 375.
---

# Milkim — visual and motion playbook

Read `CLAUDE.md` first. The hard rules there outrank everything below. This file is *how*,
not *whether*.

The studio sells a result you look at. Every decision here serves one sentence:
**a woman on a phone, arriving from Yandex Maps, must feel within three seconds that this
master is expensive, calm and safe.** Loud is the failure mode, not boring.

---

## 1. Design language

### Restraint is the aesthetic

Premium in this category reads as: a lot of empty space, few colors, large photography,
small confident type, slow motion. Cheap reads as: gradients on text, hard shadows,
many accent colors, fast bouncy animation, badges and starbursts.

### Palette

- Build on **warm low-chroma neutrals** — bone, sand, clay, taupe, ink. Define them in
  OKLCH so lightness steps are perceptually even.
- **Exactly one accent**, used sparingly: CTA, focus ring, active state. Nothing else.
- Backgrounds are never pure `#fff`; text is never pure `#000`. Both read as cheap on an
  OLED phone.
- Contrast is measured, not eyeballed — see §4. A calm palette fails WCAG easily, and the
  hard rules do not bend for taste.

### Type

- Two families maximum: a **display serif with real Cyrillic** for headings, a neutral
  sans for body. Verify Cyrillic coverage before falling in love with a face — many
  display serifs ship Latin only.
- Strong scale contrast: display 40–72 px on mobile against 16–17 px body. Timid headings
  are what makes a beauty page look like a template.
- Body line length 60–70 characters, line-height 1.6. Headings line-height 1.05–1.15,
  letter-spacing slightly negative.
- Russian typography rules live in `CLAUDE.md` §7 — `«ёлочки»`, em dashes, `8 000 ₽` with a
  non-breaking space.

### Surface and depth

- Depth comes from **large soft gradients and a grain overlay**, never from box-shadows.
- One tileable 512×512 noise PNG at 3–6 % opacity over gradients kills banding and adds
  the "printed" feel.
- Radii: either near-zero (editorial) or generous (soft). Never 4 px — that is the default
  look of an unfinished page. Pick one and hold it.
- Images carry the page. Chrome, borders and dividers recede.

---

## 2. Motion

### Non-negotiables

1. **Nothing animates before LCP.** No entrance animation on the hero image itself. The
   hero *text* may animate; the LCP image paints immediately at final position.
2. **`transform` and `opacity` only.** Never animate `width`, `height`, `top`, `left`,
   `margin` or `filter` on scroll. `clip-path` is allowed and composited in Chromium.
3. **`will-change` is set on animation start and removed on finish**, never left in CSS.
4. Every effect ships a `@media (prefers-reduced-motion: reduce)` branch that degrades to
   a plain opacity fade or to nothing. Never just "faster".
5. Hover effects are gated behind `@media (hover: hover) and (pointer: fine)`. On a phone
   a hover state that sticks is a bug.
6. No infinite animation longer than 6 s without a pause, and none in the viewport by
   default on mobile — it drains battery and reads as a banner ad.
7. All JS-driven motion is imported dynamically **after** `load`, never in the critical
   path. Budget: `CLAUDE.md` §4, 0 KB render-blocking JS.

### The easing vocabulary

Expensive motion is **slow in, slower out**. Use long durations with decelerating curves:

```
--mk-ease-out:   cubic-bezier(0.16, 1, 0.3, 1);    /* the workhorse: reveals, entrances */
--mk-ease-inout: cubic-bezier(0.65, 0, 0.35, 1);   /* state changes, sliders */
--mk-dur-fast:   240ms;   /* hover, focus, small state */
--mk-dur-base:   640ms;   /* reveals */
--mk-dur-slow:   1200ms;  /* hero, parallax, image scale */
```

Anything with a bounce or `elastic` is wrong for this brand. So is anything under 200 ms
for a reveal — it reads as a glitch, not as motion.

### Effect catalogue

Each entry: what it is → how to build it → what it costs.

| # | Effect | Implementation | Cost |
|---|---|---|---|
| 1 | **Hero settle** — image eases from `scale(1.06)` to `1` over 1.2 s | CSS `@keyframes` on a wrapper, *not* on the `<img>`; starts after the image `decode()` resolves so LCP is unaffected | 0 KB |
| 2 | **Line-by-line heading reveal** — lines rise behind a mask | Wrap each line in `span` with `overflow:hidden`, inner span `translateY(100%) → 0`, `stagger 80ms`. Split with ~25 lines of JS, no library | ~0.4 KB |
| 3 | **Scroll parallax** on section imagery | Native `animation-timeline: view()` + `@keyframes` translating 0 → −8 %. `IntersectionObserver` fallback where unsupported | ~1 KB |
| 4 | **Sticky cross-fade** — text column scrolls, image column pins and cross-fades | `position: sticky` + `view()` timeline on opacity | 0 KB |
| 5 | **Reveal on enter** — sections fade up 24 px | One `IntersectionObserver` for the whole page, toggling `[data-reveal]`. Never one observer per element | ~0.6 KB |
| 6 | **Before / after slider** | `<input type=range>` driving a CSS variable that feeds `clip-path: inset()`. Keyboard-operable for free. No library | ~0.5 KB |
| 7 | **Portfolio grid stagger** | Same observer as #5, `transition-delay` from `--i` index | 0 KB |
| 8 | **Horizontal service marquee** | CSS `@keyframes` translate, duplicated track, `animation-play-state: paused` under reduced-motion | 0 KB |
| 9 | **Button hover lift** — 2 px rise + accent wash | `transform` + `background-position`, behind `hover: hover` | 0 KB |
| 10 | **Smooth scroll** — Lenis, **desktop only** | Dynamic import after `load`, skipped when `prefers-reduced-motion`, when `pointer: coarse`, or when `navigator.connection.saveData` | ~3 KB |
| 11 | **Ambient gradient drift** | Two large radial gradients on `::before/::after`, 40 s linear translate, grain on top | 0 KB |
| 12 | **Cross-page / modal transition** | Native View Transitions API, already in Astro. No library | 0 KB |

**Total JS motion budget if every effect ships: ~6 KB.** That is the point of this stack.

### When to reach for `motion`

Only for orchestrated sequences with interdependent timing that CSS cannot express —
typically the hero composition. `import { animate, stagger, inView } from 'motion'`, loaded
lazily. If an effect can be a `@keyframes`, it must be a `@keyframes`.

---

## 3. Mobile first, procedurally

1. Build the section at **375 px** and screenshot it.
2. Only then widen to 768 / 1024 / 1280.
3. A section is not done until it has been seen at 375 px in a real browser. Not imagined.

On mobile specifically: parallax is halved or dropped, smooth scroll is off, marquees are
slower, hero video does not load at all.

---

## 4. Verification loop

`scripts/verify.mjs` drives the Chromium already installed at `/opt/pw-browsers`. It needs
**no npm install** — it resolves the globally installed Playwright.

```bash
# start the dev server or serve dist/, then:
node .claude/skills/milkim-visual/scripts/verify.mjs http://localhost:4321
```

It reports, against `CLAUDE.md` §4:

- LCP, CLS, FCP measured under the exact budget profile
  (375 px, DPR 2, 4G 1.6 Mbit/s, RTT 150 ms, CPU ×4)
- transferred weight split by resource type, and request count
- the same page with `prefers-reduced-motion: reduce`
- the same page with JavaScript disabled
- screenshots of all three into `.verify/`

Every row prints PASS or FAIL against the budget. A section is done when it passes.

Contrast is checked separately and with real numbers — compute the ratio from the two
resolved colors, do not trust a screenshot or a memory of the palette.

---

## 5. Placeholders

Until a real file lands in a slot from `assets/MANIFEST.md`, the element renders a
**visibly marked** placeholder: correct aspect ratio reserved (so CLS stays at 0), a
diagonal-hatch or flat neutral fill, and a readable label naming the slot
(`hero/hero-mobile · 3:4 · ожидается`).

It must be impossible to mistake for real material — that is the whole point of the rule
in `CLAUDE.md` §2. No lorem-ipsum reviews, no sample prices, no stock face.
