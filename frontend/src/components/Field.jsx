export default function Field({ label, type = "text", value, onChange, required, options }) {
  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {options ? (
        <select value={value ?? ""} onChange={onChange} className={inputClass} required={required}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          checked={!!value}
          onChange={onChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          className={inputClass}
        />
      )}
    </div>
  );
}
