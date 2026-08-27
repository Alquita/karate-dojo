---
name: KarateDoMiyazato — Panel del profesor
description: Panel del dojo y tótem de asistencia para KarateDoMiyazato (Okinawa Shorin-Ryu Shidokan).
colors:
  rojo-shidokan: "#D3202A"
  rojo-shidokan-bright: "#E64550"
  sumi: "#171717"
  ground: "#0E0E0F"
  surface: "#1C1B19"
  border: "#2E2C28"
  ink: "#E8E4DA"
  ink-muted: "#9B978E"
  moss: "#5AB87F"
  amber: "#D9A020"
  danger: "#E05252"
typography:
  display:
    fontFamily: "'Shippori Mincho', Georgia, serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  headline:
    fontFamily: "'Shippori Mincho', Georgia, serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.25
  title:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
  numeric:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.1
rounded:
  sm: "8px"
  md: "14px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.rojo-shidokan}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.rojo-shidokan-bright}"
    textColor: "#FFFFFF"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  badge:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  chip-filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  chip-filter-active:
    backgroundColor: "{colors.rojo-shidokan}"
    textColor: "#FFFFFF"
---

# Design System: KarateDoMiyazato — Panel del profesor

## Overview

**Creative North Star: "Tinta y Cinturón"**

The dojo has kept attendance on handwritten sheets for years. This system is that ledger rebuilt with the restraint of Japanese ink painting and the discipline of a swept dojo floor: a near-black ground, warm off-white text, a serif (Shippori Mincho) reserved for the few words that carry weight, and monospaced numerals for everything that has to be counted. Onto that quiet surface, one color is allowed to speak — **Rojo Shidokan**, the red of the federation's seal and of the Sensei's belt in the only photograph in the product. It is never decoration; it marks the thing that matters right now (the primary action, today's date, the student who just checked in).

The system is disciplined but not sleepy. Panels are translucent glass that float on the dark ground; the check-in screen sits over a desaturated, blurred photo of the dojo. Every control has a defined edge and a clear corner, and every state change is felt — a ring that fills from zero, a welcome that blurs into place letter by letter, a card that lifts on hover with a bounce-eased curve. Motion is how the product shows it heard you.

Two audiences share it. Julio, the instructor, reads it like a planilla: dense, scannable, exact. A student at the entrance meets it for three seconds on a tablet: one big field, one number, one legible confirmation. The design serves both without compromise — the same tokens, tuned for distance on one screen and for density on the other.

**Key Characteristics:**
- Near-black ground, off-white ink, one red — Rojo Shidokan is the only chromatic voice on any given screen.
- Shippori Mincho serif for weight and ceremony; IBM Plex Sans for the working text; IBM Plex Mono for every number.
- Translucent glass panels with ambient shadow — layered, not flat, never heavy.
- Belt color is *functional*, not brand: a separate seven-hue system that reads a student's rank at a glance.
- Bounce-eased motion with intent — fills, staggers, welcomes. Nothing decorative, nothing idle.
- Fully theme-flipping: a dark-first `:root` with a complete warm-paper `.light` override.

## Colors

A monochrome dojo — near-black ground, warm off-white ink, graphite borders — pierced by a single disciplined red, with two quiet functional accents for attendance state and exam timing.

### Primary
- **Rojo Shidokan** (`#D3202A` dark theme / `#B3161F` light theme): the federation-seal red. The only expressive color in the system. It carries the primary button (as a gradient into Rojo Shidokan Bright), the active filter chip, today's marker on the timeline, the focus glow on inputs, the eyebrow labels, and the welcome banner. On a student card it appears only as the belt stripe when the student holds a red-adjacent rank.
- **Rojo Shidokan Bright** (`#E64550` dark / `#D3202A` light): the lighter end of the primary gradient (`135deg`, dark→bright). Only ever seen as the top of a red gradient or a hover state; never a standalone fill.

### Secondary
- **Musgo / Moss** (`#5AB87F` dark / `#3D8B5F` light): "present" green. Fills an attendance dot the day a student trained, and the check ✓ inside it. Never used for anything but confirmed attendance.
- **Ámbar / Amber** (`#D9A020` dark / `#C8890A` light): exam-timing accent. The "en 80 días" countdown, the "% cumplida" line on the exam cards. Warns without alarming.

### Neutral
- **Ground / Fondo** (`#0E0E0F` dark / `#FAF8F4` light): the page. Near-black in the dark theme; warm rice-paper in light.
- **Surface / Superficie** (`#1C1B19` dark / `#FFFFFF` light): inset fields, solid cards, group-band's dark half, belt-dot backgrounds.
- **Sumi** (`#171717`, both themes): the true-black accent. The dark half of an alternating group band; a hair darker than Surface, used when a panel needs to read as "ink" rather than "material".
- **Ink / Tinta** (`#E8E4DA` dark / `#1C1B19` light): primary text.
- **Ink Muted** (`#9B978E` dark / `#6B6860` light): secondary text, labels, meta rows, placeholder text, disabled dots.
- **Border / Borde** (`#2E2C28` dark / `#E8E4DA` light): the 1px stroke on every field, card, divider, and dot.
- **Danger** (`#E05252` dark / `#C53030` light): error message text and its 12%-tint background; the "Dar de baja" ghost button. Distinct in hue from Rojo Shidokan so a warning never reads as a call to action.

### The Belt System (functional color, not brand)
Seven kyu hues plus a dan fallback, defined in `src/data/categories.js` as `{bg, fg, border}` triples. `bg` is a soft tint for the badge fill, `fg` is legible text on that tint, `border` is the saturated "true belt" color used for the card's left stripe and the filter dot.

| Cinta | badge bg | badge text | true color (stripe / dot) |
|---|---|---|---|
| Blanco | `#F4F3EF` | `#4A4842` | `#B4B0A5` |
| Amarillo | `#FBEBAF` | `#6B5200` | `#E8B71E` |
| Naranja | `#FBD9BC` | `#8A3D0B` | `#E5751B` |
| Celeste | `#CFE9F7` | `#0F4C68` | `#3EA9DB` |
| Verde | `#CDE9D3` | `#1E5B33` | `#2E9E4F` |
| Azul | `#CBD9F2` | `#1B3B85` | `#2159C4` |
| Marrón | `#E4CDBA` | `#5A3115` | `#8A5230` |
| Dan (todos) | `#26241F` | `#E8C567` | `#0A0A0A` |

### Named Rules
**The One Red Rule.** Rojo Shidokan is the only expressive color on a screen, and it never covers more than ~10% of it. If two things are red, one of them is wrong. Attendance green and exam amber are *state* colors, not accents — they appear only on the element whose state they report.

**The Belt-Not-Brand Rule.** The seven belt hues never touch chrome, buttons, headings, or backgrounds. They live only on the badge, the card's 6px left stripe, and the filter dot. A belt color doing anything else means a student's rank is being faked as decoration.

**The Warning-Is-Not-a-Verb Rule.** Danger red (`#E05252`) sits at a different hue from Rojo Shidokan on purpose. Errors and destructive actions use Danger; they must never borrow the primary gradient.

## Typography

**Display Font:** Shippori Mincho (with Georgia, serif fallback)
**Body Font:** IBM Plex Sans (with system-ui, sans-serif fallback)
**Number Font:** IBM Plex Mono (with ui-monospace, monospace fallback)

**Character:** A Japanese serif built for long-form reading, used here only in short bursts, against a grotesque that is neutral to the point of invisibility. The serif carries ceremony (the dojo name, a student's name, "¡Bienvenido, Lucas!"); Plex Sans carries the work. Plex Mono makes every count — attendance totals, percentages, the ring — read as a measured quantity, not a decorated label.

### Hierarchy
- **Display** (Shippori Mincho, 600, 28px, 1.2): screen titles ("Registrar asistencia", "Alumnos"), the welcome banner. Often animated in word-by-word.
- **Headline** (Shippori Mincho, 600, 22px, 1.25): a student's name on their ficha; the "Planilla de {nombre}" header.
- **Title** (IBM Plex Sans, 600, 16px, 1.3): student-card names, nav brand line (17px), sub-headers inside a ficha.
- **Body** (IBM Plex Sans, 400, 15px, 1.6): default text, form values, notes.
- **Label** (IBM Plex Sans, 600, 11–12px, letter-spacing 0.08em, UPPERCASE): section labels, eyebrows, table headers, the "ESTA SEMANA" under the ring, group-band names. Ink Muted, except the eyebrow which is Rojo Shidokan.
- **Numeric** (IBM Plex Mono, 500, 14–22px): the ring percentage (22px, Rojo Shidokan), attendance totals, "Total" columns in the planilla grid, the animated counters.

### Named Rules
**The Serif Is a Ceremony Rule.** Shippori Mincho appears only on names, titles, and welcomes — never on a paragraph, a value, a button, or a label. If it is doing more than announcing, it is doing too much.

**The Every-Number-Is-Mono Rule.** Any figure a person might compare, add, or track — attendance count, percentage, date total, goal progress — is set in IBM Plex Mono. Counts never sit in the sans stack.

## Layout

A single centered column, `max-width: 1100px`, `padding: 32px 24px 64px`, under a sticky glass nav. The app is a flex column that fills `100dvh`.

**Check-in (Operate, kiosk):** the content is vertically and horizontally centered in a `min-height: calc(100dvh - 160px)` flex box, so the single panel sits at eye level on a wall-mounted tablet. When a result card appears it joins the same centered column with a 28px gap; if the pair overflows, the box grows and the page scrolls rather than clipping. A fixed, full-bleed `::before` carries the dojo photo behind everything.

**Alumnos (Operate, dense):** a two-column grid, `1fr / 380px` — the scrollable student list on the left, a sticky detail panel (`top: 80px`) on the right. Collapses to one column at 900px; the detail panel de-stickies. The list is sectioned by age group, each section led by a full-width color band.

**Planilla (Read, tabular):** a horizontally-scrolling grid inside an `overflow-x: auto` container with its own border and shadow, so a wide month never breaks the page. One row per student (group planilla) or one row total (individual), with a sticky first column.

**Spacing rhythm:** 6 / 10 / 12 / 16 / 20 / 24 / 28 / 32. Cards pad `16–18px`, panels `24–36px`, the section gap between major blocks is `20–28px`.

**Breakpoints:** 900px (Alumnos two-col → one-col), 600px (nav stacks, forms go single-column, exam cards stack, filter rows wrap).

## Elevation & Depth

Layered translucent glass over a dark or photographic ground, with large, soft, low-opacity ambient shadows for float — never hard or directional. Depth reads from three cues at once: the `backdrop-filter: blur(14px)` on a panel, the 1px `--glass-border`, and an ambient shadow. Solid surfaces (`--surface`) are used for the *inset* layer — fields, dots, small data tiles — so the hierarchy is glass-on-top, solid-recessed.

### Shadow Vocabulary
- **xs** (`0 1px 2px rgba(0,0,0,0.15)`): fields, secondary buttons, chips — a barely-there seat.
- **sm** (`0 2px 6px rgba(0,0,0,0.20)`): resting cards, the filter bar, planilla grid.
- **md** (`0 4px 14px rgba(0,0,0,0.28)`): the student detail panel, forms.
- **lg** (`0 8px 28px rgba(0,0,0,0.32)`): the check-in panel and result ficha, card hover.
- **glow-rojo** (`0 4px 18px rgba(211,32,42,0.28)`): the primary button's resting shadow and the active nav/filter pill — the only *colored* shadow in the system.

The `.light` theme swaps all shadow values to `rgba(28,27,25, 0.04–0.14)` — the same scale, an order of magnitude softer, because paper doesn't cast the shadows that a black room does.

### Named Rules
**The Glass-On-Top Rule.** Floating things (panels, cards, the nav) are translucent glass with a border and an ambient shadow. Recessed things (inputs, dots, data tiles) are opaque `--surface` with a border and at most an `xs` shadow. Never a glass input; never a solid floating card.

**The Only-Red-Glows Rule.** Exactly one shadow in the system carries color: `glow-rojo`, under the primary button and the active pill. Every other shadow is neutral black. A colored glow anywhere else is a bug.

## Shapes

Two radii do almost everything: **14px** (`--radius`) for anything panel-scale — cards, the check-in panel, the filter bar, the planilla wrapper, forms — and **8px** (`--radius-sm`) for controls — buttons, inputs, selects, small data tiles, the error box. Fully round (`--radius-pill`, 999px) is reserved for things that are *counts or states*: badges, filter chips, the nav tab pills, the theme toggle, the group-band counter, attendance dots (`50%`).

Borders are universal and hair-thin: every field, card, divider, and dot carries a `1px solid` stroke in `--border` (or `--glass-border` on glass). There is no borderless surface in the system.

Recurring silhouettes: the **6px vertical belt stripe** on the left edge of every student card; the **circle** as the unit of attendance (the timeline dot, the enso ring); the **full-width band** as a group header.

### Named Rules
**The Two-Radii Rule.** 14px for panels, 8px for controls, 999px for counts and states. A 10px or 12px corner does not exist here.

**The No-Naked-Edge Rule.** Every surface has a 1px border. Contrast alone never separates two planes.

## Components

For each: a character line, then shape, color, states, distinctive behavior.

### Buttons
Precise edge, lively response. `10px 20px`, 8px radius, 14px/600, `inline-flex` with a 6px gap for an optional icon, `transition: all 0.25s` on the smooth ease.
- **Primary:** a `135deg` gradient from Rojo Shidokan into Rojo Shidokan Bright, white text, resting `glow-rojo` shadow. Hover lifts `translateY(-1px)` and the glow expands to `0 6px 24px rgba(211,32,42,0.34)`. Active returns to `translateY(0)`. Disabled: `opacity 0.5`, no pointer events.
- **Secondary:** `--surface` fill, `--ink` text, 1px `--border`, `xs` shadow. Hover shifts border and text to Rojo Shidokan and bumps to `sm` shadow — the outline "catches fire" without a fill change.
- **Danger-ghost:** Danger-red text, no fill, 13px, `6px 12px`. Hover fills with the 12% danger tint. Used for "Dar de baja".

### Chips (belt filter)
The filter bar replaced two native selects with a control that speaks dojo. A **segmented pill** for age group (pills inside a `--surface` track, active pill = red gradient + `glow-rojo`), and a **wrapping chip row** for belts: each chip is a 999px `--surface` pill with a 1px border, a `5px 11px` pad, 12.5px text, and a **9px color dot** filled with that belt's true color. Hover moves the border to Rojo Shidokan; active fills the chip solid Rojo Shidokan with white text. "Todas" is the dot-less reset.

### Cards / Containers
- **Corner:** 14px.
- **Background:** `--glass-bg` with `backdrop-filter: blur(14px)` and a 1px `--glass-border`.
- **Shadow:** `sm` at rest, `lg` on hover (student card), paired with `translateY(-3px)` on a bounce ease.
- **Signature — the belt stripe:** every student card carries a 6px-wide absolutely-positioned bar down its left edge, `overflow: hidden` on the card clipping it to the radius, filled with the student's belt true-color. Card left padding is `22px` to clear it.
- **Internal padding:** `16–18px` cards, `24–36px` panels.

### Inputs / Fields
- **Style:** `--surface` fill, 1px `--border`, 8px radius, `xs` shadow, `10px 14px` pad, 14px text. Full width by default.
- **Focus:** border shifts to Rojo Shidokan and a `0 0 0 3px` ring in `--indigo-glow` (18% red) blooms — the same focus signature on inputs, selects, and today's timeline dot.
- **Placeholder:** `--ink-muted`.
- **Error:** message sits below in Danger text on a `--danger-soft` background, 8px radius, `10px 14px`.
- The document field on the check-in screen is the same input scaled up for kiosk distance and given `autoFocus`.

### Navigation
A sticky top glass bar, `14px 28px`. Left: the sakura logo (`public/logo.png`, 44px tall) with a black `drop-shadow` that grows on hover, beside the name in Shippori Mincho 17px and "Panel del profesor" in 12px Ink Muted. Center: two tab pills in a `--glass-border` track; the active tab is a red gradient with `glow-rojo`. Right: a 36px round theme toggle (sun/moon), Ink Muted, filling with `--glass-border` on hover. On scroll past 16px the bar gains a bottom border and `sm` shadow. Stacks vertically under 600px.

### Signature — Enso Progress Ring
A 128px SVG ring reporting weekly-goal progress. A `--border` track and a Rojo Shidokan arc (`stroke-linecap: round`, rotated `-90deg` to start at 12 o'clock). On mount it waits ~450ms (for the card's fade-in) then animates the `stroke-dashoffset` and the centered IBM Plex Mono percentage from 0 to the real value together over ~1.4s with an ease-out-cubic curve driven by `requestAnimationFrame`. "ESTA SEMANA" sits under the number in 10px uppercase Ink Muted. Re-mounts (via React `key`) on every new check-in, so the fill replays.

### Signature — Week Timeline
A centered row of seven dots, Mon–Sun. Each dot is 28px, `--surface` fill, 2px `--border`, and enters on a staggered `dotEnter` bounce (`scale(0.4)` → `1`, 60ms apart). A day trained: dot fills Moss with a white ✓. A future day: `opacity 0.35`, dashed border. Today: border goes Rojo Shidokan with the 3px red focus ring — the same "you are here" signal as an input focus.

### Signature — Group Band
The full-width header above each age-group section in the Alumnos list. `8px 14px`, 8px radius, 12px/700 uppercase white label with a translucent-white pill counter on the right. Bands alternate: odd = `135deg` Rojo Shidokan → Rojo Shidokan Bright gradient with `glow-rojo`; even = `135deg` Sumi → `#2c2c2c`. Red and ink, taking turns.

### Signature — Welcome Banner
On a successful check-in, above the result ficha: a 52px red-gradient circle with a white ✓ that pops in on a bounce ease, then "¡Bienvenido/a, {nombre}!" in 28px Shippori Mincho Rojo Shidokan, animated word-by-word (BlurText), then "Asistencia registrada · {fecha}" in 12px uppercase Ink Muted. The rest of the ficha fades in 0.35s behind it.

## Do's and Don'ts

### Do:
- **Do** keep Rojo Shidokan under ~10% of any screen and reserve it for the one action or marker that matters now.
- **Do** set every countable figure in IBM Plex Mono (`--font-mono`); keep Shippori Mincho for names, titles, and welcomes only.
- **Do** give floating surfaces glass (`--glass-bg` + `backdrop-filter: blur(14px)` + `--glass-border` + ambient shadow) and recessed surfaces opaque `--surface` with a 1px border.
- **Do** put a 1px border on every plane — `--border` on solids, `--glass-border` on glass.
- **Do** use the two-radii scale: 14px panels, 8px controls, 999px counts/states.
- **Do** make state changes felt — fill the ring from zero, stagger the timeline dots, blur the welcome in — on `--ease-bounce` or a rAF ease-out, and honor `prefers-reduced-motion` (the global reset already clamps durations).
- **Do** route belt color only to the badge, the 6px card stripe, and the filter dot.
- **Do** carry every color through both themes: define it on dark `:root`, override it under `.light`.
- **Do** design the check-in for a 3-second glance at tablet distance and the Alumnos views for planilla density.

### Don't:
- **Don't** let two things be red on the same screen, or give Danger red the primary gradient.
- **Don't** put a colored shadow anywhere except `glow-rojo` under the primary button and the active pill.
- **Don't** use a 10px or 12px corner, or ship a borderless surface.
- **Don't** let Shippori Mincho touch a paragraph, a value, a button, or a label.
- **Don't** use belt hues for chrome, headings, buttons, or backgrounds.
- **Don't** let it read as a fitness tracker (neon rings, workout-blue, Apple-Watch activity dials) or a corporate SaaS dashboard (infinite grey tables, blue sidebar, flat cold metric cards). This is a dojo ledger.
- **Don't** add motion that doesn't report something — no idle loops, no parallax, no decorative drift.
- **Don't** clip the check-in result card by pinning heights; let the centered column grow and the page scroll.
