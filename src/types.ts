export interface USGSFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

export interface USGSResponse {
  features: USGSFeature[];
}

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  year: number;
  lon: number;
  lat: number;
  depthKm: number;
}

export interface WorldCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface NearbyCity extends WorldCity {
  distanceKm: number;
}

export type GamePhase = "city" | "year" | "done";
