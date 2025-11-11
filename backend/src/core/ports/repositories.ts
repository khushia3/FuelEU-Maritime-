import { Route, ComplianceBalance, BankEntry, Pool, PoolMember } from '../domain/types';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  setBaseline(id: string): Promise<Route>;
  clearOtherBaselines(): Promise<void>;
}

export interface IComplianceRepository {
  getBalance(shipId: string, year: number): Promise<ComplianceBalance | null>;
  saveBalance(balance: ComplianceBalance): Promise<ComplianceBalance>;
}

export interface IBankingRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  createEntry(entry: Omit<BankEntry, 'id'>): Promise<BankEntry>;
}

export interface IPoolRepository {
  create(year: number, members: PoolMember[]): Promise<Pool>;
  findById(id: string): Promise<Pool | null>;
  addMember(poolId: string, member: PoolMember): Promise<PoolMember>;
}