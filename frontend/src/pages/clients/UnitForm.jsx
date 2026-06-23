import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchUnit, addUnit, updateUnit, deleteSalaryRateBreakup, deleteBillRateBreakup } from "../../api/units";
import { fetchClient } from "../../api/clients";
import Field from "../../components/Field";
import { getPath, setPath } from "../../utils/nested";
import SalaryRateBreakupModal from "../../components/units/SalaryRateBreakupModal";
import BillRateBreakupModal from "../../components/units/BillRateBreakupModal";

const emptyForm = {
  unitCode: "",
  oldUnitCode: "",
  unitName: "",
  printName: "",
  address: "",
  printAddress: "",
  country: "India",
  billingToState: "",
  state: "",
  district: "",
  billingGSTIN: "",
  billingFromState: "",
  gstin: "",
  placeOfSupply: "",
  branch: "",
  siteAt: "",
  fieldArea: "",
  pinCode: "",
  phone: "",
  fax: "",
  email: "",
  noOfEmployees: 0,
  workOrderNo: "",
  agreementNo: "",
  contactName: "",
  designation: "",
  contactPhone: "",
  contactEmail: "",
  landlineWithExtn: "",
  openingAmount: 0,
  zone: "",
  serviceTaxNo: "",
  panCardNo: "",
  tinNo: "",
  tanNo: "",
  roc: "",
  wagesRevision: "",
  controller: "",
  salaryTransferredBy: "",
  remarkMIS: "",
  isUniformFree: false,
  clientService: "",
  housekeepingService: false,
  manpowerService: false,
  securityServices: false,
  enclosure: "",
  currentStatus: "Active",
  reason: "",
  isTenderUnit: false,
  isEventUnit: false,
  executive: "",
  vendorCode: "",
  accountsOfficer: {},
  operationDepartment: {},
  billType: "Muster",
  billGenerateType: "Invoice",
  printFormat: "Std",
  bank: "",
  billNotCreateForThisUnit: false,
  gstApplicable: true,
  igstApplicable: false,
  unionTerritorySystemBilling: false,
  isBillingInDecimal: false,
  contractPeriodShown: false,
  pfCode: "",
  esicCode: "",
  salaryRateBreakups: [],
  billRateBreakups: [],
};

export default function UnitForm() {
  const { clientId, unitId } = useParams();
  const isEdit = !!unitId;
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [salaryModal, setSalaryModal] = useState(null); // null | {} | breakup
  const [billModal, setBillModal] = useState(null);

  const load = async () => {
    const clientRes = await fetchClient(clientId);
    setClient(clientRes.data.data);
    if (isEdit) {
      const { data } = await fetchUnit(clientId, unitId);
      setForm({ ...emptyForm, ...data.data });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, unitId]);

  const set = (path) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(setPath(form, path, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await updateUnit(clientId, unitId, form);
        await load();
      } else {
        const { data } = await addUnit(clientId, form);
        navigate(`/clients/${clientId}/units/${data.data._id}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save unit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSalaryRate = async (rateId) => {
    if (!window.confirm("Delete this salary rate breakup?")) return;
    await deleteSalaryRateBreakup(clientId, unitId, rateId);
    load();
  };

  const handleDeleteBillRate = async (rateId) => {
    if (!window.confirm("Delete this bill rate breakup?")) return;
    await deleteBillRateBreakup(clientId, unitId, rateId);
    load();
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="mb-1 text-sm text-gray-500">
        <Link to="/clients" className="hover:underline">
          Clients
        </Link>{" "}
        /{" "}
        <Link to={`/clients/${clientId}/units`} className="hover:underline">
          {client?.clientName || "..."}
        </Link>{" "}
        / Units
      </div>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">
        {isEdit ? "Edit Unit" : "New Unit"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Unit Code" value={form.unitCode} onChange={set("unitCode")} required />
          <Field label="Old Unit Code" value={form.oldUnitCode} onChange={set("oldUnitCode")} />
          <Field label="Unit Name" value={form.unitName} onChange={set("unitName")} required />
          <Field label="Print Name" value={form.printName} onChange={set("printName")} />
          <Field label="Zone" value={form.zone} onChange={set("zone")} />
          <Field
            label="Status"
            value={form.currentStatus}
            onChange={set("currentStatus")}
            options={["Active", "Terminate"]}
          />
          <Field label="No. of Employees" type="number" value={form.noOfEmployees} onChange={set("noOfEmployees")} />
          <Field label="Vendor Code" value={form.vendorCode} onChange={set("vendorCode")} />
          <Field label="Executive" value={form.executive} onChange={set("executive")} />
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Address</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Address" value={form.address} onChange={set("address")} />
            <Field label="Print Address" value={form.printAddress} onChange={set("printAddress")} />
            <Field label="Country" value={form.country} onChange={set("country")} />
            <Field label="State" value={form.state} onChange={set("state")} />
            <Field label="District" value={form.district} onChange={set("district")} />
            <Field label="Branch" value={form.branch} onChange={set("branch")} />
            <Field label="Site At" value={form.siteAt} onChange={set("siteAt")} />
            <Field label="Field Area" value={form.fieldArea} onChange={set("fieldArea")} />
            <Field label="Pin Code" value={form.pinCode} onChange={set("pinCode")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Tax / GST</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="GSTIN" value={form.gstin} onChange={set("gstin")} />
            <Field label="Billing GSTIN" value={form.billingGSTIN} onChange={set("billingGSTIN")} />
            <Field label="Billing From State" value={form.billingFromState} onChange={set("billingFromState")} />
            <Field label="Billing To State" value={form.billingToState} onChange={set("billingToState")} />
            <Field label="Place of Supply" value={form.placeOfSupply} onChange={set("placeOfSupply")} />
            <Field label="Service Tax No" value={form.serviceTaxNo} onChange={set("serviceTaxNo")} />
            <Field label="PAN Card No" value={form.panCardNo} onChange={set("panCardNo")} />
            <Field label="TIN No" value={form.tinNo} onChange={set("tinNo")} />
            <Field label="TAN No" value={form.tanNo} onChange={set("tanNo")} />
            <Field label="ROC" value={form.roc} onChange={set("roc")} />
            <Field label="PF Code" value={form.pfCode} onChange={set("pfCode")} />
            <Field label="ESIC Code" value={form.esicCode} onChange={set("esicCode")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Contact</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Contact Name" value={form.contactName} onChange={set("contactName")} />
            <Field label="Designation" value={form.designation} onChange={set("designation")} />
            <Field label="Contact Phone" value={form.contactPhone} onChange={set("contactPhone")} />
            <Field label="Contact Email" type="email" value={form.contactEmail} onChange={set("contactEmail")} />
            <Field label="Landline w/ Extn" value={form.landlineWithExtn} onChange={set("landlineWithExtn")} />
            <Field label="Phone" value={form.phone} onChange={set("phone")} />
            <Field label="Fax" value={form.fax} onChange={set("fax")} />
            <Field label="Email" type="email" value={form.email} onChange={set("email")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Accounts Officer</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" value={getPath(form, "accountsOfficer.contactName")} onChange={set("accountsOfficer.contactName")} />
            <Field label="Designation" value={getPath(form, "accountsOfficer.designation")} onChange={set("accountsOfficer.designation")} />
            <Field label="Mobile No" value={getPath(form, "accountsOfficer.mobileNo")} onChange={set("accountsOfficer.mobileNo")} />
            <Field label="Phone" value={getPath(form, "accountsOfficer.phone")} onChange={set("accountsOfficer.phone")} />
            <Field label="Landline w/ Extn" value={getPath(form, "accountsOfficer.landlineWithExtn")} onChange={set("accountsOfficer.landlineWithExtn")} />
            <Field label="Email" type="email" value={getPath(form, "accountsOfficer.email")} onChange={set("accountsOfficer.email")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Operation Department</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" value={getPath(form, "operationDepartment.contactName")} onChange={set("operationDepartment.contactName")} />
            <Field label="Designation" value={getPath(form, "operationDepartment.designation")} onChange={set("operationDepartment.designation")} />
            <Field label="Mobile No" value={getPath(form, "operationDepartment.mobileNo")} onChange={set("operationDepartment.mobileNo")} />
            <Field label="Phone" value={getPath(form, "operationDepartment.phone")} onChange={set("operationDepartment.phone")} />
            <Field label="Landline w/ Extn" value={getPath(form, "operationDepartment.landlineWithExtn")} onChange={set("operationDepartment.landlineWithExtn")} />
            <Field label="Email" type="email" value={getPath(form, "operationDepartment.email")} onChange={set("operationDepartment.email")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Work Order & Agreement</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Work Order No" value={form.workOrderNo} onChange={set("workOrderNo")} />
            <Field label="Agreement No" value={form.agreementNo} onChange={set("agreementNo")} />
            <Field label="Wages Revision" value={form.wagesRevision} onChange={set("wagesRevision")} />
            <Field label="Opening Amount" type="number" value={form.openingAmount} onChange={set("openingAmount")} />
            <Field label="Controller" value={form.controller} onChange={set("controller")} />
            <Field label="Salary Transferred By" value={form.salaryTransferredBy} onChange={set("salaryTransferredBy")} />
            <Field label="Reason (if terminated)" value={form.reason} onChange={set("reason")} />
            <Field label="Remark MIS" value={form.remarkMIS} onChange={set("remarkMIS")} />
            <Field label="Enclosure" value={form.enclosure} onChange={set("enclosure")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Billing Settings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Bill Type" value={form.billType} onChange={set("billType")} />
            <Field label="Bill Generate Type" value={form.billGenerateType} onChange={set("billGenerateType")} />
            <Field label="Print Format" value={form.printFormat} onChange={set("printFormat")} />
            <Field label="Bank" value={form.bank} onChange={set("bank")} />
            <Field label="Client Service" value={form.clientService} onChange={set("clientService")} />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Flags</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["isUniformFree", "Uniform Free"],
              ["housekeepingService", "Housekeeping Service"],
              ["manpowerService", "Manpower Service"],
              ["securityServices", "Security Services"],
              ["isTenderUnit", "Tender Unit"],
              ["isEventUnit", "Event Unit"],
              ["billNotCreateForThisUnit", "Bill Not Created"],
              ["gstApplicable", "GST Applicable"],
              ["igstApplicable", "IGST Applicable"],
              ["unionTerritorySystemBilling", "UT System Billing"],
              ["isBillingInDecimal", "Billing In Decimal"],
              ["contractPeriodShown", "Contract Period Shown"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!form[key]}
                  onChange={set(key)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                {label}
              </label>
            ))}
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
            onClick={() => navigate(`/clients/${clientId}/units`)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {isEdit && (
        <>
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Salary Rate Breakups</h2>
              <button
                onClick={() => setSalaryModal({})}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                + Add
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Nos</th>
                    <th className="px-4 py-3">Total Salary</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(form.salaryRateBreakups || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        No salary rate breakups yet.
                      </td>
                    </tr>
                  ) : (
                    form.salaryRateBreakups.map((rate) => (
                      <tr key={rate._id}>
                        <td className="px-4 py-3">{rate.shift}</td>
                        <td className="px-4 py-3">{rate.service}</td>
                        <td className="px-4 py-3">{rate.nos}</td>
                        <td className="px-4 py-3">{rate.totalSalary}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSalaryModal(rate)}
                            className="mr-3 text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSalaryRate(rate._id)}
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

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Bill Rate Breakups</h2>
              <button
                onClick={() => setBillModal({})}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                + Add
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Shift</th>
                    <th className="px-4 py-3">Service</th>
                    <th className="px-4 py-3">Nos</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(form.billRateBreakups || []).length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                        No bill rate breakups yet.
                      </td>
                    </tr>
                  ) : (
                    form.billRateBreakups.map((rate) => (
                      <tr key={rate._id}>
                        <td className="px-4 py-3">{rate.shift}</td>
                        <td className="px-4 py-3">{rate.service}</td>
                        <td className="px-4 py-3">{rate.nos}</td>
                        <td className="px-4 py-3">{rate.totalAmount}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setBillModal(rate)}
                            className="mr-3 text-indigo-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBillRate(rate._id)}
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
        </>
      )}

      {salaryModal && (
        <SalaryRateBreakupModal
          clientId={clientId}
          unitId={unitId}
          initial={salaryModal}
          onClose={() => setSalaryModal(null)}
          onSaved={() => {
            setSalaryModal(null);
            load();
          }}
        />
      )}

      {billModal && (
        <BillRateBreakupModal
          clientId={clientId}
          unitId={unitId}
          initial={billModal}
          onClose={() => setBillModal(null)}
          onSaved={() => {
            setBillModal(null);
            load();
          }}
        />
      )}
    </div>
  );
}
