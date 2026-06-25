import type { WorldCity, NearbyCity } from "../types";

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

export const findNearbyCities = (
  lat: number,
  lon: number,
  cities: WorldCity[],
  n = 15,
): NearbyCity[] =>
  cities
    .map((c) => ({ ...c, distanceKm: Math.round(haversineKm(lat, lon, c.lat, c.lon)) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, n);
