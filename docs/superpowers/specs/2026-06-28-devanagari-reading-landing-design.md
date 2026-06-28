# Devanāgarī Reading Landing Design

## Goal

Replace the excerpt-oriented landing page with an elegant, full-text reading
page for the complete Sanskrit Diamond Sutra in Devanāgarī. The compact title
and the beginning of the sutra must both appear in the initial viewport;
natural document scrolling is expected for the complete text.

## Scope

- Present only the Devanāgarī Sanskrit edition.
- Keep IAST out of this page; it will receive a separate design later.
- Remove the selected Chinese excerpts, explanatory card grid, context cards,
  and contemplative footer from the current landing page.
- Keep the application static and compatible with its existing GitHub Pages
  deployment at `/sutra/`.

## Content and Data Flow

`src/App.tsx` imports
`data/sutra/diamond-sutra/sanskrit-devanagari.txt` through Vite's `?raw`
support. The application splits the source on blank lines and renders each
non-empty block as a semantic paragraph. This preserves the opening, all 32
numbered sections, verses, and final colophon without a runtime network
request or a duplicated TypeScript copy of the scripture.

The compact header contains a restrained diamond mark, a small Romanized
identifier, and the Devanāgarī title. The complete source follows immediately
inside a single reading region.

## Visual Design

The page uses the selected "quiet manuscript" direction:

- A full-width warm ivory canvas with subtle CSS-only paper shading.
- A restrained vermilion accent for the mark and small metadata.
- A compact header that does not consume the first viewport.
- One centered Devanāgarī reading column with a comfortable 42–48-character
  measure where the viewport permits.
- A serif Devanāgarī font stack, generous line height, and clear paragraph
  rhythm for sustained reading.
- Muted section markers and a gently distinguished final colophon.
- Responsive margins and type sizing that preserve the same document flow on
  narrow screens.

The page does not use cards, ornamental image assets, sticky controls, script
toggles, or separate explanatory sections.

## Accessibility and Failure Behavior

- The page retains one descriptive `h1` and one semantic reading region.
- The Devanāgarī text is marked `lang="sa-Deva"`.
- Foreground and accent colors maintain readable contrast against the ivory
  background.
- Text remains selectable, zoomable, and available in normal document flow.
- Because the source is a build-time import, a missing or invalid source file
  fails the build instead of producing an empty reader at runtime.

## Verification

Component tests verify that the page renders:

- The compact Diamond Sutra heading.
- The Devanāgarī opening passage.
- Section 32.
- The final Devanāgarī colophon.
- None of the old selected-excerpt or context-card copy.

The implementation is complete when the test suite and production build pass,
and a browser inspection confirms that the compact header and opening text fit
within a desktop viewport while the full sutra remains naturally scrollable.
