<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { loadPlayerStats } from "../utils/storage";
import { getPuzzleNumber } from "../utils/seed";

const stats = loadPlayerStats();
const activityScroll = ref<HTMLDivElement | null>(null);
const gamesPlayed = computed(() => stats.attemptedPuzzleNumbers.length);
const gamesWon = computed(() => stats.completedPuzzleNumbers.length);
const winRate = computed(() => gamesPlayed.value
  ? Math.round((gamesWon.value / gamesPlayed.value) * 100)
  : 0);

type ActivityStatus = "completed" | "missed" | "empty";

interface ActivityDay {
  key: string;
  date: string;
  label: string;
  status: ActivityStatus;
}

const activityDays = computed<(ActivityDay | null)[]>(() => {
  const completed = new Set(stats.completedPuzzleNumbers);
  const attempted = new Set(stats.attemptedPuzzleNumbers);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - 364);
  const days: (ActivityDay | null)[] = Array(firstDay.getDay()).fill(null);
  const currentPuzzle = getPuzzleNumber();

  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + offset);
    const puzzleNumber = currentPuzzle - (364 - offset);
    const status: ActivityStatus = completed.has(puzzleNumber)
      ? "completed"
      : attempted.has(puzzleNumber) ? "missed" : "empty";
    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    days.push({
      key: date.toISOString().slice(0, 10),
      date: formattedDate,
      label: `${formattedDate}: ${status === "completed" ? "completed" : status === "missed" ? "not completed" : "not played"}`,
      status,
    });
  }
  return days;
});

onMounted(async () => {
  await nextTick();
  if (activityScroll.value) {
    activityScroll.value.scrollLeft = activityScroll.value.scrollWidth;
  }
});
</script>

<template>
  <main class="stats-view">
    <div class="stats-heading">
      <h1>STATS</h1>
      <p>Keep solving the daily Quakele to grow your streak.</p>
    </div>

    <section class="stats-grid" aria-label="Quakele statistics">
      <div class="stat-card stat-card-featured">
        <strong>{{ stats.currentStreak }}</strong>
        <span>Current streak</span>
      </div>
      <div class="stat-card">
        <strong>{{ stats.longestStreak }}</strong>
        <span>Best streak</span>
      </div>
      <div class="stat-card">
        <strong>{{ gamesPlayed }}</strong>
        <span>Played</span>
      </div>
      <div class="stat-card">
        <strong>{{ gamesWon }}</strong>
        <span>Completed</span>
      </div>
      <div class="stat-card">
        <strong>{{ winRate }}%</strong>
        <span>Completion rate</span>
      </div>
    </section>

    <section class="activity-card" aria-labelledby="activity-title">
      <div class="activity-header">
        <div>
          <p class="section-label">Daily history</p>
          <h2 id="activity-title">Last 365 days</h2>
        </div>
        <div class="activity-legend" aria-label="Activity legend">
          <span><i class="activity-cell empty" /> Not played</span>
          <span><i class="activity-cell missed" /> Missed</span>
          <span><i class="activity-cell completed" /> Completed</span>
        </div>
      </div>

      <div ref="activityScroll" class="activity-scroll">
        <div class="activity-chart">
          <div class="activity-weekdays" aria-hidden="true">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span>
            <span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div class="activity-cells" role="img" aria-label="Daily Quakele activity for the last 365 days">
            <template v-for="(day, index) in activityDays" :key="day?.key ?? `padding-${index}`">
              <span v-if="!day" class="activity-cell spacer" aria-hidden="true" />
              <span
                v-else
                class="activity-cell"
                :class="day.status"
                :title="day.label"
                :aria-label="day.label"
              />
            </template>
          </div>
        </div>
      </div>
    </section>

    <p v-if="gamesPlayed === 0" class="stats-empty">
      No daily puzzles attempted yet. Play today’s Quakele to start your streak.
    </p>
  </main>
</template>
