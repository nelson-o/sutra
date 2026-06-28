# Devanāgarī Reading Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the complete Devanāgarī Sanskrit Diamond Sutra as an elegant, compact-header reading page.

**Architecture:** Vite imports the checked-in Devanāgarī text with `?raw`; `App` splits blank-line blocks into semantic paragraphs and renders them after a compact header. CSS provides a responsive quiet-manuscript presentation without runtime assets or network requests.

**Tech Stack:** React 19, TypeScript, Vite raw imports, Vitest, Testing Library, CSS

---

### Task 1: Render the complete Devanāgarī text

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/vite-env.d.ts`
- Read: `data/sutra/diamond-sutra/sanskrit-devanagari.txt`

- [ ] **Step 1: Replace the existing component test with failing reader tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("Diamond Sutra Devanagari reader", () => {
  it("renders the compact heading and complete sutra boundaries", () => {
    render(<App />);

    const reader = screen.getByRole("article", { name: /complete diamond sutra in sanskrit/i });
    expect(screen.getByRole("heading", { level: 1, name: "वज्रच्छेदिका" })).toBeInTheDocument();
    expect(reader).toHaveTextContent("एवं मया श्रुतम्");
    expect(reader).toHaveTextContent("॥३२॥");
    expect(reader).toHaveTextContent("आर्यवज्रच्छेदिका भगवती प्रज्ञापारमिता समाप्ता");
    expect(screen.getByText("॥३२॥")).toHaveClass("sutra-text__section");
  });

  it("removes the old excerpt landing content", () => {
    render(<App />);

    expect(screen.queryByText(/selected public-domain Chinese passages/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/About the text/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `bun run test src/App.test.tsx`

Expected: FAIL because the existing page does not render the Devanāgarī heading, opening, section 32, or colophon.

- [ ] **Step 3: Implement the raw-text reader**

Create `src/vite-env.d.ts` so TypeScript loads Vite's `?raw` module type:

```ts
/// <reference types="vite/client" />
```

Replace `src/App.tsx` with:

```tsx
import sutra from "../data/sutra/diamond-sutra/sanskrit-devanagari.txt?raw";

const passages = sutra.trim().split(/\n\s*\n/);
const sectionMarker = /(॥[०-९]+॥)/g;
const isSectionMarker = /^॥[०-९]+॥$/;

function renderPassage(passage: string) {
  return passage.split(sectionMarker).map((part, index) =>
    isSectionMarker.test(part) ? (
      <span className="sutra-text__section" key={`${part}-${index}`}>{part}</span>
    ) : part
  );
}

function App() {
  return (
    <main className="sutra-page">
      <header className="masthead">
        <span className="masthead__mark" aria-hidden="true">◆</span>
        <div>
          <p className="masthead__kicker">Vajracchedikā Prajñāpāramitā Sūtra</p>
          <h1>वज्रच्छेदिका</h1>
        </div>
      </header>

      <article className="sutra-text" lang="sa-Deva" aria-label="Complete Diamond Sutra in Sanskrit">
        {passages.map((passage, index) => (
          <p className={index === passages.length - 1 ? "sutra-text__colophon" : undefined} key={`${index}-${passage.slice(0, 24)}`}>
            {renderPassage(passage)}
          </p>
        ))}
      </article>
    </main>
  );
}

export default App;
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `bun run test src/App.test.tsx`

Expected: PASS with 2 tests.

### Task 2: Apply the quiet-manuscript reading style

**Files:**
- Modify: `src/styles.css`
- Modify: `index.html`
- Modify: `README.md`

- [ ] **Step 1: Replace the existing landing-page CSS**

```css
:root {
  color: #2b2018;
  background: #eee3cc;
  font-family: Georgia, "Times New Roman", serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% -10rem, rgba(255, 252, 239, 0.96), transparent 38rem),
    linear-gradient(180deg, #f5eddb 0%, #eee2c9 55%, #e7d8ba 100%);
}

.sutra-page {
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3rem) 0 clamp(5rem, 10vw, 9rem);
}

.masthead {
  width: min(100%, 48rem);
  margin: 0 auto clamp(2rem, 6vh, 4rem);
  padding-bottom: clamp(1.25rem, 3vw, 2rem);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(104, 52, 30, 0.24);
}

.masthead__mark {
  color: #9a3f28;
  font-size: 1.1rem;
}

.masthead__kicker {
  margin: 0 0 0.4rem;
  color: #79584a;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #291d16;
  font-family: "Noto Serif Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "Nirmala UI", serif;
  font-size: clamp(2.25rem, 8vw, 4.5rem);
  font-weight: 500;
  line-height: 1;
}

.sutra-text {
  width: min(100%, 48rem);
  margin: 0 auto;
  color: #30241b;
  font-family: "Noto Serif Devanagari", "Kohinoor Devanagari", "Devanagari Sangam MN", "Nirmala UI", serif;
  font-size: clamp(1.22rem, 1.05rem + 0.7vw, 1.7rem);
  line-height: 1.95;
}

.sutra-text p {
  margin: 0 0 1.7em;
}

.sutra-text p:first-child {
  color: #8d3b27;
  font-size: 1.08em;
  text-align: center;
}

.sutra-text__section {
  color: #986c56;
  font-size: 0.78em;
  white-space: nowrap;
}

.sutra-text__colophon {
  margin-top: 3.5rem !important;
  color: #7f3626;
  text-align: center;
}

@media (max-width: 540px) {
  .sutra-page { width: min(100% - 1.25rem, 72rem); }
  .masthead { align-items: flex-start; }
  .masthead__kicker { letter-spacing: 0.07em; }
  .sutra-text { line-height: 1.85; }
}
```

- [ ] **Step 2: Update static page metadata**

```html
<meta
  name="description"
  content="The complete Diamond Sutra in Devanagari Sanskrit, presented as a quiet reading edition."
/>
<title>Diamond Sutra</title>
```

Update the README introduction to describe the complete Devanāgarī Sanskrit
reading page instead of selected passages.

- [ ] **Step 3: Run all tests**

Run: `bun run test`

Expected: PASS with 2 tests and no warnings.

- [ ] **Step 4: Build the production site**

Run: `bun run build`

Expected: TypeScript and Vite complete successfully, and the generated bundle includes the complete Devanāgarī text.

- [ ] **Step 5: Review the change set**

Run: `git diff --check && git status --short`

Expected: no whitespace errors; changes are limited to the approved spec/plan,
`src/App.tsx`, `src/App.test.tsx`, `src/vite-env.d.ts`, `src/styles.css`,
`index.html`, and `README.md`.
