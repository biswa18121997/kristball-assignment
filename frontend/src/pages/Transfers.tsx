import React, { useEffect, useState } from 'react';

const Transfers: React.FC = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [fromBase, setFromBase] = useState('');
  const [toBase, setToBase] = useState('');
  const [itemsJson, setItemsJson] = useState('[{"equipmentId":"","quantity":1}]');

  async function fetchTransfers() {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${auth?.token}` } });
    const data = await res.json();
    setTransfers(data.transfers || []);
  }

  useEffect(() => { fetchTransfers(); }, []);

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

      <div>
        <h3 className="font-semibold mb-2">History</h3>
        <ul>
          {transfers.map(t => (
            <li key={t.id} className="border p-2 mb-2">
              <div className="text-sm text-gray-600">{t.date} — {t.status}</div>
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
