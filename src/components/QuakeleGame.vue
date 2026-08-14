<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CityGuess from "./CityGuess.vue";
import YearGuess from "./YearGuess.vue";
import QuakeMap from "./Map.vue";
import { useDailyQuake } from "../hooks/useDailyQuake";
import type { GamePhase } from "../types";
import { themes, getEarthquakeColor } from "../utils/color";
import { getPuzzleNumber } from "../utils/seed";
import { loadGameState, recordDailyResult, saveGameState } from "../utils/storage";


interface PhaseResult<T> { guesses: T[]; won: boolean }

const SITE_URL = "https://quakele.domiko.dev";
const saved = loadGameState();
const { earthquake, cities, loading, error, startPractice } = useDailyQuake();
const isPractice = ref(false);
const phase = ref<GamePhase>(saved?.phase ?? "city");
const cityGuesses = ref(saved?.cityGuesses ?? []);
const cityResult = ref<PhaseResult<string> | null>(saved?.cityResult ?? null);
const yearGuesses = ref(saved?.yearGuesses ?? []);
const yearResult = ref<PhaseResult<number> | null>(saved?.yearResult ?? null);
const copied = ref(false);
const roundKey = ref(0);
const theme = computed(() => themes[getEarthquakeColor(earthquake.value?.magnitude ?? 0)]);

if (saved?.phase === "done") {
  recordDailyResult(Boolean(saved.cityResult?.won && saved.yearResult?.won));
}

watch([phase, cityGuesses, cityResult, yearGuesses, yearResult], () => {
  if (isPractice.value) return;
  saveGameState({
    phase: phase.value,
    cityGuesses: cityGuesses.value,
    cityResult: cityResult.value,
    yearGuesses: yearGuesses.value,
    yearResult: yearResult.value,
  });
}, { deep: true });

const beginPractice = () => {
  isPractice.value = true;
  phase.value = "city";
  cityGuesses.value = [];
  cityResult.value = null;
  yearGuesses.value = [];
  yearResult.value = null;
  copied.value = false;
  startPractice();
  roundKey.value += 1;
};

const completeCity = (guesses: string[], won: boolean) => {
  cityResult.value = { guesses, won };
  phase.value = won ? "year" : "done";
  if (!won && !isPractice.value) recordDailyResult(false);
};

const completeYear = (guesses: number[], won: boolean) => {
  yearResult.value = { guesses, won };
  phase.value = "done";
  if (!isPractice.value) recordDailyResult(won);
};

const depthPhrase = (depth: number) => depth <= 15
  ? "very shallow"
  : depth <= 40
    ? "shallow"
    : depth <= 150
      ? "moderately deep"
      : depth <= 300 ? "deep" : "very deep";

const buildShareText = (isPractice: boolean) => {
  const answerCity = cities.value[0]?.name.toLowerCase() ?? "";
  const cityEmoji = (cityResult.value?.guesses ?? [])
    .map((guess) => guess.toLowerCase() === answerCity ? "🟩" : "⬛")
    .join("");
  const yearEmoji = (yearResult.value?.guesses ?? []).map((guess) => {
    const answer = earthquake.value?.year ?? 0;
    const diff = Math.abs(guess - answer);
    return diff === 0 ? "✅" : diff <= 3 ? "🟨" : guess < answer ? "⬆️" : "⬇️";
  }).join("");

  const lines = isPractice
    ? [`QUAKELE PRACTICE MODE`, `🏙 ${cityEmoji}`]
    : [`QUAKELE #${getPuzzleNumber()}`, `🏙 ${cityEmoji}`];

  if (yearEmoji) lines.push(`📅 ${yearEmoji}`);
  return [...lines, SITE_URL].join("\n");
};

const copyResults = async (isPractice: boolean) => {
  await navigator.clipboard.writeText(buildShareText(isPractice));
  copied.value = true;
  window.setTimeout(() => { copied.value = false; }, 2000);
};
</script>

<template>
  <main class="game-view" :style="theme">
    <p v-if="loading" class="status">Loading today's earthquake…</p>
    <p v-if="error" class="status">Error: {{ error }}</p>

    <template v-if="earthquake">
      <div class="clue-card">
        <div class="mag-badge">M{{ earthquake.magnitude.toFixed(1) }}</div>
        <p class="clue-text">A <span class="clue-depth">{{ depthPhrase(earthquake.depthKm) }}</span> <strong>magnitude {{ earthquake.magnitude.toFixed(1) }}</strong> earthquake struck somewhere on Earth. Guess the nearest major city, then the year.</p>
      </div>

      <CityGuess v-if="phase === 'city'" :key="`city-${roundKey}`" :cities="cities" :initial-guesses="isPractice ? [] : saved?.cityGuesses" @complete="completeCity" @guess="cityGuesses = $event" />

      <template v-if="phase === 'year'">
        <p class="phase-banner">City found — now guess the year</p>
        <YearGuess :key="`year-${roundKey}`" :answer="earthquake.year" :initial-guesses="isPractice ? [] : saved?.yearGuesses" @complete="completeYear" @guess="yearGuesses = $event" />
      </template>

      <div v-if="phase === 'done'" class="section-card">
        <p v-if="cityResult?.won && yearResult?.won" class="done-message">You got it!</p>
        <a :href="`https://earthquake.usgs.gov/earthquakes/eventpage/${earthquake.id}/executive`" class="link">
          <p class="done-place-link">{{ earthquake.place }} — {{ earthquake.year }}</p>
        </a>
        <button v-if="!isPractice" class="copy-btn" @click="copyResults(false)">{{ copied ? "Copied!" : "Share results" }}</button>
        <button v-else class="copy-btn" @click="copyResults(true)">{{ copied ? "Copied!" : "Share results" }}></button>
      </div>
    </template>

    <QuakeMap :cities="cities" :city-guesses="cityGuesses" :phase="phase" :earthquake="earthquake" />
    <button v-if="earthquake" class="practice-btn" type="button" @click="beginPractice">
      {{ isPractice ? "New practice quake" : "Practice mode" }}
    </button>
  </main>
</template>
