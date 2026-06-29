import { useEffect, useState } from "react";
import sutra from "../data/sutra/diamond-sutra/sanskrit-devanagari.txt?raw";

const sectionMarker = /(॥[०-९]+॥)/g;
const isSectionMarker = /^॥[०-९]+॥$/;
const compactHeaderScrollThreshold = 16;
const markerCount = 32;
const lastMarkerStorageKey = "sutra:last-marker";
const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

type SutraPage = {
  markerNumber: number;
  marker: string;
  passages: string[];
};

function toDevanagariNumber(value: number) {
  return String(value)
    .split("")
    .map((digit) => devanagariDigits[Number(digit)])
    .join("");
}

function markerFor(value: number) {
  return `॥${toDevanagariNumber(value)}॥`;
}

function createSutraPages(source: string): SutraPage[] {
  const text = source.trim();
  let cursor = 0;

  return Array.from({ length: markerCount }, (_, index) => {
    const markerNumber = index + 1;
    const marker = markerFor(markerNumber);
    const markerIndex = text.indexOf(marker, cursor);
    const endIndex =
      markerNumber === markerCount
        ? text.length
        : markerIndex + marker.length;

    if (markerIndex === -1) {
      throw new Error(`Missing sutra marker ${marker}`);
    }

    const pageText = text.slice(cursor, endIndex).trim();
    cursor = markerIndex + marker.length;

    return {
      markerNumber,
      marker,
      passages: pageText.split(/\n\s*\n/).filter(Boolean)
    };
  });
}

const sutraPages = createSutraPages(sutra);

function getSavedPageIndex() {
  try {
    const savedMarker = window.localStorage.getItem(lastMarkerStorageKey);
    const savedMarkerNumber = Number(savedMarker);

    if (
      Number.isInteger(savedMarkerNumber) &&
      savedMarkerNumber >= 1 &&
      savedMarkerNumber <= sutraPages.length
    ) {
      return savedMarkerNumber - 1;
    }
  } catch {
    return 0;
  }

  return 0;
}

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
  const [currentPageIndex, setCurrentPageIndex] = useState(getSavedPageIndex);
  const currentPage = sutraPages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === sutraPages.length - 1;

  useEffect(() => {
    const updateHeader = () => {
      setIsScrolled(window.scrollY > compactHeaderScrollThreshold);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        lastMarkerStorageKey,
        String(currentPage.markerNumber)
      );
    } catch {
      // Reading progress persistence is optional.
    }
  }, [currentPage.markerNumber]);

  function goToPreviousPage() {
    setCurrentPageIndex((pageIndex) => Math.max(0, pageIndex - 1));
  }

  function goToNextPage() {
    setCurrentPageIndex((pageIndex) =>
      Math.min(sutraPages.length - 1, pageIndex + 1)
    );
  }

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
        {currentPage.passages.map((passage, index) => (
          <p
            className={
              currentPage.markerNumber === markerCount &&
              index === currentPage.passages.length - 1
                ? "sutra-text__colophon"
                : undefined
            }
            key={`${index}-${passage.slice(0, 24)}`}
          >
            {renderPassage(passage)}
          </p>
        ))}
      </article>

      <footer className="sutra-paginator" aria-label="Sutra marker paginator">
        <button
          aria-label="Previous marker"
          className="sutra-paginator__button"
          disabled={isFirstPage}
          onClick={goToPreviousPage}
          type="button"
        >
          Previous
        </button>

        <div className="sutra-paginator__status" aria-live="polite">
          <span className="sutra-paginator__marker">{currentPage.marker}</span>
          <span className="sutra-paginator__count">
            {currentPage.markerNumber} / {sutraPages.length}
          </span>
        </div>

        <button
          aria-label="Next marker"
          className="sutra-paginator__button"
          disabled={isLastPage}
          onClick={goToNextPage}
          type="button"
        >
          Next
        </button>
      </footer>
    </main>
  );
}

export default App;
