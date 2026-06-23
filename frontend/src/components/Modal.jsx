export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-lg ${
          wide ? "max-w-4xl" : "max-w-lg"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            &#x2715;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
