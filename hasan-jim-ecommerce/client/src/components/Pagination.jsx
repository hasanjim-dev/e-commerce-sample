export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-mist-200 disabled:opacity-30"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-9 w-9 rounded-lg text-sm transition ${
            p === page ? "bg-violet-500 text-white" : "border border-ink-700 text-mist-300 hover:border-violet-500"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-ink-700 px-3 py-2 text-sm text-mist-200 disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}
