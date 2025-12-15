import React, { useEffect, useState } from 'react';

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseId, setBaseId] = useState('');
  const [itemsJson, setItemsJson] = useState('[{"equipmentId":"","quantity":1}]');
  const [message, setMessage] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [baseFilter, setBaseFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  async function fetchPurchases() {
    try {
      setLoading(true);
      const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/purchases`, {
        headers: { Authorization: `Bearer ${auth?.token}` },
      });
      const data = await res.json();
      setPurchases(data.purchases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const role = auth?.userDetails?.role;
    const userBaseId = auth?.userDetails?.base?.id;

    // Pre-set base for non-admins
    if (role !== 'ADMIN') {
      setBaseFilter(userBaseId || '');
    }

    // Compute filtered list client-side
    const filteredList = purchases.filter((p) => {
      // base filter
      if (baseFilter && p.baseId !== baseFilter) return false;

      // date filter
      if (fromDate) {
        const d = new Date(p.date);
        if (isNaN(d.getTime()) || d < new Date(fromDate)) return false;
      }
      if (toDate) {
        const d = new Date(p.date);
        if (isNaN(d.getTime()) || d > new Date(toDate)) return false;
      }

      // equipment filter (if one of the items matches the type/name)
      if (equipmentFilter) {
        const has = p.items.some((it: any) => (it.equipment?.type ?? it.equipment?.name)?.toLowerCase().includes(equipmentFilter.toLowerCase()));
        if (!has) return false;
      }

      return true;
    });

    setFiltered(filteredList);
  }, [purchases, fromDate, toDate, baseFilter, equipmentFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      const items = JSON.parse(itemsJson);
      const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ baseId, items }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Purchase created');
        fetchPurchases();
      } else {
        setMessage(data.message || 'Failed');
      }
    } catch (err: any) {
      setMessage(err.message || 'Invalid items JSON');
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Purchases</h2>
      <div className="mb-6">
        <form onSubmit={handleCreate} className="space-y-2">
          <div>
            <label>Base ID</label>
            <input value={baseId} onChange={(e) => setBaseId(e.target.value)} className="border p-1 ml-2" />
          </div>
          <div>
            <label>Items (JSON)</label>
            <textarea value={itemsJson} onChange={(e) => setItemsJson(e.target.value)} className="w-full border p-2" rows={4} />
            <div className="text-sm text-gray-500">Format: [{'{"equipmentId":"id","quantity":1}'}]</div>
          </div>
          <button className="px-3 py-1 border rounded">Create Purchase</button>
          {message && <div className="text-sm mt-2">{message}</div>}
        </form>
      </div>

      <div className="mb-4 border p-3 rounded">
        <h3 className="font-semibold mb-2">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <div>
            <label>From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border ml-2 p-1" />
          </div>
          <div>
            <label>To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border ml-2 p-1" />
          </div>

          {/* Show base/equipment filters to admin only */}
          {(() => {
            const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
            const role = auth?.userDetails?.role;
            if (role === 'ADMIN') {
              const baseOptions = Array.from(new Map(purchases.map((p) => [p.baseId, p.base?.name ?? p.baseId])).values());
              const equipOptions = Array.from(new Set(purchases.flatMap((p) => p.items.map((it: any) => it.equipment?.type ?? it.equipment?.name).filter(Boolean))));
              return (
                <>
                  <div>
                    <label>Base</label>
                    <select value={baseFilter} onChange={(e) => setBaseFilter(e.target.value)} className="border ml-2 p-1">
                      <option value="">All</option>
                      {Array.from(new Map(purchases.map((p) => [p.baseId, p.base?.name ?? p.baseId]))).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Equipment</label>
                    <select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)} className="border ml-2 p-1">
                      <option value="">All</option>
                      {equipOptions.map((e: any) => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </>
              );
            }
            return null;
          })()}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">History</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {filtered.map((p) => (
              <li key={p.id} className="border p-2 mb-2">
                <div className="text-sm text-gray-600">{p.date}</div>
                <div>Base: {p.base?.name ?? p.baseId}</div>
                <div>Items:</div>
                <ul>
                  {p.items.map((it: any) => (
                    <li key={it.id}>{it.equipment?.name ?? it.equipmentId} — {it.quantity}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Purchases;
