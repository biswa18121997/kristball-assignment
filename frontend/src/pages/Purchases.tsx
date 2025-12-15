import React, { useEffect, useState } from 'react';

const Purchases: React.FC = () => {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [baseId, setBaseId] = useState('');
  const [itemsJson, setItemsJson] = useState('[{"equipmentId":"","quantity":1}]');
  const [message, setMessage] = useState<string | null>(null);

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

      <div>
        <h3 className="font-semibold mb-2">History</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {purchases.map((p) => (
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
