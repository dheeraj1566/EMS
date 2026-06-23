import { useState } from "react";
import Modal from "../Modal";
import Field from "../Field";
import { getPath, setPath } from "../../utils/nested";
import { addBillRateBreakup, updateBillRateBreakup } from "../../api/units";

const BILL_ALLOWANCES = [
  ["srNo", "Sr No"],
  ["basic", "Basic"],
  ["daVda", "DA/VDA"],
  ["hra", "HRA"],
  ["conveyance", "Conveyance"],
  ["washing", "Washing"],
  ["uniformAllow", "Uniform Allow"],
  ["canteenAllow", "Canteen Allow"],
  ["specialAllow", "Special Allow"],
  ["gunAllow", "Gun Allow"],
  ["exManAllow", "Ex-Man Allow"],
  ["trainingAllow", "Training Allow"],
  ["roomRent", "Room Rent"],
  ["medicalAllow", "Medical Allow"],
  ["leaveAllow", "Leave Allow"],
  ["bonus", "Bonus"],
  ["gratuity", "Gratuity"],
  ["hardshipAllow", "Hardship Allow"],
  ["nh", "NH"],
  ["gzhHoliday", "Gzh Holiday"],
  ["otherAllowance", "Other Allowance"],
  ["incentive", "Incentive"],
  ["attendanceAward", "Attendance Award"],
  ["goodWorkAward", "Good Work Award"],
  ["epf", "EPF"],
  ["esi", "ESI"],
  ["lwf", "LWF"],
  ["relieverAllow", "Reliever Allow"],
  ["extra4Hours", "Extra 4 Hours"],
  ["esiOnExtra4Hours", "ESI on Extra 4 Hours"],
  ["serviceCharges", "Service Charges"],
];

const BILL_TERMS = [
  ["epfPercentage", "EPF %"],
  ["epfAmount", "EPF Amount"],
  ["esiPercentage", "ESI %"],
  ["esiAmount", "ESI Amount"],
  ["holidayPercentage", "Holiday %"],
  ["holidayAmount", "Holiday Amount"],
  ["bonusPercentage", "Bonus %"],
  ["bonusAmount", "Bonus Amount"],
  ["serviceChargePercentage", "Service Charge %"],
  ["serviceChargePerDay", "Service Charge/Day"],
  ["relievingChargePercentage", "Relieving Charge %"],
  ["lwfAmount", "LWF Amount"],
];

const emptyForm = {
  shift: "",
  service: "",
  nos: 0,
  monthDays: 0,
  servicePrintName: "",
  remark: "",
  billBreakup: {},
  totalAmount: 0,
  billTerms: {},
  isHideAttendance: false,
  isHideRate: false,
  document: "",
};

export default function BillRateBreakupModal({ clientId, unitId, initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (path) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(setPath(form, path, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (initial?._id) {
        await updateBillRateBreakup(clientId, unitId, initial._id, form);
      } else {
        await addBillRateBreakup(clientId, unitId, form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save bill rate breakup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={initial?._id ? "Edit Bill Rate Breakup" : "New Bill Rate Breakup"} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Shift" value={form.shift} onChange={set("shift")} />
          <Field label="Service" value={form.service} onChange={set("service")} />
          <Field label="Nos" type="number" value={form.nos} onChange={set("nos")} />
          <Field label="Month Days" type="number" value={form.monthDays} onChange={set("monthDays")} />
          <Field label="Service Print Name" value={form.servicePrintName} onChange={set("servicePrintName")} />
          <Field label="Remark" value={form.remark} onChange={set("remark")} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Bill Breakup</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {BILL_ALLOWANCES.map(([key, label]) => (
              <Field
                key={key}
                label={label}
                type="number"
                value={getPath(form, `billBreakup.${key}`)}
                onChange={set(`billBreakup.${key}`)}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Bill Terms</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {BILL_TERMS.map(([key, label]) => (
              <Field
                key={key}
                label={label}
                type="number"
                value={getPath(form, `billTerms.${key}`)}
                onChange={set(`billTerms.${key}`)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Total Amount" type="number" value={form.totalAmount} onChange={set("totalAmount")} />
          <Field label="Document" value={form.document} onChange={set("document")} />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!form.isHideAttendance}
              onChange={set("isHideAttendance")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Hide Attendance
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={!!form.isHideRate}
              onChange={set("isHideRate")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Hide Rate
          </label>
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
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
