# AfterAdmit — Design System & Build Playbook

A complete record of every design and engineering decision behind the `aa_v2` app, so the same look, feel and quality can be reproduced in future products.

> **The one-line brief:** pure white, orange + matte black, Geist, hairline borders instead of shadows, generous whitespace, real copy, quiet motion — premium "Silicon Valley SaaS" (Linear / Notion / Vercel), never "vibe-coded".

### How to use this document for any app

| Section | Reusable as-is? | What to change for a new app |
|---|---|---|
| 1 Principles & checklist | ✅ Generic | Nothing |
| 2 Tech stack | ✅ Generic | Nothing |
| 3 Brand | ⚠️ Recipe | Keep the logo *recipe* (rounded square, two-opacity glyph, two-tone wordmark); swap name, glyph and colour |
| 4 Colour system | ✅ Generic | Swap only `primary`, `primary-hover`, `primary-soft` (and chart/ring accents). Space colours (§4.5) are app-specific |
| 5 Typography | ✅ Generic | Nothing |
| 6 Spacing, layout, shape | ✅ Generic | Container widths per page if needed |
| 7 Iconography | ✅ Generic | Icon vocabulary list is app-specific |
| 8 Components | ✅ Generic | Nothing |
| 9 App shell & navigation | ✅ Generic | Nav items, context card, role switcher are app-specific |
| 10 Data visualisation | ✅ Generic | Ring labels/metrics are app-specific |
| 11 Page-by-page | 📘 Worked example | Use as reference patterns (auth split-screen, onboarding wizard, dashboard hero, stepper, timeline rail, feed, settings, admin tables) |
| 12–15 Motion, copy, responsive, a11y | ✅ Generic | Nothing |
| 16 Engineering gotchas | ✅ Generic (Next 16 specific) | Re-check if framework versions change |
| 17 Recipe | ✅ Generic | Follow step by step |

---

## 1. Design principles

1. **Restraint over decoration.** One accent colour (orange) used sparingly; everything else is black, greys and white.
2. **Borders, not shadows.** 1px hairline borders (`#ECECEE`) define surfaces. Shadows only on floating layers (popovers, dialogs, toasts) and as a whisper on hover.
3. **Density like a pro tool.** Base text 13–14px, compact controls (32–36px tall), tight but consistent spacing.
4. **Numbers are first-class.** Every number uses tabular figures; big numbers get tight negative tracking.
5. **Real content.** No lorem ipsum, no emoji soup, believable names, dates, prices and copy.
6. **One primary action per view.** Orange button = the main thing; secondary actions are ink (black), outline or ghost.
7. **Motion is functional.** 150–300ms ease-out transitions; rings fill once; nothing bounces or loops (except one "Today" ping).
8. **Mobile is designed, not squeezed.** Bottom tab bar, bottom sheets, list↔detail navigation, no horizontal overflow.

### The "doesn't look vibe-coded" checklist
- [ ] No gradients on buttons/cards (only subtle blurred glows behind dark panels).
- [ ] No glassmorphism on content; blur only on sticky header (`bg-white/90 backdrop-blur-md`) and overlays.
- [ ] No rainbow badges — status colours only (green/amber/red), everything else neutral or orange-soft.
- [ ] No giant drop shadows; no `rounded-3xl` everything.
- [ ] No centered-hero-card layouts inside the app.
- [ ] No emoji in UI (single exception: 👋 next to the greeting).
- [ ] Every list has hover states, every icon button has an `aria-label`, every empty state is designed.
- [ ] Copy is sentence case, short, specific ("3d overdue", "Due Jun 1", "8 of 35 milestones").

---

## 2. Tech stack (frontend)

### 2.1 Core

| Layer | Package | Version | Role |
|---|---|---|---|
| Runtime | Node.js | 24.x (min 20.9) | Dev/build |
| Framework | `next` | 16.4.0 | App Router, Turbopack (default), Cache Components + Partial Prefetching |
| UI runtime | `react`, `react-dom` | 19.3.0 | Server + Client Components, `use()` for params |
| Language | `typescript` | ^5 (strict) | `PageProps<'/route'>` / `LayoutProps` global helpers |
| Styling | `tailwindcss` + `@tailwindcss/turbopack` | ^4 | CSS-first config via `@theme inline` in `globals.css` (no `tailwind.config`) |
| Animations | `tw-animate-css` | ^1.4 | `animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*` |
| Primitives | `radix-ui` | ^1.7 | Umbrella package: Dialog, DropdownMenu, Popover, Select, Tabs, Tooltip, Switch, Checkbox, RadioGroup, Progress, Avatar, Separator, Label, Slot |
| Variants | `class-variance-authority` | ^0.7 | Button/Badge variant + size APIs |
| Class utils | `clsx` + `tailwind-merge` | ^2 / ^3 | `cn()` helper in `src/lib/utils.ts` |
| Component pattern | shadcn/ui (`shadcn` CLI ^4 installed, components hand-written) | — | Source-owned components in `src/components/ui` |
| Icons | `lucide-react` | ^1.55 | Only icon set |
| Fonts | `geist` | ^1.7 | `geist/font/sans`, `geist/font/mono` (local, no network) |
| Charts | `recharts` | ^3.10 | Area, Bar, Pie; custom SVG for rings/sparklines |
| Toasts | `sonner` | ^2.0 | Global `<Toaster />` in root layout |
| Linting | `eslint` ^9 + `eslint-config-next` 16.4.0 | — | Flat config; React Compiler-era hooks rules (`set-state-in-effect`) |

### 2.2 Install in one go

```bash
npx create-next-app@latest my-app --ts --tailwind --eslint --app --src-dir --import-alias "@/*"
npm i radix-ui class-variance-authority clsx tailwind-merge lucide-react tw-animate-css sonner recharts geist
```

### 2.3 Deliberately not used

- No second component library (no HeroUI/MUI/Chakra) — one visual system.
- No CSS-in-JS, no `tailwind.config.js`, no Framer Motion (CSS transitions + `tw-animate-css` are enough).
- No `next/font/google` (blocked on locked-down networks) — `geist` package instead.
- No state library — React state + one small Context store per area.
- `cn` npm package is installed but unused; the app's own `cn()` from `src/lib/utils.ts` is the one to use.

### 2.4 Quick reference table

| Concern | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | `cacheComponents` + `partialPrefetching` on |
| Language | TypeScript (strict) | |
| Styling | **Tailwind CSS v4** (`@theme inline` tokens in `globals.css`) | + `tw-animate-css` for enter/exit animations |
| Components | **shadcn/ui pattern**, hand-written on the **`radix-ui`** umbrella package | `class-variance-authority`, `clsx`, `tailwind-merge` (`cn()` helper) |
| Icons | **lucide-react** | Never mix icon sets |
| Fonts | **`geist`** npm package (Geist Sans + Geist Mono, local files) | Avoids Google Fonts network fetch |
| Charts | **Recharts 3** for area/bar/pie; **custom SVG** for activity rings & sparklines | |
| Toasts | **sonner** | `position="bottom-right"` |
| Data | Hardcoded TS modules in `src/lib/*` | Click-through MVP |

No HeroUI, no second component library — one system only.

---

## 3. Brand

### 3.1 Logo mark
A 32×32 orange rounded square with two forward chevrons ("steps forward / progress").

```svg
<svg viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#FF4500"/>
  <path d="M8 10.5h5.2l3.3 5.5-3.3 5.5H8l3.3-5.5L8 10.5Z" fill="#fff" fill-opacity=".55"/>
  <path d="M14.6 10.5h5.2l3.3 5.5-3.3 5.5h-5.2l3.3-5.5-3.3-5.5Z" fill="#fff"/>
</svg>
```
- Corner radius = 25% of size (8/32).
- First chevron at 55% white opacity, second at 100% → depth and direction.
- Used as favicon (`src/app/icon.svg`), mobile header mark, collapsed-sidebar mark.

### 3.2 Wordmark
- "After" in **ink `#18181B`** + "Admit" in **orange `#FF4500`**, Geist **semibold**, tracking **-0.03em**.
- Lockup gap: 8px between mark and text.
- Sizes: `sm` = mark 24px / text 15px · `md` = 28 / 16.5 · `lg` = 36 / 21.
- Component: `src/components/brand/logo.tsx` (`<Logo size="sm|md|lg" />`, `<LogoMark />`). Static file: `public/afteradmit-logo.svg`.

### 3.3 Partner / school logos
- School logo (UCLA Anderson) shown as-is from `public/ucla-anderson.svg`, at 22px height in a bordered card at the top of the sidebar, never recoloured.
- Providers without logos get a **monogram tile**: 2 initials, white bold text on the provider's brand colour, `rounded-lg`/`rounded-xl`.

---

## 4. Colour system

All tokens live in `src/app/globals.css` (`:root` + `@theme inline`), exposed as Tailwind classes (`bg-primary`, `text-ink`, `bg-canvas`, …).

### 4.1 Core tokens

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FFFFFF` | Pure white — cards, sidebar, header, all mobile backgrounds |
| `canvas` | `#F8F8F9` | Desktop main workspace behind cards (separates content from white sidebar) |
| `foreground` | `#121214` | Default text |
| `primary` | `#FF4500` | The one accent (Reddit orange): primary buttons, active nav icon, progress, links, focus ring |
| `primary-hover` | `#E83E00` | Primary button hover |
| `primary-soft` | `#FFF1EB` | Tinted backgrounds: "why it matters", perks, selected rows, soft badges |
| `ink` | `#18181B` | Matte black: headings, secondary CTA buttons, dark panels, active segmented items |
| `ink-hover` | `#2A2A2E` | Ink button hover |
| `secondary` / `muted` / `accent` | `#F4F4F5` | Subtle fills, hover backgrounds, tracks |
| `muted-foreground` | `#6E6E76` | Secondary text, descriptions |
| `subtle` | `#A1A1AA` | Tertiary text, placeholders, timestamps, inactive icons |
| `border` | `#ECECEE` | Every hairline |
| `input` | `#E4E4E7` | Form control borders |
| `ring` | `#FF4500` | Focus ring (used at 12–30% alpha) |

### 4.2 Status colours (only used for meaning)

| Token | Text | Soft bg | Meaning |
|---|---|---|---|
| `success` | `#12A150` | `#E9F8EF` | Done, verified, online, approved |
| `warning` | `#C27803` | `#FDF5E4` | Due soon (≤14 days), in review, locked |
| `destructive` | `#E5292C` | `#FDECEC` | Overdue, delete, remove, ban |

### 4.3 Supporting neutrals used inline
- Long-form body text: `#3F3F46` (descriptions) / `#27272A` (post & comment bodies).
- Row hover: `#FAFAFA`; card hover border: `#DCDCE0` / `#D4D4D8`.
- Inactive nav icon: `#8B8B93`.
- Selection highlight: `primary` at 18%.

### 4.4 Data-viz palettes
- **Activity rings:** Roadmap `#FF4500` · This month `#8B5CF6` (violet) · On time `#14B8A6` (teal) — `RING_COLORS` in `src/lib/data.ts`. Ring track: neutral **`#F1F1F3`** (never pastel tints).
- **Admin category donut:** `#FF4500`, `#18181B`, `#FF8A5C`, `#71717A`, `#FFC2A8`, `#D4D4D8` (orange→ink→greys).
- **Partner rings:** `#FF4500`, `#18181B`, `#FF9A6B`, `#A1A1AA`.
- **Stage completion bars:** first 3 stages orange, rest ink at 85%.
- **Chart grid:** `#F0F0F2`; tick labels `#A1A1AA`.

### 4.5 Community "Space" colours
Anderson Fall '27 `#FF4500` · Housing `#18181B` · Roommates `#DB2777` · F-1 & Visa `#2563EB` · Loans & Money `#15803D` · Westwood Life `#7C3AED`. Used only for the small square space icons and a 4px accent strip on space headers.

Other one-offs: partner badge blue `#2563EB` on `#EFF4FF`; star rating `#F5A524`.

---

## 5. Typography

- **Families:** Geist Sans (UI), Geist Mono (keyboard hints, IDs, invoice numbers, codes, tracking params). Loaded via `geist/font/sans` and `geist/font/mono` → CSS vars `--font-geist-sans` / `--font-geist-mono`.
- **Body defaults:** `font-size: 14px; letter-spacing: -0.006em;` antialiased, `text-rendering: optimizeLegibility`.
- **Headings:** `letter-spacing: -0.022em` default; page titles `-0.03em`; giant numbers `-0.035em` to `-0.04em`.
- **Numbers:** `.tabular` utility (`font-variant-numeric: tabular-nums`) on every count, %, date, price.

### Type scale

| Role | Size / weight | Example |
|---|---|---|
| Display number | 32–56px semibold, tracking −0.035em | "125 days to go" |
| Page title | 26px (22px mobile) semibold, −0.03em, `text-ink` | "Your roadmap" |
| Section/page header | 24px (21px mobile) semibold | Admin "Overview" |
| Dialog title | 16px semibold | "Delete post?" |
| Post title | 16–16.5px semibold, −0.015em | Feed cards |
| Card title | 14px semibold | "Up next" |
| Body | 13.5px regular, `leading-relaxed` | Descriptions |
| UI text | 13px medium | Buttons, nav, menu items |
| Meta | 12–12.5px, `muted-foreground` | "Healthcare · 2/3 steps" |
| Caption | 11–11.5px, `subtle` | Timestamps, legends |
| Overline | 11px medium **UPPERCASE**, tracking 0.08em, `subtle` | "YOUR SPACES", "STEPS" |
| Kbd | 10.5px Geist Mono, bordered, `bg-muted` | "⌘K" |

---

## 6. Spacing, layout & shape

### 6.1 Grid & containers
- 4px base grid; most gaps are 8 / 12 / 16 / 20 / 24px.
- `PageContainer`: `max-w-[1240px] mx-auto px-4 md:px-8 py-6 md:py-8` (dashboard narrows to 1080, roadmap widens to 1320, settings 920–1100).
- Two-column pages: `grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px]` — **always `minmax(0,1fr)` / `grid-cols-1`** so long text truncates instead of overflowing on mobile.

### 6.2 Shell dimensions
- Sidebar: **248px** expanded, **64px** collapsed; `border-r`, white.
- Top header: **56px** (`h-14`), sticky, `bg-white/90 backdrop-blur-md`, `border-b`.
- Mobile bottom tab bar: **64px** + `env(safe-area-inset-bottom)`.
- Card padding: 20px (`px-5 py-5`), large cards 24–28px.

### 6.3 Radius (`--radius: 0.625rem` = 10px)
| Token | px | Used for |
|---|---|---|
| `rounded-md` | 8 | Menu items, badges, small chips |
| `rounded-lg` | 10 | Buttons, inputs, selects, nav items |
| `rounded-xl` | 14 | Cards, list rows, dropdowns, popovers |
| `rounded-2xl` | 18 | Big cards, dialogs, post cards, sheets |
| `rounded-full` | — | Avatars, pills, filter chips, status dots |
Space icons: square with radius = 30% of size.

### 6.4 Elevation
```css
--shadow-xs: 0 1px 2px 0 rgb(18 18 20 / 0.04);
--shadow-sm: 0 1px 2px 0 rgb(18 18 20 / 0.05), 0 1px 3px 0 rgb(18 18 20 / 0.04);
--shadow-md: 0 4px 12px -2px rgb(18 18 20 / 0.08), 0 2px 4px -2px rgb(18 18 20 / 0.04);
--shadow-lg: 0 12px 32px -8px rgb(18 18 20 / 0.14), 0 4px 8px -4px rgb(18 18 20 / 0.06);
```
- Cards: `shadow-xs` + border. Hover cards: `0 4px 16px -6px rgba(18,18,20,0.08)`.
- Popovers/menus/dialogs: `shadow-lg`.
- Modal overlay: `#121214` at 30% + `backdrop-blur-[2px]`.

---

## 7. Iconography

- **lucide-react only.** Sizes: 16px default (`size-4`), 17px nav, 18–21px mobile tabs, 14px inline meta (`size-3.5`), 12px in badges.
- **Stroke width:** 1.75 for navigation, 1.8 for action rows, 2–2.4 for small chevrons/checks, 2.75–3 for tiny checkmarks.
- **Colour:** inactive `#8B8B93`/`subtle`; hover → `foreground`; active nav → `primary`.
- Never decorative-only icons without meaning; icon-only buttons always have `aria-label` + tooltip.
- Key icon vocabulary: House, Route (roadmap), MessagesSquare (community), Mail, Store (marketplace), Rocket/Wallet/Globe/GraduationCap/HeartPulse/House/Landmark/Plane/MapPin (9 stages), ChevronUp/Down (votes), MessageCircle (replies), Bookmark, Share2, Pin, Lock, ShieldCheck, BadgeCheck (verified — **green**), PanelLeftClose/Open (sidebar).

---

## 8. Component library (hand-written shadcn on Radix)

Location: `src/components/ui/*`. All accept `className`, merge with `cn()`.

| Component | Key decisions |
|---|---|
| **Button** | `h-9 px-3.5 rounded-lg text-[13px] font-medium`. Variants: `default` (orange), `ink` (black), `outline` (white + input border + `shadow-xs`), `secondary`, `ghost`, `soft` (orange-soft), `destructive`, `link`. Sizes: `xs` 28 · `sm` 32 · `default` 36 · `lg` 40 · `xl` 44 · `icon` 36 · `icon-sm` 32 · `icon-xs` 28. Focus: `ring-[3px] ring-ring/25`. |
| **Badge** | `rounded-md px-1.5 py-0.5 text-[11.5px] font-medium`. Variants: `default` (orange-soft), `solid`, `ink`, `secondary`, `outline`, `success`, `warning`, `destructive`. |
| **Input / Textarea** | `h-9 rounded-lg border-input px-3 text-[13.5px] shadow-xs`; placeholder `subtle`; focus `border-primary/60 + ring-[3px] ring-primary/12`. |
| **Card** | `rounded-xl border bg-card shadow-xs`; Header `px-5 pt-5` with optional right-aligned `CardAction`; Title 14px semibold; Description 13px muted; Content `px-5 py-5`. |
| **Dropdown menu** | `rounded-xl p-1 shadow-lg min-w-[11rem]`; items `rounded-md px-2 py-1.5 text-[13px]`, highlight `bg-muted`; icons auto-muted; destructive items red with red-soft highlight; labels are 11px uppercase overlines; shortcuts in mono. |
| **Dialog / AlertDialog** | `rounded-2xl p-6 shadow-lg`, `max-w-lg` / `max-w-md`; zoom from 0.98 + fade; footer buttons right-aligned (outline cancel, ink/destructive confirm). |
| **Sheet** | Right/left drawers (`sm:max-w-md`) for forms; **bottom sheet** on mobile (`rounded-t-2xl`, `max-h-[90dvh]`, 40×4 drag handle, no close X). |
| **Tabs** | Two variants: **pill** (`bg-muted h-9 p-[3px]`, active = white + `shadow-sm`) and **line** (underline 2px orange). |
| **Select** | Same skin as Input; check indicator in orange; popper content `rounded-xl`. |
| **Switch** | 18×32, checked orange, unchecked `#E2E2E5`, white thumb with `shadow-sm`. |
| **Checkbox / Radio** | 16px, `rounded-[5px]`, border `#D4D4D8`, checked orange fill; radio dot orange. |
| **Tooltip** | Ink background, white 12px medium text, `rounded-md px-2 py-1`, 200ms delay. |
| **Table** | Header `h-9` 11.5px uppercase tracking-wider muted; cells `py-3`; first/last cell `pl-5/pr-5`; row hover `#FAFAFA`; wrapped in `overflow-x-auto`. |
| **Progress** | `h-1.5 rounded-full bg-muted`, orange indicator, 500ms ease-out. |
| **Avatar** | Initials on brand colour, white semibold; stacked avatars use single initial + `ring-2 ring-white`, `-space-x-1.5/-2`. |
| **Toasts (sonner)** | `rounded-xl`, border, `shadow-lg`, 13px Geist. Every mock action confirms with a toast. |

---

## 9. App shell & navigation patterns

- **Sidebar (desktop):** Logo + collapse button → context card (school logo + program/term, or env/partner card) → nav sections with overline labels → footer (upgrade card + user menu).
  - Nav item: `h-8 px-2 rounded-md text-[13.5px] font-medium`; active = `bg-muted` + orange icon. Badges: numeric = orange pill, string = muted pill (e.g. "8/35").
  - **Collapsible** to a 64px icon rail (button or **⌘B / Ctrl+B**): icons get right-side tooltips, numeric badges become 6px orange dots, section labels become hairline dividers, footer becomes avatar-only menu. Width animates 200ms.
  - Collapsed logo mark swaps to an "expand" icon on hover.
- **Top header:** search trigger (looks like an input, "⌘K" kbd), page-level action (e.g. "Create post"), notification bell with orange dot.
- **⌘K command palette:** grouped results (Pages, Milestones, Posts…), arrow-key navigation, active row `bg-muted` with orange icon and ↵ hint.
- **Notifications popover:** 360px, unread orange dot, "Mark all as read".
- **User menu:** name/email header, Profile, Billing, Settings (with shortcuts), Help, **"Switch demo role"** group, Log out.
- **Help & support sheet** (right drawer, 440px, role-aware): search, 3 contact tiles (live chat / email / call with response times), FAQ accordion, guides list, school contacts (students), general feedback form, keyboard shortcuts, footer with green "All systems operational" status.
- **Mobile:** hamburger opens sidebar as left sheet; students also get a **bottom tab bar** (Home, Roadmap, Community, Messages, Market) with orange top indicator on active tab and badge counts.
- **Canvas:** desktop workspace sits on `bg-canvas` (`#F8F8F9`) so white cards and white sidebar read as distinct planes.

---

## 10. Data visualisation

### 10.1 Activity rings (custom SVG — `src/components/charts/activity-rings.tsx`)
- Concentric rings, `stroke-linecap: round`, rotated −90° so progress starts at 12 o'clock.
- Dashboard hero: size 168, stroke 11, gap 5 → leaves a large centre for "23% complete" (26px).
- Track: neutral `#F1F1F3` (pastel tints looked cheap).
- Fill animation: `stroke-dashoffset` 1.1s `cubic-bezier(.22,1,.36,1)`, staggered 120ms per ring, triggered after mount.
- **Interactive:** hover/focus a ring → it thickens +2px and gets `drop-shadow(0 0 6px color/40%)`, others fade to 28% opacity, centre swaps to that ring's value (in its colour) + label. Controlled mode (`active` / `onActiveChange`) links rings to the legend rows.
- Legend rows: mini 28px ring + label + caption + 19px value; hovering a row highlights its ring; non-active rows fade to 40%.
- Single-ring variant (`interactive={false}`) used for stage progress around icons.

### 10.2 Recharts conventions
- No vertical grid lines; horizontal grid `#F0F0F2`; no axis lines or tick lines; ticks 11px `#A1A1AA`; Y axis width 28–34px.
- Area charts: 2px stroke, gradient fill from 22% → 0% opacity, `activeDot` r=4 with 2px white stroke.
- Bars: top radius 5–6px, `maxBarSize` 28–36.
- Donut: inner 62 / outer 86, `paddingAngle 2`, `cornerRadius 4`, total in the centre.
- Custom tooltip: white, `rounded-lg border shadow-md`, 12px, coloured dots, tabular values.

### 10.3 KPI cards & sparklines
- KPI card: 12.5px label + small icon, 26px semibold value, green/red delta with arrow, muted hint, optional inline SVG sparkline (88×32, 1.75px stroke, 18%→0% fill).

---

## 11. Page-by-page decisions

### Login (`/login`)
- Split screen, **graphics left / form right**, fits one viewport (`lg:h-dvh lg:overflow-hidden`).
- Left: matte-black panel, dotted grid texture (22px, 7% white dots), blurred orange glow, "Fall 2027 cohort is live" pill, headline with second line at 45% white, 3 floating product cards (rings, up-next checklist, community post).
- Right: "Welcome back", **demo account dropdown** (icon + role + description), email/password, ink "Sign in as …" button, outline Google button, footer links.

### Invite (`/invite`) & Onboarding (`/onboarding`)
- Invite: school logo card, "Congratulations, Sayali. Welcome to Anderson." (second line orange), 2×2 fact grid, account card with Google + password strength bar + consent checkboxes (privacy reassurance copy).
- Onboarding: one question per screen, 3px top progress bar, option cards with numbered kbd keys (1–4 / Enter shortcuts), multi-select for funding, "Building your roadmap…" spinner, then a summary of 9 stage tiles + "hidden because they don't apply" list.

### Student dashboard (`/student`)
Deliberately only **3 blocks**:
1. Greeting ("Good morning, Sayali 👋" with one-time wave) + one-line status ("1 overdue · 7 due in the next 30 days") + orange "Open roadmap".
2. **Hero card:** Journey progress (interactive rings + 3 stat rows) | countdown panel (32px days, "Day 57 of 182" elapsed bar, next deadline chip, faint orange glow).
3. **Up next** list (tap circle to complete, due badges) + **Stages** 3×3 mini-ring grid.

### Roadmap (`/student/roadmap`)
- Header: progress bar + **Stages / Timeline** pill tabs; "Personalized from your answers" chips + "3 hidden" popover + "Edit answers".
- **Stage track:** one connected horizontal stepper — node per stage (complete = orange check disc; current = ink disc with orange outline ring + shadow; others = mini progress ring with stage icon), connectors fill orange by stage progress, label + "done/total · month range". Scrolls horizontally on mobile.
- **Timeline view:** vertical rail per month (month name + year + "n open"), status node on the rail, date block (day number + weekday), title + stage + steps, due badge, and a pulsing orange **"Today · May 18"** marker.
- **Milestone detail** (sticky right panel; bottom sheet on mobile): stage eyebrow + prev/next, title, status badges, description, due/steps stat tiles, orange-soft "Why it matters", requires/shown-because rules, checkbox steps, vetted providers (click = lead toast), school contact card, "Mark milestone done" + "Not applicable", then "Was this helpful?" feedback.
- Status icon language: done = orange filled check; in progress = half-filled orange circle; not started = dashed grey circle; overdue = red variants; N/A = grey minus.

### Community — "Spaces" (`/student/community`)
Intentionally **not Reddit**:
- Header with classmates avatar stack + "48 online now"; horizontal **space filter chips** (square colour icons); composer card ("Ask your class anything…") with quick prompt chips; line tabs **For you / Latest / Trending / Most helpful**.
- **Post card:** author-first (avatar, real name, role badge, program · hometown, time), space chip top-right, title, 2-line body, map/poll attachments, flair as coloured dot + text, milestone link chip (orange-soft), footer with **chevron vote control** (bordered segmented, orange when upvoted), replies count, "Sofia and 213 others replied" avatar stack, save + share icons.
- Space page: clean header card with 4px colour strip (no banner), member stack, Join (ink → outline "Joined"), guidelines with numbered tiles, moderators list.
- Post detail: space chip breadcrumb, large title, author block, body, linked-milestone card, action bar between hairlines, reply composer, sort select (Most helpful / Newest / Oldest), threaded replies with collapse rail, "Author" badge, edit/delete/report/mod tools.
- Role badges: Moderator (green soft), AfterAdmit (orange soft), Partner (blue soft + BadgeCheck).
- Moderation everywhere via `…` menu: Edit, Delete (confirm), Save, Copy link, Hide, Mute, Report (reason dialog); mod tools: Approve, Pin, Lock, Change flair, Remove, Ban (confirm).

### Messages
- Two-pane (list 340px + chat); mobile shows list → chat with back arrow. Own bubbles ink, others muted; grouped by sender; online green dot; composer pill with attach/emoji/send; privacy reminder caption.

### Marketplace
- Category pill filters (ink when active), search, privacy reassurance strip, 3-column provider cards (monogram tile, name + **green verified badge**, category + rating, tagline, perk in orange-soft with copyable mono code, "Helps with" milestones, outline CTA that turns ink on card hover), "You're leaving AfterAdmit" confirmation dialog.

### Profile & settings
- Left vertical tab nav (horizontal scroll on mobile): Profile, Journey answers, Account & security, Notifications, Plan & billing, Privacy & data, Connected accounts.
- Each section = bordered card with header strip; label/field rows (220px label column); toggle rows; plan cards (Free / Plus "Popular" / Concierge); payment method tile; invoices table; destructive actions with confirm dialog.

### AfterAdmit admin
- Overview: 4 KPI cards with sparklines, leads & sign-ups area chart, category donut, stage completion bars, live universities with dual rings, latest feedback cards.
- Universities table + 5-step onboarding sheet (stepper pills); master roadmap template as collapsible stage accordions with drag handles, toggles and an edit sheet (anchor date + offset, AND-rule builder, tasks); providers directory with approval banner; leads explorer + CSV export; feedback board; moderation queue / communities / mod log; settings (team roles, platform defaults).

### Partner portal
- Overview KPIs, daily leads area chart, "Where students find you" interactive rings, listings list, dark "How leads work" panel; listing cards with illustrated placeholder, status badge, perk, placements, Leads/CTR/Schools stat strip and full CRUD (edit sheet → "Submit for review", pause/resume, duplicate, delete confirm); anonymised leads table; pay-per-lead billing with monthly cap progress; company profile.

---

### Marketing landing page (`/`)
- Structure: fixed nav → **Hero** → **Features bento** (incl. wide "For admissions teams" tile) → **FAQ** → **dark CTA band** → **footer**. Max 3–4 sections.
- Hero: centered 76px headline (second line `#A1A1AA`), one-line subcopy, ink + outline pill CTAs; masked 56px grid pattern + soft orange radial glow; product preview in a browser frame (`app.afteradmit.com`) surrounded by creative photo frames (arched `rounded-t-full`, squircle, tilted ±3–4°, 5px white border, deep soft shadow) and small floating status cards; grayscale logo row (school logo + styled wordmarks).
- Features: 6-column bento, `rounded-[22px]` tiles, each with eyebrow / title / one-sentence body and a **live mini-UI** (not icons): stepper, deadline stack, photo + avatar pill, partner rows, dark privacy tile with orange glow, schools tile with stats + bars + campus photo.
- FAQ: two columns (heading + contact pill | accordion with rotating "+" in a circle, grid-rows height animation).
- CTA band: ink card, animated "aurora" radial gradients (orange/peach/violet, 16s alternate) + dot texture, tilted photo with overlaid stat card.
- Footer: logo + one-liner + pill newsletter form, 4 link columns (Product, Company, Resources, Legal), status dot, socials, giant faded wordmark bleeding off the bottom.
- Legal pages at `/legal/[slug]`: privacy, terms, cookies, student data (FERPA & GDPR), DPA, security, accessibility.
- Images: Unsplash via `next/image` with `images.unoptimized: true` (server-side optimizer fails behind TLS-inspecting proxies); always verify photo IDs load before using them.
- Respect `prefers-reduced-motion`; smooth scrolling for in-page anchors.

## 12. Interaction & motion

| Thing | Spec |
|---|---|
| Hover colour/border changes | `transition-colors` ~150ms |
| Sidebar collapse | width 200ms ease-out |
| Dialogs / menus | fade + zoom 95–98%, 200ms (`tw-animate-css`) |
| Sheets | slide in 300ms / out 200ms |
| Page section swap | `animate-in fade-in-0` (+ `slide-in-from-bottom-1/2`) |
| Rings | 1.1s fill, 120ms stagger; hover 200ms |
| Progress bars | 500–700ms ease-out width |
| Greeting wave | `@keyframes wave` (rotate ±14°) once, 1.8s, 0.4s delay |
| Today marker | `animate-ping` halo — the only looping animation |
| Focus | `ring-[3px]` orange at 12–30% alpha, never browser default |
| Feedback | Every action → sonner toast; destructive → AlertDialog |
| Keyboard | ⌘K search, ⌘B sidebar, number keys + Enter in onboarding, arrows/Enter in palette |

---

## 13. Content & copy rules

- Sentence case everywhere; no Title Case Buttons.
- Short, specific labels: "Mark milestone done", "Not applicable to me", "Submit for review".
- Relative dates for urgency ("Due in 7d", "3d overdue", "Due tomorrow"), absolute for calendar ("Due Jun 1", "Program starts Sep 20").
- Fixed demo "today" (`TODAY = "2027-05-18"`) so states never drift.
- Privacy reassurance near sensitive actions ("Your school never sees individual activity", "We never share your contact details with providers").
- Real-sounding names, places, prices; placeholder contacts on `example.edu`.
- Prefer people's names over handles; prefer "replies" over "comments", "Spaces" over "subreddits".

---

## 14. Responsive & mobile rules

- Breakpoints: Tailwind defaults (`sm 640 · md 768 · lg 1024 · xl 1280`). Sidebar appears at `lg`.
- **Golden rule:** every multi-column grid starts with `grid-cols-1` and uses `minmax(0,1fr)` — prevents long titles from forcing horizontal scroll.
- Wide tables live in `overflow-x-auto`; chip rows use `overflow-x-auto scrollbar-none`.
- Use `dvh` and `env(safe-area-inset-bottom)` for full-height and bottom bars.
- Detail panels become bottom sheets; two-pane views become list → detail.
- Header actions wrap (`flex-wrap`); primary page CTA becomes full width on phones.
- Verified at 390×844 (iPhone 14) and 1440×800/900.

---

## 15. Accessibility

- All icon buttons: `aria-label`; collapsed nav: tooltips + labels.
- Rings: focusable groups with `aria-label="Roadmap: 23%"`.
- Stage track uses `aria-current="step"`.
- Colour is never the only signal (icons + text accompany status colours).
- Contrast: text never lighter than `#A1A1AA`, and only for tertiary info.
- Radix primitives provide focus traps, Escape handling, roving focus.

---

## 16. Engineering conventions & gotchas

- **File layout:** `src/components/ui` (primitives) · `components/shell` (AppShell, PageHeader, PageContainer, CommandPalette) · `components/{student,community,admin,partner,charts,brand}` · `src/lib/{data,community-data,ops-data,utils}.ts`.
- **Shared client store** for student milestone state (`components/student/store.tsx`) so checking a task updates dashboard, roadmap and sidebar badge together.
- **Next.js 16 + Cache Components:** `params` is a Promise; dynamic routes need `generateStaticParams` (+ `export const instant = false` for static demo data); pages using `useSearchParams` wrap an inner component in `<Suspense>`; client pages can't export helpers → put shared code in `components/`.
- **Lint rule `react-hooks/set-state-in-effect`:** reset state in event handlers, via `key`, or by deriving during render — never `setState` inside `useEffect`.
- **Fonts:** use the `geist` npm package, not `next/font/google` (corporate networks block it).
- **shadcn CLI** may fail behind TLS-inspecting proxies → hand-write components (same API) on the `radix-ui` package.
- **Dev overlay:** `devIndicators: { position: "top-right" }` so it doesn't cover the sidebar user menu. If a hydration "server/client className mismatch" appears right after editing a layout, restart `next dev` (stale prerendered shell).
- **PowerShell:** use `-LiteralPath` for paths containing `[brackets]`.

---

## 17. Recipe — reproduce this design in a new app

1. `create-next-app` (TS, Tailwind, App Router, `src/`).
2. `npm i radix-ui class-variance-authority clsx tailwind-merge lucide-react tw-animate-css sonner recharts geist`.
3. Copy `src/app/globals.css` (tokens, base layer, utilities, keyframes) and `src/lib/utils.ts` (`cn`, formatters).
4. Copy `src/components/ui/*` and `src/components/shell/*`.
5. Set root layout: Geist Sans/Mono variables on `<html>`, `<TooltipProvider>`, `<Toaster position="bottom-right" />`.
6. Make a logo with the same recipe: brand-colour rounded square (r = 25%), a simple white geometric glyph at 55% + 100% opacity, two-tone wordmark in Geist semibold −0.03em.
7. Swap only the accent: change `--primary`, `--primary-hover`, `--primary-soft` (and ring/chart palettes); keep ink, greys, borders, radii, type scale and spacing identical.
8. Build pages with `PageContainer` + `PageHeader`, cards with `Card`, one orange CTA per view, and follow the checklist in §1.
