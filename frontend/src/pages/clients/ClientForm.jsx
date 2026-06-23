import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchClient, createClient, updateClient } from "../../api/clients";
import Field from "../../components/Field";

const emptyForm = {
  clientCode: "",
  oldClientCode: "",
  clientName: "",
  zone: "",
  address: "",
  country: "India",
  state: "",
  district: "",
  branch: "",
  area: "",
  pin: "",
  phone: "",
  fax: "",
  email: "",
  web: "",
  natureOfServices: "",
  currentStatus: "Active",
  clientCategory: "",
  clientVertical: "",
  securityDepositAmount: 0,
  workOrderNo: "",
  agreementNo: "",
};

export default function ClientForm() {
  const { clientId } = useParams();
  const isEdit = !!clientId;
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetchClient(clientId).then(({ data }) => {
      setForm({ ...emptyForm, ...data.data });
      setLoading(false);
    });
  }, [clientId, isEdit]);

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await updateClient(clientId, form);
      } else {
        await createClient(form);
      }
      navigate("/clients");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save client.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">
        {isEdit ? "Edit Client" : "New Client"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Client Code" value={form.clientCode} onChange={set("clientCode")} required />
          <Field label="Old Client Code" value={form.oldClientCode} onChange={set("oldClientCode")} />
          <Field label="Client Name" value={form.clientName} onChange={set("clientName")} required />
          <Field label="Zone" value={form.zone} onChange={set("zone")} />
          <Field label="Client Category" value={form.clientCategory} onChange={set("clientCategory")} />
          <Field label="Client Vertical" value={form.clientVertical} onChange={set("clientVertical")} />
          <Field
            label="Status"
            value={form.currentStatus}
            onChange={set("currentStatus")}
            options={["Active", "Terminate", "Skip"]}
          />
          <Field label="Nature of Services" value={form.natureOfServices} onChange={set("natureOfServices")} />
          <Field
            label="Security Deposit"
            type="number"
            value={form.securityDepositAmount}
            onChange={set("securityDepositAmount")}
          />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Address" value={form.address} onChange={set("address")} />
            <Field label="Country" value={form.country} onChange={set("country")} />
            <Field label="State" value={form.state} onChange={set("state")} />
            <Field label="District" value={form.district} onChange={set("district")} />
            <Field label="Branch" value={form.branch} onChange={set("branch")} />
            <Field label="Area" value={form.area} onChange={set("area")} />
            <Field label="Pin" value={form.pin} onChange={set("pin")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Phone" value={form.phone} onChange={set("phone")} />
            <Field label="Fax" value={form.fax} onChange={set("fax")} />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} />
            <Field label="Web" value={form.web} onChange={set("web")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Agreement</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Work Order No" value={form.workOrderNo} onChange={set("workOrderNo")} />
            <Field label="Agreement No" value={form.agreementNo} onChange={set("agreementNo")} />
          </div>
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
            onClick={() => navigate("/clients")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
