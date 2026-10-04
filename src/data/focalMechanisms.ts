import { FocalMechanism, Vector3D, FocalMechanismType } from "../types";

const DEG2RAD = Math.PI / 180;

export const randomizeFocalMechanism = (): FocalMechanism => {
  const focalMechanism: FocalMechanism = {
    strike: Math.random() * 360,
    dip: Math.random() * 90,
    rake: Math.random() * 360 - 180
  };
  return focalMechanism;
};

export const getPRadiation = (fm: FocalMechanism, dir: Vector3D): number => {
  const phi = fm.strike * DEG2RAD;
  const delta = fm.dip * DEG2RAD;
  const lambda = fm.rake * DEG2RAD;

  const sinP = Math.sin(phi), cosP = Math.cos(phi);
  const sinD = Math.sin(delta), cosD = Math.cos(delta);
  const sinR = Math.sin(lambda), cosR = Math.cos(lambda);

  const n = {
    x: -sinD * sinP,
    y: sinD * cosP,
    z: -cosD
  };

  const u = {
    x: cosR * cosP + cosD * sinR * sinP,
    y: cosR * sinP - cosD * sinR * cosP,
    z: -sinD * sinR
  };

  const dotN = dir.x * n.x + dir.y * n.y + dir.z * n.z;
  const dotU = dir.x * u.x + dir.y * u.y + dir.z * u.z;

  return 2 * dotN * dotU;
};

export const lowerHemisphereTo2D = (v: Vector3D): { x: number, y: number } => {
  const denominator = 1 + v.z;
  return {
    x: v.y / denominator,
    y: -v.x / denominator
  };
};

export const stereographicToUnitVector = (x: number, y: number): Vector3D | null => {
  const r2 = x * x + y * y;
  if (r2 > 1.0) return null;

  const denominator = 1 + r2;
  return {
    x: -2 * y / denominator,
    y:  2 * x / denominator,
    z: (1 - r2) / denominator
  };
};

export const identifyFocalMechanism = (fm: FocalMechanism): FocalMechanismType => {
  const dipRad = (fm.dip * Math.PI) / 180;
  const rakeRad = (fm.rake * Math.PI) / 180;

  const sinPlungeP = (Math.sin(dipRad) * Math.sin(rakeRad) - Math.cos(dipRad)) / Math.SQRT2;
  const sinPlungeT = (Math.sin(dipRad) * Math.sin(rakeRad) + Math.cos(dipRad)) / Math.SQRT2;

  const plungeP = Math.asin(Math.abs(sinPlungeP)) * (180 / Math.PI);
  const plungeT = Math.asin(Math.abs(sinPlungeT)) * (180 / Math.PI);

  if (plungeP > 45 && plungeT < 45) {
    return "Normal";
  }
  if (plungeT > 45 && plungeP < 45) {
    return "Reverse / Thrust";
  }
  if (plungeP < 45 && plungeT < 45) {
    return "Strike-Slip";
  }

  return fm.rake < 0 ? "Normal-Oblique" : "Reverse-Oblique";
};