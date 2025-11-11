import axios from 'axios';
import { 
  IRoutesApi, 
  IBankingApi, 
  IPoolsApi, 
  IComplianceApi 
} from '../../core/ports/api';
import { 
  Route, 
  BankingTransaction, 
  Pool, 
  ComparisonResponse 
} from '../../core/domain/types';

const api = axios.create({
  baseURL: 'http://localhost:4000'
});

export class HttpRoutesApi implements IRoutesApi {
  async getRoutes(): Promise<Route[]> {
    const response = await api.get('/routes');
    return response.data;
  }

  async setBaseline(routeId: string, baseline: number): Promise<Route> {
    const response = await api.post(`/routes/${routeId}/baseline`);
    return response.data;
  }
}

export class HttpBankingApi implements IBankingApi {
  async getBankingTransactions(): Promise<BankingTransaction[]> {
    const response = await api.get('/banking/records');
    return response.data;
  }

  async createTransaction(transaction: Omit<BankingTransaction, 'id'>): Promise<BankingTransaction> {
    const response = await api.post('/banking/bank', transaction);
    return response.data;
  }
}

export class HttpPoolsApi implements IPoolsApi {
  async getPools(): Promise<Pool[]> {
    const response = await api.get('/pools');
    return response.data;
  }

  async createPool(pool: Omit<Pool, 'id'>): Promise<Pool> {
    const response = await api.post('/pools', pool);
    return response.data;
  }

  async addRouteToPool(poolId: string, routeId: string): Promise<Pool> {
    const response = await api.post(`/pools/${poolId}/routes/${routeId}`);
    return response.data;
  }

  async removeRouteFromPool(poolId: string, routeId: string): Promise<Pool> {
    const response = await api.delete(`/pools/${poolId}/routes/${routeId}`);
    return response.data;
  }
}

export class HttpComplianceApi implements IComplianceApi {
  async getBaselines(): Promise<ComparisonResponse> {
    const response = await api.get('/routes/comparison');
    return response.data;
  }
}