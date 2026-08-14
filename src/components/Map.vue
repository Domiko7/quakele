<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Earthquake, GamePhase, NearbyCity } from "../types";

const props = defineProps<{
  cities: NearbyCity[];
  cityGuesses: string[];
  phase: GamePhase;
  earthquake: Earthquake | null;
}>();

const container = ref<HTMLDivElement | null>(null);
const loaded = ref(false);
let map: maplibregl.Map | null = null;

const updateCities = () => {
  if (!map || !loaded.value || !props.cities.length) return;
  const guessed = new Set(props.cityGuesses.map((guess) => guess.toLowerCase()));
  const answer = props.cities[0].name.toLowerCase();
  const data: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: props.cities.map((city) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [city.lon, city.lat] },
      properties: {
        name: city.name,
        status: guessed.has(city.name.toLowerCase())
          ? city.name.toLowerCase() === answer ? "correct" : "wrong"
          : "default",
      },
    })),
  };
  const source = map.getSource("cities") as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData(data);
  } else {
    map.addSource("cities", { type: "geojson", data });
    map.addLayer({
      id: "city-circles", type: "circle", source: "cities",
      paint: {
        "circle-radius": 7,
        "circle-color": ["match", ["get", "status"], "correct", "#32bc00", "wrong", "#ff0000", "#888888"],
        "circle-opacity": ["match", ["get", "status"], "default", 0.45, 1],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-opacity": ["match", ["get", "status"], "default", 0.3, 1],
      },
    });
  }
  const bounds = new maplibregl.LngLatBounds();
  props.cities.forEach((city) => bounds.extend([city.lon, city.lat]));
  map.fitBounds(bounds, { padding: 60, maxZoom: 7 });
};

const updateEpicenter = () => {
  if (!map || !loaded.value) return;
  if (!props.earthquake || props.phase !== "done") {
    if (map.getLayer("epicenter-dot")) map.removeLayer("epicenter-dot");
    if (map.getSource("epicenter")) map.removeSource("epicenter");
    return;
  }
  const data: GeoJSON.FeatureCollection<GeoJSON.Point> = {
    type: "FeatureCollection",
    features: [{ type: "Feature", geometry: { type: "Point", coordinates: [props.earthquake.lon, props.earthquake.lat] }, properties: {} }],
  };
  const source = map.getSource("epicenter") as maplibregl.GeoJSONSource | undefined;
  if (source) return source.setData(data);
  map.addSource("epicenter", { type: "geojson", data });
  map.addLayer({
    id: "epicenter-dot", type: "circle", source: "epicenter",
    paint: { "circle-radius": 6, "circle-color": "#e8612c", "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" },
  });
};

onMounted(() => {
  if (!container.value) return;
  map = new maplibregl.Map({ container: container.value, style: "https://tiles.openfreemap.org/styles/liberty", zoom: 2, center: [0, 20] });
  map.on("load", () => { loaded.value = true; updateCities(); updateEpicenter(); });
});
watch(() => [props.cities, props.cityGuesses], updateCities, { deep: true });
watch(() => [props.earthquake, props.phase], updateEpicenter, { deep: true });
onBeforeUnmount(() => { map?.remove(); map = null; });
</script>

<template>
  <div class="map-container"><div ref="container" style="width: 100%; height: 40vh" /></div>
</template>
