import React from 'react';

export interface Notif {
  type: 'success' | 'error';
  message: string;
}

interface NotificationProps {
  notif: Notif | null;
  onClose: () => void;
}

export default function Notification({ notif, onClose }: NotificationProps) {
  if (!notif) return null;

  const bgColor = notif.type === 'success' ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500';
  const textColor = notif.type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`fixed top-4 right-4 p-4 border rounded-lg ${bgColor} ${textColor}`}>
      <div className="flex justify-between items-center">
        <div>{notif.message}</div>
        <button onClick={onClose} className="ml-4 font-bold">&times;</button>
      </div>
    </div>
  );
}