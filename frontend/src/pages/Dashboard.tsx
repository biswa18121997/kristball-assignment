import React, { useEffect, useState } from "react";

interface DashboardData {
  openingBalance: number;
  closingBalance: number;
  netMovement: number;
  assigned: number;
  expended: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  async function fetchDashboard() {
    try {
      const authData = JSON.parse(
        localStorage.getItem("userAuth") || "null"
      );

      if (!authData?.token) {
        throw new Error("User not authenticated");
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/dashboard`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({}), // filters can go here later
      });

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await res.json();
      setData(result.metrics);
      setBreakdown(result.breakdown);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!data) {
    return <p>No data available</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Opening Balance</h3>
          <p className="text-xl">{data.openingBalance}</p>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Closing Balance</h3>
          <p className="text-xl">{data.closingBalance}</p>
        </div>

        <div
          onClick={() => setShowBreakdown(true)}
          className="p-4 border rounded shadow cursor-pointer"
        >
          <h3 className="font-semibold">Net Movement</h3>
          <p className="text-xl">{data.netMovement}</p>
          <p className="text-sm text-gray-500">click to view details</p>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Assigned Assets</h3>
          <p className="text-xl">{data.assigned}</p>
        </div>

        <div className="p-4 border rounded shadow">
          <h3 className="font-semibold">Expended Assets</h3>
          <p className="text-xl">{data.expended}</p>
        </div>
      </div>

        {showBreakdown && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-4 rounded w-11/12 max-w-2xl">
              <h3 className="text-lg font-semibold mb-2">Net Movement Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <h4 className="font-medium">Purchases</h4>
                  <ul className="text-sm max-h-40 overflow-auto">
                    {breakdown?.purchases?.map((p: any) => (
                      <li key={p.id} className="border-b py-1">{p.id} - {p.date}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Transfer In</h4>
                  <ul className="text-sm max-h-40 overflow-auto">
                    {breakdown?.transferIn?.map((t: any) => (
                      <li key={t.id} className="border-b py-1">{t.id} - {t.createdAt}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Transfer Out</h4>
                  <ul className="text-sm max-h-40 overflow-auto">
                    {breakdown?.transferOut?.map((t: any) => (
                      <li key={t.id} className="border-b py-1">{t.id} - {t.createdAt}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => setShowBreakdown(false)} className="px-3 py-1 border rounded">Close</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
