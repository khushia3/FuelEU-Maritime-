export interface Route {
    id: string;
    routeId: string;
    origin: string;
    destination: string;
    distance: number;
    emissions: number;
    baseline?: number;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    totalEmissions: number;
}

export interface ComparisonRow {
    routeId: string;
    baseline: number;
    comparison: number;
    percentDiff: number;
    compliant: boolean;
}

export interface ComparisonResponse {
    target: number;
    baselineId: string;
    rows: ComparisonRow[];
}

export interface BankingTransaction {
    id: string;
    amount: number;
    date: string;
    type: 'deposit' | 'withdrawal';
}

export interface Pool {
    id: string;
    name: string;
    routes: string[];
    totalEmissions?: number;
}

export type Notif = {
    type: 'success' | 'error';
    message: string;
};