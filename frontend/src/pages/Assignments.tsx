import React, { useEffect, useState } from 'react';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [baseId, setBaseId] = useState('');
  const [userId, setUserId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [baseFilter, setBaseFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  async function fetchAssignments() {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assignments`, { headers: { Authorization: `Bearer ${auth?.token}` } });
    const data = await res.json();
    setAssignments(data.assignments || []);
  }

  useEffect(() => { fetchAssignments(); }, []);

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const role = auth?.userDetails?.role;
    const userBaseId = auth?.userDetails?.base?.id;

    if (role !== 'ADMIN') setBaseFilter(userBaseId || '');

    const filteredList = assignments.filter((a) => {
      if (baseFilter && a.baseId !== baseFilter) return false;

      if (fromDate && new Date(a.dateAssigned) < new Date(fromDate)) return false;
      if (toDate && new Date(a.dateAssigned) > new Date(toDate)) return false;

      if (equipmentFilter) {
        const val = a.equipment?.type ?? a.equipment?.name ?? '';
        if (!val.toLowerCase().includes(equipmentFilter.toLowerCase())) return false;
      }

      return true;
    });

    setFiltered(filteredList);
  }, [assignments, fromDate, toDate, baseFilter, equipmentFilter]);

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assign-asset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
      body: JSON.stringify({ equipmentId, baseId, userId, quantity }),
    });
    const data = await res.json();
    if (data.success) fetchAssignments();
    else alert(data.message || 'Failed to assign');
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Assignments & Expenditures</h2>

      <form onSubmit={handleAssign} className="mb-6 space-y-2">
        <div>
          <label>Base ID</label>
          <input value={baseId} onChange={(e) => setBaseId(e.target.value)} className="border ml-2 p-1" />
        </div>
        <div>
          <label>Equipment ID</label>
          <input value={equipmentId} onChange={(e) => setEquipmentId(e.target.value)} className="border ml-2 p-1" />
        </div>
        <div>
          <label>Assignee User ID</label>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} className="border ml-2 p-1" />
        </div>
        <div>
          <label>Quantity</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="border ml-2 p-1 w-24" />
        </div>
        <button className="px-3 py-1 border rounded">Assign</button>
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
              const baseMap = new Map(assignments.map((a) => [a.baseId, a.base?.name ?? a.baseId]));
              const equipOptions = Array.from(new Set(assignments.map((a) => a.equipment?.type ?? a.equipment?.name).filter(Boolean)));
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

      <h3 className="font-semibold mb-2">Assignments</h3>
      <ul>
        {filtered.map(a => (
          <li key={a.id} className="border p-2 mb-2">
            <div>{a.dateAssigned} — {a.status}</div>
            <div>Equipment: {a.equipment?.name ?? a.equipmentId} | Qty: {a.quantity}</div>
            <div>Assigned to: {a.user?.name ?? a.userId}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;
