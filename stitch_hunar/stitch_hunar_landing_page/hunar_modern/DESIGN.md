# Design System Document

## 1. Overview & Creative North Star

### The Creative North Star: "The Empowered Artisan"
This design system is built to bridge the gap between high-tech AI capabilities and the grounded, hardworking spirit of the blue-collar workforce. Our North Star, **The Empowered Artisan**, dictates a UI that is professional yet approachable, sophisticated yet simple. 

We break the "generic template" mold by moving away from rigid grids and boxy constraints. Instead, the layout utilizes **intentional asymmetry**—offsetting high-end typography against organic, layered surfaces. We treat the digital interface like a premium editorial magazine: plenty of breathing room (whitespace), bold type scales, and elements that overlap slightly to create a sense of tactile depth. This is not just a job board; it is a premium career curator.

---

## 2. Colors

The palette is anchored in a deep, authoritative Indigo, balanced by energetic pops of Sunrise Orange and Teal to signify growth and opportunity.

### Color Tokens (Material Design Convention)
*   **Primary (`#00236f`):** The foundation. Use for core brand moments and high-level navigation.
*   **Secondary (`#9d4300`):** The "Energy" color. Use for high-priority CTAs and "New" badges.
*   **Tertiary (`#00312c`):** The "Stability" color. Use for professional accents and success states.
*   **Surface Hierarchy:**
    *   `surface`: `#f6fafe` (Main background)
    *   `surface-container-low`: `#f0f4f8` (Sectioning)
    *   `surface-container-highest`: `#dfe3e7` (Elevated cards)

### The "No-Line" Rule
To maintain a high-end feel, **1px solid borders are prohibited** for sectioning content. Visual boundaries must be defined solely through background color shifts. For example, a job listing section should sit on `surface-container-low`, distinct from the main `surface` background, without an outline.

### The "Glass & Gradient" Rule
Standard flat colors feel static. For main CTAs and Hero backgrounds, use a **Signature Texture**: a subtle linear gradient from `primary` (#00236f) to `primary_container` (#1e3a8a). For floating navigation or AI-powered modals, apply **Glassmorphism**: use a semi-transparent `surface` color with a `backdrop-filter: blur(12px)`.

---

## 3. Typography

The typography strategy pairs the structural reliability of **Inter** with the modern, expressive personality of **Plus Jakarta Sans**.

*   **Display & Headlines (Plus Jakarta Sans):** Used for "Brand Moments." Large, bold, and slightly tighter letter-spacing. This conveys the "Premium" feel.
    *   `display-lg`: 3.5rem (Hero titles)
    *   `headline-md`: 1.75rem (Section headers)
*   **Titles & Body (Inter):** Used for functional information. High legibility and a neutral tone ensure the UI remains user-friendly for all skill levels.
    *   `title-md`: 1.125rem (Job titles in cards)
    *   `body-md`: 0.875rem (Job descriptions/General text)

**Editorial Tension:** We create visual interest by pairing a `display-sm` headline with a significantly smaller `label-md` uppercase sub-header, creating a "High-Contrast" scale that feels intentional and designed.

---

## 4. Elevation & Depth

We move beyond traditional drop shadows to a system of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, "natural" lift that mimics physical paper.
*   **Ambient Shadows:** For elements that must float (e.g., a "Quick Apply" button), use extra-diffused shadows. 
    *   *Spec:* `0px 12px 32px rgba(23, 28, 31, 0.06)`. Note the low 6% opacity; it should feel like a soft glow of light, not a dark smudge.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **20% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` fill, `on_primary` text. `xl` roundedness (1.5rem) for a friendly, modern feel.
*   **Secondary:** `secondary` fill with a subtle gradient transition. For "Apply Now" actions.
*   **Tertiary:** No fill. `primary` text with an underline that appears on hover.

### Job Cards
*   **Style:** No borders. Background: `surface-container-lowest`. 
*   **Structure:** Use `spacing-6` (1.5rem) internal padding. Instead of divider lines, use a `surface-container-low` background chip to highlight "Salary" or "Location."
*   **Rounding:** `lg` (1rem) for the card body.

### Chips (Skill & Category)
*   **Visuals:** `sm` (0.25rem) roundedness. 
*   **Color:** `surface-container-high` background with `on_surface_variant` text. This keeps them secondary to the main card content.

### AI Search Inputs
*   **Style:** Large, `full` rounded (pill-shaped) inputs. Use a `surface` background with a soft Ambient Shadow. Avoid the standard rectangle to make the AI interaction feel "smarter" and more fluid.

---

## 6. Do's and Don'ts

### Do
*   **Do** use overlapping elements. Let a profile image slightly "break" the container of a card to create a premium, non-grid feel.
*   **Do** use large amounts of whitespace (`spacing-12` or `16`) between major sections to let the high-end typography breathe.
*   **Do** use `tertiary_fixed` for success states (e.g., "Application Sent") to maintain the sophisticated palette.

### Don't
*   **Don't** use 1px black or grey dividers. Separate content through white space or tonal shifts.
*   **Don't** use sharp corners. Everything should have at least `DEFAULT` (0.5rem) rounding to remain "friendly and reliable."
*   **Don't** use pure black (#000000) for text. Always use `on_background` (#171c1f) to maintain a soft, high-end editorial look.