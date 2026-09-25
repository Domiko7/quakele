<script setup lang="ts">
import { ref } from "vue";
import BeachBall from "./BeachBall.vue";
import { randomizeFocalMechanism, identifyFocalMechanism } from "../data/focalMechanisms.ts";
import { FocalMechanismType } from "../types.ts";

const randomFocalMechanism = ref(randomizeFocalMechanism());
const answer = ref(identifyFocalMechanism(randomFocalMechanism.value));

const input = ref("");
const won = ref(false);
const lost = ref(false);

const mechanismOptions = [
  "Normal", 
  "Normal-Oblique", 
  "Reverse / Thrust", 
  "Reverse-Oblique", 
  "Strike-Slip"
] satisfies FocalMechanismType[];

const submit = () => {
  if (!input.value.trim() || won.value || lost.value) return;

  if (input.value.trim() === answer.value) {
    won.value = true;
  } else {
    lost.value = true;
  }
};

const restart = () => {
  randomFocalMechanism.value = randomizeFocalMechanism();
  answer.value = identifyFocalMechanism(randomFocalMechanism.value);
  input.value = "";
  won.value = false;
  lost.value = false;
};
</script>

<template>
  <div class="section-card">
    <p class="section-label">Focal mechanism type</p>
    <form class="input-row" @submit.prevent="submit">
      <input v-model="input" class="guess-input" list="fm-options" placeholder="I think it's..." :disabled="won || lost" autocomplete="off">
      <datalist id="fm-options">
        <option v-for="mechanism in mechanismOptions" :key="mechanism" :value="mechanism" />
      </datalist>
      <button class="guess-btn" type="submit" :disabled="won || lost">Enter</button>
    </form>
  </div>

  <div v-if="won" class="result-banner success">
    Success! The answer is {{ answer }}
  </div>
  <div v-if="lost" class="result-banner failure">
    Nope! The answer is {{ answer }}
  </div>

  <div class="section-card-2">
    <BeachBall 
      :strike="randomFocalMechanism.strike" 
      :dip="randomFocalMechanism.dip" 
      :rake="randomFocalMechanism.rake" 
      :size="300"
    />
  </div>

  <button v-if="won || lost" class="restart-btn" @click="restart">
    Play Again
  </button>
</template>