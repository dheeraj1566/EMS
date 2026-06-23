import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchUnits, deleteUnit } from "../../api/units";
import { fetchClient } from "../../api/clients";

export default function UnitList() {
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [clientRes, unitsRes] = await Promise.all([
        fetchClient(clientId),
        fetchUnits(clientId),
      ]);
      setClient(clientRes.data.data);
      setUnits(unitsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load units.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const handleDelete = async (unitId) => {
    if (!window.confirm("Delete this unit?")) return;
    await deleteUnit(clientId, unitId);
    load();
  };

  return (
    <div>
      <div className="mb-1 text-sm text-gray-500">
        <Link to="/clients" className="hover:underline">
          Clients
        </Link>{" "}
        / {client?.clientName || "..."}
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Units</h1>
        <Link
          to={`/clients/${clientId}/units/new`}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + New Unit
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Unit Code</th>
              <th className="px-4 py-3">Unit Name</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Employees</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : units.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No units yet.
                </td>
              </tr>
            ) : (
              units.map((unit) => (
                <tr key={unit._id}>
                  <td className="px-4 py-3">{unit.unitCode}</td>
                  <td className="px-4 py-3">{unit.unitName}</td>
                  <td className="px-4 py-3">{unit.branch}</td>
                  <td className="px-4 py-3">{unit.noOfEmployees}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        unit.currentStatus === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {unit.currentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/clients/${clientId}/units/${unit._id}`}
                      className="mr-3 text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(unit._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
