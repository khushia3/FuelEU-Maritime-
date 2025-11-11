import React from 'react';

interface TabsProps {
  active: string;
  setActive: (s: string) => void;
}

export function Tabs({ active, setActive }: TabsProps) {
  const items = ['Routes', 'Compare', 'Banking', 'Pooling'];
  return (
    <div className="flex gap-2 p-2">
      {items.map(i => (
        <button 
          key={i} 
          onClick={() => setActive(i)} 
          className={`px-3 py-1 rounded ${active === i ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {i}
        </button>
      ))}
    </div>
  );
}