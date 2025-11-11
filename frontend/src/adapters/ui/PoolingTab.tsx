import React, { useState } from 'react';
import { Notif } from './Notification';
import { IPoolsApi } from '../../core/ports/api';
import { Pool } from '../../core/domain/types';

interface PoolMember {
  routeId: string;
  cb_before: number;
}

interface PoolingTabProps {
  setNotif: React.Dispatch<React.SetStateAction<Notif|null>>;
  poolsApi: IPoolsApi;
}

export function PoolingTab({ setNotif, poolsApi }: PoolingTabProps) {
  const [members, setMembers] = useState<PoolMember[]>([
    { routeId: 'R001', cb_before: -1000000 },
    { routeId: 'R002', cb_before: 2000000 }
  ]);
  const [result, setResult] = useState<Pool | null>(null);
  const [error, setError] = useState<string|null>(null);

  function sumMembers() {
    return members.reduce((s, m) => s + Number(m.cb_before), 0);
  }

  const valid = sumMembers() >= 0 && members.every(m =>
    typeof m.routeId === 'string' &&
    m.routeId.length > 0 &&
    !Number.isNaN(Number(m.cb_before))
  );

  async function createPool() {
    setError(null);
    if (!valid) {
      setError('Invalid pool: sum must be ≥ 0 and all members valid');
      return;
    }

    try {
      const pool: Omit<Pool, 'id'> = {
        name: `Pool ${new Date().toISOString()}`,
        routes: members.map(m => m.routeId)
      };
      const createdPool = await poolsApi.createPool(pool);
      setResult(createdPool);
      setNotif({ type: 'success', message: 'Pool created' });
    } catch (e: any) {
      const msg = String(e?.response?.data?.error || e.message || e);
      setError(msg);
      setNotif({ type: 'error', message: msg });
    }
  }

  return (
    <div>
      <div className="mb-2">Members (edit before creating):</div>
      {members.map((m, i) => (
        <div key={i} className="flex gap-2 items-center mb-1">
          <input
            value={m.routeId}
            onChange={e => {
              const updatedMembers = [...members];
              updatedMembers[i] = { ...m, routeId: e.target.value };
              setMembers(updatedMembers);
            }}
            className="border p-1"
          />
          <input
            value={String(m.cb_before)}
            onChange={e => {
              const updatedMembers = [...members];
              updatedMembers[i] = { ...m, cb_before: Number(e.target.value) };
              setMembers(updatedMembers);
            }}
            className="border p-1"
          />
        </div>
      ))}
      <button
        onClick={createPool}
        disabled={!valid}
        className="px-3 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
      >
        Create Pool
      </button>
      <div className="mt-4">
        {result ? JSON.stringify(result, null, 2) : '—'}
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}