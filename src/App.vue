<script setup lang="ts">
import { ref, onMounted } from "vue";
import confetti from "canvas-confetti";
import QuakeleGame from "./components/QuakeleGame.vue";
import QuakeleHeader from "./components/QuakeleHeader.vue";
import Stats from "./components/Stats.vue";
import Learn from "./components/Learn.vue";

type Screen = "home" | "game" | "stats" | "learn";

const screen = ref<Screen>("home");
const notice = ref<boolean>(true);

onMounted(() => {
  const count = 300;
  const defaults = { origin: { y: 0.6 } };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
});
</script>

<template>
  <div class="anniversary-notice" v-if="notice">
    <span class="anniversary-notice-title">Quakele's Anniversary!</span>
    <span class="anniversary-notice-description">It's quakele's 100th (day) anniversary! Thank you for using this site. New awesome things will be added soon. P.S. Special thanks to the GlobalQuake community!</span>
    <button class="notice-btn" @click="notice = false">
      Close
    </button>
  </div>
  <div class="page" :class="{ blur: notice }">
    <QuakeleHeader :show-back="screen !== 'home'" @back="screen = 'home'" />

    <template v-if="screen === 'home'">
      <main class="game-grid">
        <button class="game-card" type="button" @click="screen = 'game'">
          <span class="game-card-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M361-80q-14 0-24.5-7.5T322-108L220-440H80v-80h170q13 0 23.5 7.5T288-492l66 215 127-571q3-14 14-23t25-9q14 0 25 8.5t14 22.5l87 376 56-179q4-13 14.5-20.5T740-680q13 0 23 7t15 19l50 134h52v80h-80q-13 0-23-7t-15-19l-19-51-65 209q-4 13-15 21t-25 7q-14-1-24-9.5T601-311l-81-348-121 548q-3 14-13.5 22T361-80Z"/></svg></span>
          <span class="game-card-content">
            <span class="game-card-title">QUAKELE</span>
            <span class="game-card-description">Find the city closest to a major earthquake, then guess when it happened.</span>
            <span class="game-card-meta">Daily puzzle</span>
          </span>
          <span class="game-card-action">Play <span aria-hidden="true">→</span></span>
        </button>
        <button class="game-card" type="button" @click="screen = 'learn'">
          <span class="game-card-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640h-80v280l-100-60-100 60v-280H240v640Zm0 0v-640 640Zm200-360 100-60 100 60-100-60-100 60Z"/></svg></span>
          <span class="game-card-content">
            <span class="game-card-title">LEARN</span>
            <span class="game-card-description">Learn some seismology stuff in a fun way!</span>
            <span class="game-card-meta">Learn</span>
          </span>
          <span class="game-card-action">Play <span aria-hidden="true">→</span></span>
        </button>
        <button class="game-card" type="button" @click="screen = 'stats'">
          <span class="game-card-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M395-475q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm410-350q70-70 70-170t-70-170q-70-70-170-70t-170 70q-70 70-70 170t70 170q70 70 170 70t170-70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z"/></svg></span>
          <span class="game-card-content">
            <span class="game-card-title">STREAK</span>
            <span class="game-card-description">Check your done quakeles, your streak and your performance!</span>
            <span class="game-card-meta">Stats</span>
          </span>
          <span class="game-card-action">Check <span aria-hidden="true">→</span></span>
        </button>
      </main>
    </template>

    <QuakeleGame v-else-if="screen === 'game'" />
    <Learn v-else-if="screen === 'learn'" />
    <Stats v-else />

    <footer class="footer">
      <a href="https://github.com/Domiko7/quakele" target="_blank" rel="noreferrer" class="link">GitHub</a>
      <span class="footer-sep">·</span>
      <span>Made with ❤️</span>
    </footer>
  </div>
</template>