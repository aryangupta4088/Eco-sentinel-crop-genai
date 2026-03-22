```markdown
# Design System Specification: Editorial Organicism

## 1. Overview & Creative North Star: "The Digital Soil"
This design system moves away from the rigid, sterile grids of urban tech. Our Creative North Star is **Editorial Organicism**. We treat the interface not as a software dashboard, but as a living, tactile broadsheet—deeply rooted in the Indian landscape. 

The aesthetic identity balances the "Sentinel" (precision, technology, data) with "Eco" (warmth, earth, growth). By utilizing intentional asymmetry, overlapping containers, and a departure from traditional "box" layouts, we create a premium experience that feels high-end yet fundamentally intuitive for the Indian farmer. 

**Key Design Principles:**
*   **Asymmetric Harmony:** Avoid perfectly centered layouts. Offset imagery and text to mimic natural growth.
*   **Tactile Depth:** UI elements should feel like stacked sheets of handmade paper or layers of silt, not flat digital pixels.
*   **Voice-First Prominence:** The interface acts as a visual companion to a primary voice interaction model.

---

## 2. Color & Tonal Architecture
We reject the "default" internet. Our palette is pulled directly from the clay of the Deccan, the lushness of Punjab’s fields, and the sunlight of the Thar.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. 
*   Use `surface-container-low` (#f7f3eb) for the base body.
*   Use `surface-container-high` (#ebe8e0) for secondary content blocks.
*   This creates "soft boundaries" that feel more natural and less "engineered."

### Glass & Soul
*   **The Signature CTA:** Buttons and primary actions should use a subtle linear gradient from `primary` (#0d631b) to `primary_container` (#2e7d32). This adds "soul" and dimension.
*   **Glassmorphism:** For floating voice-activation HUDs or overlays, use `surface` (#fcf9f1) at 70% opacity with a 20px backdrop blur. This ensures the "earth" of the background is never fully lost.

---

## 3. Typography: The Editorial Voice
We use a high-contrast scale to ensure maximum legibility for regional scripts (Hindi, Marathi, Telugu, etc.) while maintaining a premium editorial feel.

*   **Display & Headlines (Plus Jakarta Sans):** Chosen for its modern, geometric clarity. Use `display-lg` (3.5rem) for critical weather alerts or crop yields to create an authoritative, "newspaper headline" impact.
*   **Body & Labels (Be Vietnam Pro):** This typeface offers exceptional x-height and open counters, essential for the intricate glyphs of Indian regional languages at smaller scales.
*   **The Hierarchy Goal:** Use `title-lg` (#1c1c17) against `surface-container-low` to create a clear, trustworthy information hierarchy that feels like a curated report, not a cluttered app.

---

## 4. Elevation & Depth: Tonal Layering
Instead of shadows that look like "drops," we use light and color to imply physical presence.

*   **The Layering Principle:** 
    *   **Layer 0 (Ground):** `surface` (#fcf9f1)
    *   **Layer 1 (The Plot):** `surface-container-low` (#f7f3eb) 
    *   **Layer 2 (The Seed):** `surface-container-lowest` (#ffffff) for active cards.
*   **Ambient Shadows:** If a card must float, use a shadow with a 40px blur, 0px spread, and 6% opacity using the `on-surface` color (#1c1c17). It should look like a soft cloud shadow on a field.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#bfcaba) at **15% opacity**. Never 100%.

---

## 5. Components & Interaction Patterns

### Large-Scale Touch Targets
Given the outdoor environment (sunlight, calloused hands), all interactive elements utilize the `xl` (3rem) or `lg` (2rem) roundedness scale.

*   **Primary Action Buttons:** 
    *   Height: Minimum `10` (3.5rem) on the spacing scale.
    *   Shape: `full` (pill-shaped) to represent organic seeds.
    *   Color: `primary` (#0d631b) with `on-primary` (#ffffff) text.
*   **The Voice-Activation Hub:** A floating action button using `secondary` (#904c27) with a `tertiary_fixed_dim` (#f8bd2a) outer glow to represent the "Warm Sun."
*   **Cards & Lists (The "No Divider" Rule):** 
    *   Forbid the use of line dividers. 
    *   Separate list items using `spacing-4` (1.4rem) and a subtle shift from `surface-container` to `surface-container-low`.
*   **Input Fields:**
    *   Use `surface-container-highest` (#e5e2da) as the field background. 
    *   Instead of a border, use a `2px` bottom-bar of `primary` only when focused.
*   **Organic Selection Chips:** 
    *   Use `surface-container-high` for unselected.
    *   Use `secondary_container` (#ffa67a) for selected states to provide a warm, clay-like "earthy" pop.

---

## 6. Do’s and Don'ts

### Do:
*   **DO** use white space as a structural tool. Use `spacing-16` (5.5rem) to separate major sections.
*   **DO** use organic, non-perfectly-circular shapes for image masks. Think "pebbles," not "circles."
*   **DO** ensure all text has a contrast ratio of at least 4.5:1 against the warm backgrounds.
*   **DO** prioritize high-quality photography of local crops and soil textures to ground the UI.

### Don't:
*   **DON'T** use pure black (#000000). Use `on-surface` (#1c1c17) for all text to maintain the "earthy" warmth.
*   **DON'T** use 90-degree sharp corners. The minimum radius is `sm` (0.5rem); the standard is `DEFAULT` (1rem).
*   **DON'T** use standard "Material Design Blue" for links. Use `secondary` (#904c27) to maintain the clay/earth palette.
*   **DON'T** crowd the screen. If a farmer is looking at this in the field, they need one clear piece of information at a time.

---

## 7. Spacing Strategy
Our spacing scale is generous to allow for "breathing room."
*   **Gutter:** `spacing-6` (2rem) for mobile side margins.
*   **Section Gap:** `spacing-12` (4rem) to `spacing-16` (5.5rem).
*   **Internal Padding:** `spacing-4` (1.4rem) inside cards. 

By adhering to this system, we ensure the experience feels like an extension of the farm—reliable, warm, and expertly crafted.```