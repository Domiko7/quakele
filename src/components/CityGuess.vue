<script setup lang="ts">
import { computed, ref } from "vue";
import type { NearbyCity } from "../types";

const props = withDefaults(defineProps<{
  cities: NearbyCity[];
  maxGuesses?: number;
  initialGuesses?: string[];
}>(), { maxGuesses: 5, initialGuesses: () => [] });

const emit = defineEmits<{
  complete: [guesses: string[], won: boolean];
  guess: [guesses: string[]];
}>();

const input = ref("");
const guesses = ref([...props.initialGuesses]);
const answer = computed(() => props.cities[0]);
const cityOptions = computed(() => {
  const shuffled = [...props.cities];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  if (shuffled.length > 1 && shuffled[0] === answer.value) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
});
const remaining = computed(() => props.maxGuesses - guesses.value.length);
const won = computed(() => guesses.value.some((guess) => guess.toLowerCase() === answer.value?.name.toLowerCase()));
const lost = computed(() => !won.value && remaining.value <= 0);

const hintFor = (guess: string) => {
  const match = props.cities.find((city) => city.name.toLowerCase() === guess.toLowerCase());
  if (guess.toLowerCase() === answer.value.name.toLowerCase()) return `${answer.value.distanceKm.toLocaleString()} km from epicenter`;
  return match ? `${match.distanceKm.toLocaleString()} km — try closer` : "not in today's city list";
};

const submit = () => {
  const trimmed = input.value.trim();
  if (!trimmed || won.value || lost.value) return;
  guesses.value = [...guesses.value, trimmed];
  input.value = "";
  emit("guess", guesses.value);
  const correct = trimmed.toLowerCase() === answer.value.name.toLowerCase();
  if (correct || guesses.value.length >= props.maxGuesses) emit("complete", guesses.value, correct);
};
</script>

<template>
  <div class="section-card">
    <p class="section-label">City</p>
    <form class="input-row" @submit.prevent="submit">
      <input v-model="input" class="guess-input" list="city-options" placeholder="Nearest major city…" :disabled="won || lost" autocomplete="off">
      <datalist id="city-options">
        <option v-for="city in cityOptions" :key="city.name" :value="city.name" />
      </datalist>
      <button class="guess-btn" type="submit" :disabled="won || lost">Guess</button>
    </form>
    <p class="remaining">{{ remaining }} guess{{ remaining !== 1 ? "es" : "" }} remaining</p>
    <ul class="guess-list">
      <li v-for="(guess, index) in guesses" :key="index" class="guess-item" :class="guess.toLowerCase() === answer.name.toLowerCase() ? 'correct' : 'wrong'">
        <span class="guess-name">{{ guess }}</span>
        <span class="guess-hint">{{ hintFor(guess) }}</span>
      </li>
    </ul>
    <div v-if="won" class="result-banner success">
      {{ answer.name }}, {{ answer.country }} — {{ answer.distanceKm.toLocaleString() }} km from the epicenter
    </div>
    <div v-if="lost" class="result-banner failure">
      The nearest city was <strong>{{ answer.name }}, {{ answer.country }}</strong> ({{ answer.distanceKm.toLocaleString() }} km)
    </div>
  </div>
</template>
