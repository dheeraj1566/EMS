import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchReportClient, createReportClient, updateReportClient } from "../../api/reportClients";
import Field from "../../components/Field";

const emptyForm = {
  reportName: "",
  country: "",
  state: "",
  district: "",
  branch: "",
  fieldArea: "",
  clientCategory: "",
  clientVertical: "",
};

export default function ReportClientForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetchReportClient(id).then(({ data }) => {
      setForm({ ...emptyForm, ...data.data });
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await updateReportClient(id, form);
      } else {
        await createReportClient(form);
      }
      navigate("/report-clients");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save report.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">
        {isEdit ? "Edit Report Client" : "New Report Client"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Report Name" value={form.reportName} onChange={set("reportName")} required />
          <Field label="Country" value={form.country} onChange={set("country")} />
          <Field label="State" value={form.state} onChange={set("state")} />
          <Field label="District" value={form.district} onChange={set("district")} />
          <Field label="Branch" value={form.branch} onChange={set("branch")} />
          <Field label="Field Area" value={form.fieldArea} onChange={set("fieldArea")} />
          <Field label="Client Category" value={form.clientCategory} onChange={set("clientCategory")} />
          <Field label="Client Vertical" value={form.clientVertical} onChange={set("clientVertical")} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/report-clients")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
