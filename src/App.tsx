import { useEffect, useState } from "react";
import { CityGuess } from "./components/CityGuess";
import { YearGuess } from "./components/YearGuess";
import { Map } from "./components/Map";
import { useDailyQuake } from "./hooks/useDailyQuake";
import type { GamePhase } from "./types";
import { themes, ThemeMode, getEarthquakeColor } from "./utils/color";
import { getPuzzleNumber } from "./utils/seed";
import { loadGameState, saveGameState } from "./utils/storage";

const SITE_URL = "https://quakele.domiko.dev";

interface PhaseResult<T> {
  guesses: T[];
  won: boolean;
}

const saved = loadGameState();

const App = () => {
  const { earthquake, cities, loading, error } = useDailyQuake();
  const [phase, setPhase] = useState<GamePhase>(saved?.phase ?? "city");
  const [cityGuesses, setCityGuesses] = useState<string[]>(saved?.cityGuesses ?? []);
  const [cityResult, setCityResult] = useState<PhaseResult<string> | null>(saved?.cityResult ?? null);
  const [yearGuesses, setYearGuesses] = useState<number[]>(saved?.yearGuesses ?? []);
  const [yearResult, setYearResult] = useState<PhaseResult<number> | null>(saved?.yearResult ?? null);
  const [copied, setCopied] = useState(false);
  const currentTheme = getEarthquakeColor(earthquake?.magnitude ?? 0);

  useEffect(() => {
    saveGameState({ phase, cityGuesses, cityResult, yearGuesses, yearResult });
  }, [phase, cityGuesses, cityResult, yearGuesses, yearResult]);

  const handleCityComplete = (guesses: string[], won: boolean) => {
    setCityResult({ guesses, won });
    if (won) setPhase("year");
    else setPhase("done");
  };

  const handleYearComplete = (guesses: number[], won: boolean) => {
    setYearResult({ guesses, won });
    setPhase("done");
  };

  const buildShareText = () => {
    const num = getPuzzleNumber();
    const answerCity = cities[0]?.name.toLowerCase() ?? "";

    const cityEmojis = (cityResult?.guesses ?? [])
      .map((g) => (g.toLowerCase() === answerCity ? "🟩" : "⬛"))
      .join("");

    const yearEmojis = (yearResult?.guesses ?? [])
      .map((g) => {
        const diff = Math.abs(g - (earthquake?.year ?? 0));
        if (diff === 0) return "✅";
        if (diff <= 3) return "🟨";
        return g < (earthquake?.year ?? 0) ? "⬆️" : "⬇️";
      })
      .join("");

    const lines = [`QUAKELE #${num}`, `🏙 ${cityEmojis}`];
    if (yearEmojis) lines.push(`📅 ${yearEmojis}`);
    lines.push(SITE_URL);
    return lines.join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildShareText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDepthPhrase = (depth: number): { pre?: string; post?: string } => {
    if (depth <= 15) return { pre: "very shallow" };
    if (depth <= 40) return { pre: "shallow" };
    if (depth <= 150) return { post: "of intermediate depth" };
    if (depth <= 300) return { pre: "deep" };
    return { pre: "very deep" };
  };

  return (
    <div style={themes[currentTheme]} className="page">
      <header className="header">
        <div className="title">QUAKELE</div>
        <div className="subtitle">Daily earthquake puzzle</div>
      </header>

      {loading && <p className="status">Loading today's earthquake…</p>}
      {error   && <p className="status">Error: {error}</p>}

      {earthquake && (
        <>
          <div className="clue-card">
            <div className="mag-badge">M{earthquake.magnitude.toFixed(1)}</div>
            <p className="clue-text">
              {(() => {
                const { pre, post } = getDepthPhrase(earthquake.depthKm);
                return <>A <strong>{pre && `${pre} `}magnitude {earthquake.magnitude.toFixed(1)}</strong> earthquake{post && <> <strong>{post}</strong></>} struck somewhere on Earth. Guess the nearest major city, then the year.</>;
              })()}
            </p>
          </div>

          {phase === "city" && (
            <CityGuess
              cities={cities}
              initialGuesses={saved?.cityGuesses}
              onComplete={handleCityComplete}
              onGuess={setCityGuesses}
            />
          )}

          {phase === "year" && (
            <>
              <p className="phase-banner">City found — now guess the year</p>
              <YearGuess
                answer={earthquake.year}
                initialGuesses={saved?.yearGuesses}
                onComplete={handleYearComplete}
                onGuess={setYearGuesses}
              />
            </>
          )}

          {phase === "done" && (
            <div className="section-card">
              {cityResult?.won && yearResult?.won && (
                <p style={{ textAlign: "center", color: "var(--green)", fontWeight: 700, marginBottom: "0.5rem" }}>
                You got it!
                </p>
              )}
              <a
              href={`https://earthquake.usgs.gov/earthquakes/eventpage/${earthquake.id}/executive`}
              className="link"
              >
                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
                  {earthquake.place} — {earthquake.year}
                </p>
              </a>
              <button className="copy-btn" onClick={handleCopy}>
                {copied ? "Copied!" : "Share results"}
              </button>
            </div>
          )}
        </>
      )}
      <Map cities={cities} cityGuesses={cityGuesses} phase={phase} earthquake={earthquake} />

      <footer className="footer">
        <a href="https://github.com/Domiko7/quakele" target="_blank" rel="noreferrer" className="link">
          GitHub
        </a>
        <span className="footer-sep">·</span>
        <span>Made with ❤️</span>
      </footer>
    </div>
  );
};

export default App;
