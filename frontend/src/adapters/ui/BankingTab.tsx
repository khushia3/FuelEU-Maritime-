import React, { useEffect, useState } from 'react';
import { Notif } from './Notification';
import { IBankingApi } from '../../core/ports/api';
import { BankingTransaction } from '../../core/domain/types';

interface BankingTabProps {
  setNotif: React.Dispatch<React.SetStateAction<Notif|null>>;
  bankingApi: IBankingApi;
}

export function BankingTab({ setNotif, bankingApi }: BankingTabProps) {
  const [routeId, setRouteId] = useState('R001');
  const [records, setRecords] = useState<BankingTransaction[] | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => { 
    fetchRecords(); 
  }, []);

  async function fetchRecords() {
    setLoading(true);
    try {
      const transactions = await bankingApi.getBankingTransactions();
      setRecords(transactions);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleBank() {
    try {
      const transaction: Omit<BankingTransaction, 'id'> = {
        amount: Number(amount) || 0,
        date: new Date().toISOString(),
        type: 'deposit'
      };
      await bankingApi.createTransaction(transaction);
      await fetchRecords();
      setNotif({ type: 'success', message: `Banked amount for ${routeId}` });
    } catch (e: any) {
      const msg = String(e?.response?.data?.error || e.message || e);
      setError(msg);
      setNotif({ type: 'error', message: msg });
    }
  }

  async function handleApply() {
    try {
      const transaction: Omit<BankingTransaction, 'id'> = {
        amount: Number(amount) || 0,
        date: new Date().toISOString(),
        type: 'withdrawal'
      };
      await bankingApi.createTransaction(transaction);
      await fetchRecords();
      setNotif({ type: 'success', message: `Applied banked amount from ${routeId}` });
    } catch (e: any) {
      const msg = String(e?.response?.data?.error || e.message || e);
      setError(msg);
      setNotif({ type: 'error', message: msg });
    }
  }

  return (
    <div>
      <div className="flex gap-2 items-center">
        <label>Route</label>
        <input
          value={routeId}
          onChange={e => setRouteId(e.target.value)}
          className="border p-1"
        />
        <button 
          onClick={fetchRecords}
          className="px-2 py-1 bg-blue-600 text-white rounded"
        >
          Load
        </button>
      </div>
      <div className="mt-2">
        Records: {records ? JSON.stringify(records) : '—'}
      </div>
      {loading && <div className="text-sm">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="mt-2 flex gap-2">
        <input
          placeholder="amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border p-1"
        />
        <button
          onClick={handleBank}
          disabled={!(records && records.length > 0) || Number(amount) <= 0}
          className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Bank
        </button>
        <button
          onClick={handleApply}
          disabled={!(records && records.length > 0) || Number(amount) <= 0}
          className="px-2 py-1 bg-orange-600 text-white rounded disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    </div>
  );
}