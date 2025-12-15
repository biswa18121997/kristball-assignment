import React, { useEffect, useState } from 'react';

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [baseId, setBaseId] = useState('');
  const [userId, setUserId] = useState('');
  const [quantity, setQuantity] = useState(1);

  async function fetchAssignments() {
    const auth = JSON.parse(localStorage.getItem('userAuth') || 'null');
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assignments`, { headers: { Authorization: `Bearer ${auth?.token}` } });
    const data = await res.json();
    setAssignments(data.assignments || []);
  }

  useEffect(() => { fetchAssignments(); }, []);

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

      <h3 className="font-semibold mb-2">Assignments</h3>
      <ul>
        {assignments.map(a => (
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
