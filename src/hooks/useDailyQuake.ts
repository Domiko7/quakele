import { useEffect, useState } from "react";
import type { Earthquake, NearbyCity } from "../types";
import { WORLD_CITIES } from "../data/cities";
import { findNearbyCities } from "../utils/geo";
import { getDailySeed, seededPick } from "../utils/seed";
import { fetchDailyPool } from "../utils/usgs";

interface State {
  earthquake: Earthquake | null;
  cities: NearbyCity[];
  loading: boolean;
  error: string | null;
}

export const useDailyQuake = (): State => {
  const [state, setState] = useState<State>({
    earthquake: null,
    cities: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const pool = await fetchDailyPool();
        if (!pool.length) throw new Error("No earthquakes found");

        const seed = getDailySeed();
        const earthquake = seededPick(pool, seed);
        const cities = findNearbyCities(earthquake.lat, earthquake.lon, WORLD_CITIES, 15);

        if (!cancelled) {
          setState({ earthquake, cities, loading: false, error: null });
        }
      } catch (e) {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: e instanceof Error ? e.message : "Unknown error",
          }));
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
