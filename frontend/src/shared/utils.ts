export const COMPLIANCE_TARGET = 90; // Example target percentage

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatEmissions = (value: number): string => {
  return `${value.toFixed(2)}t`;
};

export const calculateCompliance = (baseline: number, current: number): boolean => {
  return (current / baseline) * 100 <= COMPLIANCE_TARGET;
};

export const validateAmount = (amount: string): boolean => {
  const num = Number(amount);
  return !Number.isNaN(num) && num > 0;
};