import sutra from "../data/sutra/diamond-sutra/sanskrit-devanagari.txt?raw";

const passages = sutra.trim().split(/\n\s*\n/);
const sectionMarker = /(॥[०-९]+॥)/g;
const isSectionMarker = /^॥[०-९]+॥$/;

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
  return (
    <main className="sutra-page">
      <header className="masthead">
        <span className="masthead__mark" aria-hidden="true">
          ◆
        </span>
        <div>
          <p className="masthead__kicker">
            Vajracchedikā Prajñāpāramitā Sūtra
          </p>
          <h1>वज्रच्छेदिका</h1>
        </div>
      </header>

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
