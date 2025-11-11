import React, { useState } from 'react';
import { Tabs } from './adapters/ui/Tabs';
import { RoutesTab } from './adapters/ui/RoutesTab';
import { CompareTab } from './adapters/ui/CompareTab';
import { BankingTab } from './adapters/ui/BankingTab';
import { PoolingTab } from './adapters/ui/PoolingTab';
import Notification, { Notif } from './adapters/ui/Notification';
import { 
  HttpRoutesApi, 
  HttpBankingApi, 
  HttpPoolsApi, 
  HttpComplianceApi 
} from './adapters/infrastructure/api';

// Initialize API implementations
const routesApi = new HttpRoutesApi();
const bankingApi = new HttpBankingApi();
const poolsApi = new HttpPoolsApi();
const complianceApi = new HttpComplianceApi();

export default function App() {
  const [active, setActive] = useState('Routes');
  const [notif, setNotif] = useState<Notif | null>(null);

  return (
    <div className="min-h-screen p-4 bg-slate-50">
      <Notification notif={notif} onClose={() => setNotif(null)} />
      <h1 className="text-2xl font-bold mb-2">Fuel EU Compliance Dashboard</h1>
      <Tabs active={active} setActive={setActive} />
      <div className="mt-4">
        {active === 'Routes' && <RoutesTab setNotif={setNotif} routesApi={routesApi} />}
        {active === 'Compare' && <CompareTab setNotif={setNotif} complianceApi={complianceApi} />}
        {active === 'Banking' && <BankingTab setNotif={setNotif} bankingApi={bankingApi} />}
        {active === 'Pooling' && <PoolingTab setNotif={setNotif} poolsApi={poolsApi} />}
      </div>
    </div>
  );
}


