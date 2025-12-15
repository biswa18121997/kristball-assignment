import React, { useEffect, useState } from 'react';

const Transfers: React.FC = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [fromBase, setFromBase] = useState('');
  const [toBase, setToBase] = useState('');
  const [itemsJson, setItemsJson] = useState('[{"equipmentId":"","quantity":1}]');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [baseFilter, setBaseFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  async function fetchTransfers() {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${auth?.token}` } });
    const data = await res.json();
    setTransfers(data.transfers || []);
  }

  useEffect(() => { fetchTransfers(); }, []);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const role = auth?.userDetails?.role;
    const userBaseId = auth?.userDetails?.base?.id;

    if (role !== 'ADMIN') setBaseFilter(userBaseId || '');

    const filteredList = transfers.filter((t) => {
      // base filter: include transfers where either from or to base matches
      if (baseFilter && t.fromBaseId !== baseFilter && t.toBaseId !== baseFilter) return false;

      // date filter
      const dateStr = t.date ?? t.createdAt;
      if (fromDate && new Date(dateStr) < new Date(fromDate)) return false;
      if (toDate && new Date(dateStr) > new Date(toDate)) return false;

      // equipment filter
      if (equipmentFilter) {
        const has = t.items.some((it: any) => (it.equipment?.type ?? it.equipment?.name)?.toLowerCase().includes(equipmentFilter.toLowerCase()));
        if (!has) return false;
      }

      return true;
    });

    setFiltered(filteredList);
  }, [transfers, fromDate, toDate, baseFilter, equipmentFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const items = JSON.parse(itemsJson);
      const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transfer-asset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
        body: JSON.stringify({ fromBaseId: fromBase, toBaseId: toBase, items }),
      });
      const data = await res.json();
      if (data.success) fetchTransfers();
      else alert(data.message || 'Failed to create transfer');
    } catch (err) { alert('Invalid items JSON'); }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Transfers</h2>

      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <div>
          <label>From Base ID</label>
          <input value={fromBase} onChange={(e) => setFromBase(e.target.value)} className="border ml-2 p-1" />
        </div>
        <div>
          <label>To Base ID</label>
          <input value={toBase} onChange={(e) => setToBase(e.target.value)} className="border ml-2 p-1" />
        </div>
        <div>
          <label>Items (JSON)</label>
          <textarea value={itemsJson} onChange={(e) => setItemsJson(e.target.value)} className="w-full border p-2" rows={3} />
        </div>
        <button className="px-3 py-1 border rounded">Create Transfer</button>
      </form>

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

          {(() => {
            const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
            const role = auth?.userDetails?.role;
            if (role === 'ADMIN') {
              const baseMap = new Map<string,string>();
              transfers.forEach((t) => {
                if (t.fromBaseId) baseMap.set(t.fromBaseId, t.fromBase?.name ?? t.fromBaseId);
                if (t.toBaseId) baseMap.set(t.toBaseId, t.toBase?.name ?? t.toBaseId);
              });
              const equipOptions = Array.from(new Set(transfers.flatMap((t) => t.items.map((it: any) => it.equipment?.type ?? it.equipment?.name).filter(Boolean))));
              return (
                <>
                  <div>
                    <label>Base</label>
                    <select value={baseFilter} onChange={(e) => setBaseFilter(e.target.value)} className="border ml-2 p-1">
                      <option value="">All</option>
                      {Array.from(baseMap.entries()).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
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
        <ul>
          {filtered.map(t => (
            <li key={t.id} className="border p-2 mb-2">
              <div className="text-sm text-gray-600">{t.date ?? t.createdAt} — {t.status}</div>
              <div>From: {t.fromBase?.name ?? t.fromBaseId} | To: {t.toBase?.name ?? t.toBaseId}</div>
              <div>Items:</div>
              <ul>
                {t.items.map((it:any) => <li key={it.id}>{it.equipment?.name ?? it.equipmentId} — {it.quantity}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Transfers;
