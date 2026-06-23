const excerpts = [
  {
    title: "All conditioned things",
    chinese: "一切有為法，如夢幻泡影，如露亦如電，應作如是觀。",
    note: "A reminder to read experience as vivid, temporary, and not finally graspable."
  },
  {
    title: "Without attachment",
    chinese: "應無所住，而生其心。",
    note: "Let attention arise without fastening itself to status, certainty, or possession."
  },
  {
    title: "The teaching as raft",
    chinese: "法尚應捨，何況非法。",
    note: "Even useful teachings are not objects to cling to after they have carried understanding."
  }
];

function App() {
  return (
    <main className="page-shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero__mark" aria-hidden="true">
          ◇
        </div>
        <p className="eyebrow">Vajracchedika Prajnaparamita Sutra</p>
        <h1 id="page-title">Diamond Sutra</h1>
        <p className="hero__copy">
          A quiet reading room for selected public-domain Chinese passages from
          the Diamond Sutra, with original English context for slow study.
        </p>
        <div className="hero__meta" aria-label="Page attributes">
          <span>Classical Chinese excerpts</span>
          <span>No network requests</span>
          <span>GitHub Pages ready</span>
        </div>
      </section>

      <section className="reading-panel" aria-label="Selected passages">
        <div className="section-heading">
          <p className="eyebrow">Selected passages</p>
          <h2>A readable sutra-first landing page</h2>
        </div>
        <div className="excerpt-grid">
          {excerpts.map((excerpt) => (
            <article className="excerpt-card" key={excerpt.chinese}>
              <p className="excerpt-card__title">{excerpt.title}</p>
              <blockquote lang="zh-Hant">{excerpt.chinese}</blockquote>
              <p>{excerpt.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="context-grid" aria-label="Reading context">
        <article>
          <h2>About the text</h2>
          <p>
            The Diamond Sutra belongs to the Prajnaparamita tradition and is
            presented here as a contemplative scripture page rather than a
            complete scholarly edition.
          </p>
        </article>
        <article>
          <h2>Reading focus</h2>
          <p>
            The first version favors spacious typography, short passages, and
            enough context to support repeated reading without overwhelming the
            sutra itself.
          </p>
        </article>
        <article>
          <h2>Quiet reading room</h2>
          <p>
            Warm paper tones, ink-like type, and restrained gold accents create
            a Buddhist theme while keeping the text central on every viewport.
          </p>
        </article>
      </section>

      <footer className="closing">
        <p>Read slowly. Release the line. Return to the breath.</p>
      </footer>
    </main>
  );
}

export default App;
