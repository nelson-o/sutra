import { useEffect, useState } from "react";
import sutra from "../data/sutra/diamond-sutra/sanskrit-devanagari.txt?raw";

const passages = sutra.trim().split(/\n\s*\n/);
const sectionMarker = /(॥[०-९]+॥)/g;
const isSectionMarker = /^॥[०-९]+॥$/;
const compactHeaderScrollThreshold = 16;

function renderPassage(passage: string) {
  return passage.split(sectionMarker).map((part, index) =>
    isSectionMarker.test(part) ? (
      <span className="sutra-text__section" key={`${part}-${index}`}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      setIsScrolled(window.scrollY > compactHeaderScrollThreshold);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  return (
    <main className="sutra-page">
      <div className="masthead-space">
        <header
          className={`masthead${isScrolled ? " masthead--compact" : ""}`}
        >
          <h1>वज्रच्छेदिका</h1>
        </header>
      </div>

      <article
        className="sutra-text"
        lang="sa-Deva"
        aria-label="Complete Diamond Sutra in Sanskrit"
      >
        {passages.map((passage, index) => (
          <p
            className={
              index === passages.length - 1
                ? "sutra-text__colophon"
                : undefined
            }
            key={`${index}-${passage.slice(0, 24)}`}
          >
            {renderPassage(passage)}
          </p>
        ))}
      </article>
    </main>
  );
}

export default App;
