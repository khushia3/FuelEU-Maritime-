import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Notif } from './Notification';
import { IComplianceApi } from '../../core/ports/api';
import { ComparisonResponse } from '../../core/domain/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CompareTabProps {
  setNotif: React.Dispatch<React.SetStateAction<Notif|null>>;
  complianceApi: IComplianceApi;
}

export function CompareTab({ setNotif, complianceApi }: CompareTabProps) {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    setLoading(true);
    complianceApi.getBaselines()
      .then((response: ComparisonResponse) => {
        // Backend already sends the data in the correct format
        setData(response);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [complianceApi]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!data) return <div>Loading or no baseline set.</div>;

  const labels = data.rows.map(r => r.routeId);
  const baselineValues = data.rows.map(r => r.baseline);
  const comparisonValues = data.rows.map(r => r.comparison);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Baseline',
        data: baselineValues,
        backgroundColor: '#60A5FA',
      },
      {
        label: 'Comparison',
        data: comparisonValues,
        backgroundColor: '#F97316',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: `Target: ${data.target}` }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div>
      <div className="mb-2">Baseline vs Comparison</div>
      <div className="bg-white p-4 border rounded">
        <Bar options={options} data={chartData} />
      </div>
      <table className="w-full mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th>routeId</th>
            <th>baseline</th>
            <th>comparison</th>
            <th>% diff</th>
            <th>compliant</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map(r => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.baseline}</td>
              <td>{r.comparison}</td>
              <td>{r.percentDiff.toFixed(2)}%</td>
              <td>{r.compliant ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}