# Design System & Art Direction (DA) - Portfolio

This document gathers all the visual rules, design tokens, and interface components that define the Art Direction (DA) of the portfolio. The goal is to allow the reuse of this DA to guarantee visual consistency throughout the project's evolution.

---

## 1. Color Palette (Warm Stone & Amber Theme)

The portfolio uses a semantic color system based on warm stone tones for the interfaces, with amber color accents to draw the eye. These colors are defined by CSS variables (RGB) to dynamically manage opacity (via Tailwind).

### Light Mode

The interface offers a soft, neutral, and bright rendering.

| Role                     | Color (RGB)     | Approx. Hex | Usage                                        |
| :----------------------- | :-------------- | :---------- | :------------------------------------------- |
| **Background**           | `252, 250, 247` | `#fcfaf7`   | Main site background.                        |
| **Background Secondary** | `245, 241, 235` | `#f5f1eb`   | Cards, secondary areas, code blocks.         |
| **Foreground**           | `28, 25, 23`    | `#1c1917`   | Main text, headings.                         |
| **Foreground Sec.**      | `87, 83, 78`    | `#57534e`   | Paragraphs, secondary text, subheadings.     |
| **Border**               | `214, 211, 209` | `#d6d3d1`   | Card borders, separators (`hr`).             |
| **Accent**               | `217, 119, 6`   | `#d97706`   | Primary buttons, links, tags, accented text. |
| **Accent Hover**         | `180, 83, 9`    | `#b45309`   | Hover state of accented elements.            |

### Dark Mode

The interface is deep, elegant, with sharp contrast on important elements.

| Role                     | Color (RGB)     | Approx. Hex | Usage                                           |
| :----------------------- | :-------------- | :---------- | :---------------------------------------------- |
| **Background**           | `12, 10, 9`     | `#0c0a09`   | Main site background.                           |
| **Background Secondary** | `28, 25, 23`    | `#1c1917`   | Cards, dropdown menus, hover areas.             |
| **Foreground**           | `245, 245, 244` | `#f5f5f4`   | Light text, headings.                           |
| **Foreground Sec.**      | `168, 162, 158` | `#a8a29e`   | Paragraphs, metadata, dates.                    |
| **Border**               | `41, 37, 36`    | `#292524`   | Subtle borders of containers.                   |
| **Accent**               | `245, 158, 11`  | `#f59e0b`   | Interactive light elements (bright amber).      |
| **Accent Hover**         | `251, 191, 36`  | `#fbbf24`   | Hover state for buttons and links in dark mode. |

### Tailwind Classes

`bg-background`, `bg-background-secondary`, `text-foreground`, `text-foreground-secondary`, `text-accent`, `bg-accent`, `border-border`.

---

## 2. Typography

The design relies on three distinct fonts imported via `@fontsource-variable` and Google Fonts, creating a clear and modern hierarchy.

1. **Headings and Display Elements**
   - **Family:** `Sora Variable` (fallback: `system-ui`, `sans-serif`)
   - **Tailwind Class:** `font-display`
   - **Usage Example:** Names, large section headings (`h1`, `h2`), "AM" logo.
   - **Common Weights:** Bold (`font-bold`), Extrabold (`font-extrabold`).

2. **Body Text and Interface (Sans-serif)**
   - **Family:** `Plus Jakarta Sans Variable` (fallback: `system-ui`, `sans-serif`)
   - **Tailwind Class:** `font-sans` (default on `body`)
   - **Usage Example:** Paragraphs, project descriptions, navigation links, buttons.
   - **Common Weights:** Regular (`font-normal`), Medium (`font-medium`).

3. **Code & Technical (Monospace)**
   - **Family:** `JetBrains Mono` (fallback: `Fira Code`, `monospace`)
   - **Tailwind Class:** `font-mono`
   - **Usage Example:** Code blocks in markdown (`pre`, `code`), occasional technical tags.

---

## 3. Visual Effects and Textures

The interface aims to be "premium", textured, and organic, avoiding perfect and "cold" solid colors.

### A. Grain Texture (Fractal Noise)

A very fine background noise is superimposed in `fixed` over the entire site via the `body::after` pseudo-element (SVG fractalNoise).

- **Opacity:** `2.5%` in light mode, `4%` in dark mode.
- **Purpose:** To give a tactile, organic look ("recycled paper" or "premium material"), and break the perfection of the traditional web.

### B. Glassmorphism

Frequently used for floating elements (Header, sticky action buttons, dropdown menus).

- **Tailwind Class / Usage:** `.glass` or direct classes `backdrop-blur-md bg-background/80` (up to `backdrop-blur-2xl bg-background/95`).
- **Example:** The main navigation menu when no scroll is active is transparent, but becomes "glass" (`glass`) with partial opacity to let the underlying text show through when scrolling.

### C. Gradient Txt

Used very occasionally for maximum impact (e.g., the "Software Engineer" role in the Hero section).

- **Custom CSS Class:** `.gradient-text`
- **Definition:** `bg-clip-text text-transparent bg-gradient-to-r from-accent to-amber-400`

---

## 4. Shapes and Global Structure

- **Border Radius:** The design favors generous rounding.
  - Cards and image blocks: `rounded-xl` or `rounded-2xl`
  - Floating menus: `rounded-2xl`
  - Base buttons: `rounded-lg` or `rounded-xl`
  - Pills (Tags): `rounded-full`
- **Box Shadows:** Applied to lift interactive elements.
  - Cards: `shadow-lg` at rest (or sometimes none, just a border), accentuated on hover (`shadow-xl`).
  - Luminous shadow: Tags and certain buttons have a colored shadow on hover (e.g., `shadow-lg shadow-accent/25`).

---

## 5. Animations and Transitions (Framer Motion & CSS)

The site makes extensive use of animation to make navigation more dynamic ("Alive").

### A. Scroll Appearance (Intersection Observer / Framer Motion)

- **Fade Up / Slide Up:** Elements rise by `20px` or `30px` and go from `opacity: 0` to `opacity: 1` (`.animate-on-scroll`, `.animate-fade-in`).
- **Blur Fade:** `.animate-on-scroll-blur` (Adds a `filter: blur(8px)` which reduces to `0px` upon appearing).
- **Stagger effect:** Cascading appearance of children (e.g., project grid) using classes `.stagger-item`, `.stagger-item-scale`.

### B. Micro-interactions (Hover and Click)

- **Active (Click):** `.active:scale-95` is applied to many interactive elements (buttons, logo, tactile cards) to provide physical, rubbery feedback.
- **Project Cards:** The image inside zooms very slightly (`group-hover:scale-105`), the border may change, and the card lifts up (`whileHover={{ y: -4 }}`).
- **Tags:** Lifts by `0.5px` or `1px` (`-translate-y-0.5`), background color changes from `bg-accent/10` to solid `bg-accent`, text becomes white.
- **Social Buttons:** Custom animations defined in CSS (e.g., The Email icon bounces `animation: icon-bounce`, the GitHub icon rotates a bit `rotate(8deg) scale(1.1)`).

### C. Focus State

Keyboard navigation is gracefully handled:

- **CSS Class:** `*:focus-visible` generates a 2px `outline` of `accent` color offset by 2px (`outline-offset: 2px`).

---

## 6. Recurring Components (Design Patterns)

Here is how the main UI entities are constructed.

### Tags / Badges (e.g., Skills, Project Categories)

```html
<!-- Native CSS class (.tag) -> Normally styled in components layer -->
<span class="tag">TypeScript</span>
// or with Tailwind utilities:
<span
  class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 border border-transparent text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:-translate-y-0.5 shadow-lg hover:shadow-accent/25"
>
  TypeScript
</span>
```

### Project Cards

1. **Container:** `bg-background-secondary rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/5` + Framer motion hover (`whileHover={{ y: -4 }}`).
2. **Image Section:** Fixed ratio container (`aspect-video`) with `overflow-hidden` and image `object-cover w-full h-full transition-transform duration-500 group-hover:scale-105`.
3. **Content:** Generous padding (`p-5`), Title in `font-display text-lg font-semibold`, short descriptive paragraph `text-foreground-secondary text-sm`.
4. **Foothold:** Status info/Tags layout with `flex-wrap gap-2`. Also embeds an `ArrowUpRight` icon which appears softly on desktop hover.

### Project Icons (Overlays)

Project cards feature quick-access action buttons overlaid on the top right corner of the cover image:

- **Container:** Absolutely positioned over the image `absolute top-2 right-2 z-[2] flex flex-col gap-1.5`
- **Link Buttons:**
  - Square format minimum touch target: `min-h-[44px] min-w-[44px]`
  - Standard styling: `flex items-center justify-center rounded-md active:scale-95 transition-all`
- **External Link (Live Demo):** Bright primary action (`bg-accent text-white hover:bg-accent-hover`)
- **GitHub Link (Source Code):** Dark secondary action (`bg-black/60 text-white hover:bg-accent`)
- **Icons:** Uses standard `lucide-react` icons (ExternalLink, Github) sized at `w-4 h-4`.

### Call To Action (CTA) Cards

Used to prompt the user to see more projects or contact the author.

- **Container:** Uses a dashed border to distinguish it from regular cards `rounded-xl border-2 border-dashed border-accent/20 bg-accent/[0.03]`.
- **Hover State:** `hover:border-accent hover:shadow-lg hover:shadow-accent/10` + Framer motion lift.
- **Icon Container:** Circular background `w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center`.

### Filter Bars & Timelines (Projects Page)

Used in the projects page to filter content.

- **Container:** Glassmorphic bar `py-4 px-5 rounded-xl bg-background-secondary/80 border border-border shadow-sm backdrop-blur-sm`.
- **Toggle Buttons:**
  - _Inactive:_ `bg-background border-border text-foreground hover:text-accent hover:border-accent`
  - _Active:_ `bg-accent text-white border-accent`
- **Timeline Points:** Small clickable dots `w-3 h-3 rounded-full border-2`. Hovering reveals a tooltip. Active state gets a glowing shadow `shadow-md shadow-accent/30`.

### Large Action Buttons (Contact Section)

Used for primary actions like sending an email or downloading a CV.

- **Primary (Email):** `bg-accent text-white rounded-xl hover:bg-accent-hover font-medium text-lg shadow-lg hover:shadow-xl` + framer lift `hover:scale-105`.
- **Secondary (Download):** `rounded-xl border border-border bg-background hover:border-accent/50 hover:bg-accent/5`. Icon inside changes color on hover `text-foreground-secondary group-hover:text-foreground`.

### Image Lightbox

Used to view project images in full screen.

- **Overlay:** Deep dark blur `fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm`.
- **Image:** Centered and bounded `max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl`.
- **Close Button:** Top right positioned `absolute top-4 right-4 p-2 text-white/70 hover:text-white`.
- **Caption:** Bottom centered text `absolute bottom-6 left-0 right-0 text-center text-white/90 text-sm font-medium`.

### Markdown & Articles / Detailed Projects (`.prose`)

Colors adapted via the `@layer components` class in `global.css` to force Markdown-generated texts to use variables.

- `h1`: `text-3xl md:text-4xl font-bold mt-12 mb-6 text-foreground`
- `p`: `my-4 leading-7 text-foreground-secondary`
- `a`: `text-accent hover:text-accent-hover underline underline-offset-2`
- `pre/code`: Background `bg-background-secondary` and rounded text `rounded-lg p-4`. Read-only line numbering.

---

## 7. Synthesis of Integration Golden Rules

1. **Never use pure black or pure white.** Always use `bg-background` or `bg-background-secondary`.
2. **Maintain the neutral aesthetic.** Most of the interface must remain mineral/neutral (`stone`).
3. **Reserve Amber (`accent`) for strong interactions:** Call To Action buttons, active links, important tags. Do not overload the visual with the accent color.
4. **Always think about transitions.** Do not change color on hover without adding a delay (e.g., `transition-colors`, `duration-300`).
5. **Preserve tactile feedback.** Add a slight visual effect (`hover:opacity-80` or `active:scale-95`) to indicate a button has been pressed.
