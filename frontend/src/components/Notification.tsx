import React, { useEffect } from 'react';

export type Notif = { id?: string; type?: 'success' | 'error' | 'info'; message: string };

export default function Notification({ notif, onClose }: { notif: Notif | null; onClose: () => void }) {
  useEffect(() => {
    if (!notif) return;
    const t = setTimeout(() => onClose(), 4500);
    return () => clearTimeout(t);
  }, [notif, onClose]);

  if (!notif) return null;

  const bg = notif.type === 'success' ? 'bg-green-100 border-green-400' : notif.type === 'error' ? 'bg-red-100 border-red-400' : 'bg-blue-100 border-blue-400';

  return (
    <div className={`fixed right-4 top-4 z-50 p-2 ${bg} border rounded shadow`} role="status" aria-live="polite">
      <div className="px-3 py-2 text-sm">
        {notif.message}
        <button aria-label="dismiss notification" onClick={onClose} className="ml-3 text-xs underline">Dismiss</button>
      </div>
    </div>
  );
}
