<script setup lang="ts">
import { ref } from "vue";
import QuakeleGame from "./components/QuakeleGame.vue";
import QuakeleHeader from "./components/QuakeleHeader.vue";
import Stats from "./components/Stats.vue";

type Screen = "home" | "game" | "stats";

const screen = ref<Screen>("home");
</script>

<template>
  <div class="page">
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
    <Stats v-else />

    <footer class="footer">
      <a href="https://github.com/Domiko7/quakele" target="_blank" rel="noreferrer" class="link">GitHub</a>
      <span class="footer-sep">·</span>
      <span>Made with ❤️</span>
    </footer>
  </div>
</template>
