import { Route, BankingTransaction, Pool, ComparisonResponse } from '../domain/types';

export interface IRoutesApi {
    getRoutes(): Promise<Route[]>;
    setBaseline(routeId: string, baseline: number): Promise<Route>;
}

export interface IBankingApi {
    getBankingTransactions(): Promise<BankingTransaction[]>;
    createTransaction(transaction: Omit<BankingTransaction, 'id'>): Promise<BankingTransaction>;
}

export interface IPoolsApi {
    getPools(): Promise<Pool[]>;
    createPool(pool: Omit<Pool, 'id'>): Promise<Pool>;
    addRouteToPool(poolId: string, routeId: string): Promise<Pool>;
    removeRouteFromPool(poolId: string, routeId: string): Promise<Pool>;
}

export interface IComplianceApi {
    getBaselines(): Promise<ComparisonResponse>;
}