<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(defineProps<{
  answer: number;
  maxGuesses?: number;
  initialGuesses?: number[];
}>(), { maxGuesses: 5, initialGuesses: () => [] });

const emit = defineEmits<{
  complete: [guesses: number[], won: boolean];
  guess: [guesses: number[]];
}>();

const input = ref("");
const guesses = ref([...props.initialGuesses]);
const remaining = computed(() => props.maxGuesses - guesses.value.length);
const won = computed(() => guesses.value.includes(props.answer));
const lost = computed(() => !won.value && remaining.value <= 0);

const temperature = (guess: number) => {
  const diff = Math.abs(guess - props.answer);
  if (diff === 0) return { label: "correct!", cls: "correct" };
  if (diff <= 3) return { label: "scorching (1-3 yrs off)", cls: "temp-scorching" };
  if (diff <= 7) return { label: "hot (4-7 yrs off)", cls: "temp-hot" };
  if (diff <= 15) return { label: "warm (8-15 yrs off)", cls: "temp-warm" };
  if (diff <= 25) return { label: "cold (16-25 yrs off)", cls: "temp-cold" };
  if (diff <= 40) return { label: "very cold (26-40 yrs off)", cls: "temp-very-cold" };
  return { label: "freezing (40+ yrs off)", cls: "temp-freezing" };
};

const submit = () => {
  const year = Number.parseInt(input.value, 10);
  if (!year || won.value || lost.value) return;
  guesses.value = [...guesses.value, year];
  input.value = "";
  emit("guess", guesses.value);
  const correct = year === props.answer;
  if (correct || guesses.value.length >= props.maxGuesses) emit("complete", guesses.value, correct);
};
</script>

<template>
  <div class="section-card">
    <p class="section-label">Year</p>
    <form class="input-row" @submit.prevent="submit">
      <input v-model="input" class="guess-input" type="number" placeholder="e.g. 2010" min="1000" :max="new Date().getUTCFullYear()" :disabled="won || lost">
      <button class="guess-btn" type="submit" :disabled="won || lost">Guess</button>
    </form>
    <p class="remaining">{{ remaining }} guess{{ remaining !== 1 ? "es" : "" }} remaining</p>
    <ul class="guess-list">
      <li v-for="(guess, index) in guesses" :key="index" class="guess-item" :class="temperature(guess).cls">
        <span class="guess-name">{{ guess }}</span>
        <span class="guess-hint">{{ temperature(guess).label }}</span>
      </li>
    </ul>
    <div v-if="won" class="result-banner success">Correct — the earthquake was in {{ answer }}</div>
    <div v-if="lost" class="result-banner failure">The answer was <strong>{{ answer }}</strong></div>
  </div>
</template>
