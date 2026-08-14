import { onMounted, onUnmounted, ref } from "vue";
import type { Earthquake, NearbyCity } from "../types";
import { WORLD_CITIES } from "../data/cities";
import { findNearbyCities } from "../utils/geo";
import { getDailySeed, seededPick } from "../utils/seed";
import { fetchDailyPool } from "../utils/usgs";

export const useDailyQuake = () => {
  const earthquake = ref<Earthquake | null>(null);
  const cities = ref<NearbyCity[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  let pool: Earthquake[] = [];
  let cancelled = false;

  const selectEarthquake = (selected: Earthquake) => {
    earthquake.value = selected;
    cities.value = findNearbyCities(selected.lat, selected.lon, WORLD_CITIES, 15);
  };

  const startPractice = () => {
    if (!pool.length) return;
    const alternatives = pool.filter((quake) => quake.id !== earthquake.value?.id);
    const choices = alternatives.length ? alternatives : pool;
    selectEarthquake(choices[Math.floor(Math.random() * choices.length)]);
  };

  onMounted(async () => {
    try {
      pool = await fetchDailyPool();
      if (!pool.length) throw new Error("No earthquakes found");

      const selected = seededPick(pool, getDailySeed());
      if (!cancelled) {
        selectEarthquake(selected);
      }
    } catch (reason) {
      if (!cancelled) error.value = reason instanceof Error ? reason.message : "Unknown error";
    } finally {
      if (!cancelled) loading.value = false;
    }
  });

  onUnmounted(() => { cancelled = true; });
  return { earthquake, cities, loading, error, startPractice };
};
