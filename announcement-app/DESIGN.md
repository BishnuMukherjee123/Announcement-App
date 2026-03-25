# Design System Strategy: The Curated Ledger

This design system is a high-end, editorial interpretation of the Shopify Polaris framework. It is designed for junior designers to move beyond the "template" look of standard admin tools, creating a signature experience that feels bespoke, authoritative, and intentionally architectural.

## 1. Creative North Star: The Curated Ledger
The guiding philosophy of this system is **The Curated Ledger**. Unlike standard dashboards that feel like a cluttered spreadsheet, this system treats every page as a high-end editorial layout. We prioritize extreme clarity, rhythmic spacing, and functional elegance. By utilizing intentional asymmetry and deep tonal layering, we transform "admin work" into a premium management experience.

We do not use borders to define space; we use **gravity and tone**.

## 2. Color & Tonal Architecture
The palette is rooted in Shopify’s heritage but elevated through a sophisticated neutral scale. Our goal is a "chromatic white" experience—where the UI feels airy but never hollow.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. 
*   **How to define boundaries:** Use background color shifts. A `surface_container_low` (#f5f3f3) section should sit directly on a `surface` (#fbf9f9) background. 
*   **The Result:** The UI feels like a single, cohesive piece of carved marble rather than a collection of boxes.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the Material surface tokens to define importance through "Elevation by Tone":
1.  **Base Layer:** `surface` (#fbf9f9) - The canvas.
2.  **Sectioning Layer:** `surface_container_low` (#f5f3f3) - Large structural areas.
3.  **Interaction Layer:** `surface_container_lowest` (#ffffff) - Actionable cards and input areas. This creates a "lift" effect without needing shadows.
4.  **Emphasis Layer:** `surface_container_high` (#e9e8e7) - Sub-navigation or secondary sidebars.

### Signature Accents
While the core is Green (`primary`: #00654b) and Grey, use `tertiary` (#8c4400) sparingly for high-value data points or "New" indicators to provide a sophisticated editorial pop that breaks the monotony.

## 3. Typography: Editorial Authority
We utilize **Inter** (or system-default Helvetica Neue) not just for legibility, but as a structural element.

*   **Display & Headline Scale:** Use `display-md` (2.75rem) for main page headers to establish immediate hierarchy. These should feel "heavy" compared to the surrounding white space.
*   **The Information Grid:** Use `label-md` (0.75rem) with `on_surface_variant` (#3e4944) for metadata. 
*   **Contrast as Navigation:** Use high-contrast weight shifts. A `title-lg` header in bold should be immediately followed by `body-md` in a regular weight to guide the eye without the need for icons.

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a silent language. 

### The Layering Principle
Never use a shadow where a color shift will suffice. Place a `surface_container_lowest` card on a `surface_container_low` background. The 8px border radius (`DEFAULT`: 0.5rem) provides the "object" feel, while the subtle color shift provides the "separation."

### Ambient Shadows (The Exception)
Shadows are reserved only for "floating" elements like Modals or Popovers. 
*   **Spec:** Blur: 24px–40px | Opacity: 4%–6% | Color: Derived from `on_surface`.
*   **Effect:** The shadow should be felt, not seen. It mimics natural, ambient room light.

### The "Ghost Border" Fallback
If a border is required for accessibility in a high-density data table, use the `outline_variant` (#bdc9c2) at **20% opacity**. It should be a suggestion of a line, not a hard stop.

## 5. Components & Primitives

### Buttons
*   **Primary:** `primary_container` (#008060) background with `on_primary` text. No borders.
*   **Secondary:** `secondary_container` (#e4e2e1) with `on_secondary_container` text.
*   **Tertiary/Ghost:** No background. Use `primary` text. These must align perfectly with text grids to maintain the "Editorial" flow.

### Cards & Containers
*   **Constraint:** Forbid the use of divider lines within cards.
*   **Solution:** Use the **Spacing Scale**. Use `3` (1rem) or `4` (1.4rem) to separate internal content blocks. The white space acts as the divider.

### Input Fields
*   **Style:** `surface_container_lowest` (#ffffff) background with a "Ghost Border" (10% `outline`). 
*   **State:** On focus, the border disappears and is replaced by a 2px `primary` bottom-accent only. This maintains the "Ledger" aesthetic.

### Data Lists
*   **Structure:** Avoid row stripes. Use a `surface_container_low` hover state to highlight rows.
*   **Leading Elements:** Use high-resolution typography or simple 8px-radius avatars. Avoid complex icons that clutter the "airy" feel.

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but allow large right-hand gutters for "breathing room."
*   **Layer Tones:** Use `surface_container_highest` for "Read Only" or "Disabled" sections to create a sense of recessed depth.
*   **Use Large Spacing:** When in doubt, increase the margin. Use `8` (2.75rem) for section gaps.

### Don't:
*   **No 100% Opaque Borders:** Never use a solid grey line to separate content.
*   **No Gradients or Glassmorphism:** We rely on solid, confident blocks of color and tonal shifts.
*   **No "Floating" Buttons:** Unless it’s a primary action, buttons should feel "anchored" to the grid of the card or section.
*   **No Default Shadows:** Avoid the standard CSS `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`. It is too heavy for this system.