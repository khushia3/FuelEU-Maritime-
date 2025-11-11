import React, { useEffect, useState } from 'react';
import { Route, Notif } from '../../core/domain/types';
import { IRoutesApi } from '../../core/ports/api';

interface RoutesTabProps {
  setNotif: React.Dispatch<React.SetStateAction<Notif | null>>;
  routesApi: IRoutesApi;
}

export function RoutesTab({ setNotif, routesApi }: RoutesTabProps) {
  const [rows, setRows] = useState<Route[]>([]);
  const [filters, setFilters] = useState({
    vesselType: '',
    fuelType: '',
    year: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch routes on mount
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    routesApi
      .getRoutes()
      .then((routes: Route[]) => {
        if (mounted) setRows(routes);
      })
      .catch((e: any) => {
        const msg = e?.message || 'Failed to fetch routes.';
        setError(msg);
        setNotif({ type: 'error', message: msg });
      })
      .finally(() => setLoading(false));

    return () => {
      mounted = false;
    };
  }, [routesApi, setNotif]);

  // 🔹 Set Baseline for a Route
  const setBaseline = async (id: string) => {
    try {
      const updatedRoute = await routesApi.setBaseline(id, 0);
      setRows((prevRows) =>
        prevRows.map((r) => (r.id === updatedRoute.id ? updatedRoute : r))
      );
      setNotif({
        type: 'success',
        message: `Baseline set for route ${updatedRoute.routeId}`,
      });
    } catch (e: any) {
      const msg = String(e?.response?.data?.error || e.message || e);
      setError(msg);
      setNotif({ type: 'error', message: msg });
    }
  };

  // 🔹 Filtered routes
  const filtered = rows.filter(
    (r) =>
      (!filters.vesselType || r.vesselType === filters.vesselType) &&
      (!filters.fuelType || r.fuelType === filters.fuelType) &&
      (!filters.year || String(r.year) === filters.year)
  );

  // 🔹 Dropdown values
  const vesselTypes = Array.from(new Set(rows.map((r) => r.vesselType)));
  const fuelTypes = Array.from(new Set(rows.map((r) => r.fuelType)));
  const years = Array.from(new Set(rows.map((r) => r.year.toString())));

  return (
    <div className="p-4">
      {loading && <div className="mb-2 text-gray-500">Loading routes…</div>}
      {error && <div className="mb-2 text-red-600">{error}</div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          onChange={(e) =>
            setFilters({ ...filters, vesselType: e.target.value })
          }
          value={filters.vesselType}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Vessels</option>
          {vesselTypes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
          value={filters.fuelType}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Fuels</option>
          {fuelTypes.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          value={filters.year}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Years</option>
          {years.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Route ID</th>
              <th className="p-2">Vessel Type</th>
              <th className="p-2">Fuel Type</th>
              <th className="p-2">Year</th>
              <th className="p-2">GHG Intensity</th>
              <th className="p-2">Fuel Consumption (t)</th>
              <th className="p-2">Distance (km)</th>
              <th className="p-2">Total Emissions (t)</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && !loading ? (
              <tr>
                <td colSpan={9} className="p-2 text-center text-gray-500">
                  No routes found.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2">{r.routeId}</td>
                  <td className="p-2">{r.vesselType}</td>
                  <td className="p-2">{r.fuelType}</td>
                  <td className="p-2">{r.year}</td>
                  <td className="p-2">{r.ghgIntensity}</td>
                  <td className="p-2">{r.fuelConsumption}</td>
                  <td className="p-2">{r.distance}</td>
                  <td className="p-2">{r.totalEmissions}</td>
                  <td className="p-2">
                    <button
                      onClick={() => setBaseline(r.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
                    >
                      Set Baseline
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
