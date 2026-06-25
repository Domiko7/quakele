import type { Earthquake, USGSResponse } from "../types";

const FDSN = "https://earthquake.usgs.gov/fdsnws/event/1/query";

export const fetchDailyPool = async (): Promise<Earthquake[]> => {
  const params = new URLSearchParams({
    format: "geojson",
    minmagnitude: "7",
    producttype: "shakemap",
    orderby: "time",
    limit: "5000",
    starttime: "1000-01-01",
  });

  const res = await fetch(`${FDSN}?${params}`);
  if (!res.ok) throw new Error(`USGS API error: ${res.status}`);

  const data: USGSResponse = await res.json();

  return data.features.map((f) => ({
    id: f.id,
    magnitude: f.properties.mag,
    place: f.properties.place,
    time: f.properties.time,
    year: new Date(f.properties.time).getUTCFullYear(),
    lon: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
    depthKm: f.geometry.coordinates[2],
  }));
};
