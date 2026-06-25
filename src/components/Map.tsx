import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { NearbyCity, Earthquake, GamePhase } from "../types";

interface Props {
  cities: NearbyCity[];
  cityGuesses: string[];
  phase: GamePhase;
  earthquake: Earthquake | null;
}

export const Map = ({ cities, cityGuesses, phase, earthquake }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      zoom: 2,
      center: [0, 20],
    });
    map.on("load", () => setMapLoaded(true));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !cities.length) return;

    const guessedSet = new Set(cityGuesses.map((g) => g.toLowerCase()));
    const answerName = cities[0].name.toLowerCase();

    const data = {
      type: "FeatureCollection" as const,
      features: cities.map((city) => {
        const guessed = guessedSet.has(city.name.toLowerCase());
        const correct = guessed && city.name.toLowerCase() === answerName;
        return {
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [city.lon, city.lat] as [number, number],
          },
          properties: {
            name: city.name,
            status: correct ? "correct" : guessed ? "wrong" : "default",
          },
        };
      }),
    };

    const existing = map.getSource("cities") as maplibregl.GeoJSONSource | undefined;
    if (existing) {
      existing.setData(data);
    } else {
      map.addSource("cities", { type: "geojson", data });
      map.addLayer({
        id: "city-circles",
        type: "circle",
        source: "cities",
        paint: {
          "circle-radius": 7,
          "circle-color": [
            "match", ["get", "status"],
            "correct", "#32bc00",
            "wrong", "#ff0000",
            "#888888",
          ],
          "circle-opacity": [
            "match", ["get", "status"],
            "default", 0.45,
            1,
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
          "circle-stroke-opacity": [
            "match", ["get", "status"],
            "default", 0.3,
            1,
          ],
        },
      });

      const bounds = new maplibregl.LngLatBounds();
      cities.forEach((c) => bounds.extend([c.lon, c.lat]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 7 });
    }
  }, [mapLoaded, cities, cityGuesses]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !earthquake || phase !== "done") return;

    const data = {
      type: "FeatureCollection" as const,
      features: [{
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [earthquake.lon, earthquake.lat] as [number, number],
        },
        properties: {},
      }],
    };

    const existing = map.getSource("epicenter") as maplibregl.GeoJSONSource | undefined;
    if (existing) {
      existing.setData(data);
    } else {
      map.addSource("epicenter", { type: "geojson", data });
      map.addLayer({
        id: "epicenter-dot",
        type: "circle",
        source: "epicenter",
        paint: {
          "circle-radius": 6,
          "circle-color": "#e8612c",
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });
    }
  }, [mapLoaded, earthquake, phase]);

  return (
    <div className="map-container">
      <div ref={containerRef} style={{ width: "100%", height: "40vh" }} />
    </div>
  );
};
