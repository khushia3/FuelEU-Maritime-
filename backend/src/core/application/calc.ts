import { Route } from '../domain/types';

export const TARGET = 89.3368; // gCO2e/MJ (2025 target per spec)

export function energyMJ(fuelTons: number) {
  // approx 41 000 MJ per ton
  return fuelTons * 41000;
}

export function complianceBalance(route: Route) {
  const energy = energyMJ(route.fuelConsumption);
  // (Target - Actual) * Energy
  return (TARGET - route.ghgIntensity) * energy;
}
