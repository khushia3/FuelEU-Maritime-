export type Route = {
  id: string;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumption: number; // t
  distance: number; // km
  totalEmissions: number; // t
  isBaseline?: boolean;
};

export type ComplianceBalance = {
  shipId: string;
  year: number;
  cbGco2eq: number;
  id?: string;
  balance?: number;
};

export type BankEntry = {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  amount?: number;
  type?: 'deposit' | 'withdrawal';
};

export type PoolMember = {
  shipId?: string;
  cbBefore?: number;
  cbAfter?: number;
  routeId?: string;
  cb_before?: number;
};

export type Pool = {
  id: string;
  year: number;
  members?: Array<{
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }>;
  name?: string;
  routes?: string[];
  totalEmissions?: number;
};
