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

export interface FocalMechanism {
  strike: number;
  dip: number;
  rake: number;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type FocalMechanismType =
  | "Strike-Slip"
  | "Normal"
  | "Reverse / Thrust"
  | "Normal-Oblique"
  | "Reverse-Oblique"
  | "Undefined";