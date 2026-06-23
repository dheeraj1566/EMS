import { useState } from "react";
import Modal from "../Modal";
import Field from "../Field";
import { getPath, setPath } from "../../utils/nested";
import {
  addSalaryRateBreakup,
  updateSalaryRateBreakup,
} from "../../api/units";

const SALARY_ALLOWANCES = [
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
];

const APPLICABLE_FLAGS = [
  ["lwf", "LWF"],
  ["pt", "PT"],
  ["uniformDeduction", "Uniform Deduction"],
  ["advanceDeduction", "Advance Deduction"],
  ["esiOnOT", "ESI on OT"],
  ["esiOnWeeklyOff", "ESI on Weekly Off"],
  ["pfOnOT", "PF on OT"],
];

const emptyForm = {
  shift: "",
  service: "",
  nos: 0,
  monthDays: 0,
  servicePrintName: "",
  remark: "",
  salaryBreakup: {},
  totalSalary: 0,
  otHrsRate: 0,
  otRate: 0,
  weeklyOff: 0,
  nightAllow: 0,
  cl0Allow: 0,
  cl1Allow: 0,
  cl2Allow: 0,
  applicable: {},
  adminCharges: 0,
  pfPercentage: 12,
  pfAmount: 0,
  esicPercentage: 0.75,
  esicAmount: 0,
  document: "",
};

export default function SalaryRateBreakupModal({ clientId, unitId, initial, onClose, onSaved }) {
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
        await updateSalaryRateBreakup(clientId, unitId, initial._id, form);
      } else {
        await addSalaryRateBreakup(clientId, unitId, form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save salary rate breakup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={initial?._id ? "Edit Salary Rate Breakup" : "New Salary Rate Breakup"} onClose={onClose} wide>
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
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Salary Breakup</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SALARY_ALLOWANCES.map(([key, label]) => (
              <Field
                key={key}
                label={label}
                type="number"
                value={getPath(form, `salaryBreakup.${key}`)}
                onChange={set(`salaryBreakup.${key}`)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field label="Total Salary" type="number" value={form.totalSalary} onChange={set("totalSalary")} />
          <Field label="OT Hrs Rate" type="number" value={form.otHrsRate} onChange={set("otHrsRate")} />
          <Field label="OT Rate" type="number" value={form.otRate} onChange={set("otRate")} />
          <Field label="Weekly Off" type="number" value={form.weeklyOff} onChange={set("weeklyOff")} />
          <Field label="Night Allow" type="number" value={form.nightAllow} onChange={set("nightAllow")} />
          <Field label="CL0 Allow" type="number" value={form.cl0Allow} onChange={set("cl0Allow")} />
          <Field label="CL1 Allow" type="number" value={form.cl1Allow} onChange={set("cl1Allow")} />
          <Field label="CL2 Allow" type="number" value={form.cl2Allow} onChange={set("cl2Allow")} />
          <Field label="Admin Charges" type="number" value={form.adminCharges} onChange={set("adminCharges")} />
          <Field label="PF %" type="number" value={form.pfPercentage} onChange={set("pfPercentage")} />
          <Field label="PF Amount" type="number" value={form.pfAmount} onChange={set("pfAmount")} />
          <Field label="ESIC %" type="number" value={form.esicPercentage} onChange={set("esicPercentage")} />
          <Field label="ESIC Amount" type="number" value={form.esicAmount} onChange={set("esicAmount")} />
          <Field label="Document" value={form.document} onChange={set("document")} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Applicable</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {APPLICABLE_FLAGS.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={!!getPath(form, `applicable.${key}`)}
                  onChange={set(`applicable.${key}`)}
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
