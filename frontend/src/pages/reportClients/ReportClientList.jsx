import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchReportClients, deleteReportClient } from "../../api/reportClients";

export default function ReportClientList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchReportClients();
      setReports(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await deleteReportClient(id);
    load();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Report Clients</h1>
        <Link
          to="/report-clients/new"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + New Report
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Report Name</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No reports yet.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-4 py-3">{report.reportName}</td>
                  <td className="px-4 py-3">{report.state}</td>
                  <td className="px-4 py-3">{report.branch}</td>
                  <td className="px-4 py-3">{report.createdBy?.name}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/report-clients/${report._id}`}
                      className="mr-3 text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(report._id)}
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
