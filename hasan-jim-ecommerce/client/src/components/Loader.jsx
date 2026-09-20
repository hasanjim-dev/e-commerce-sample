export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-mist-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-600 border-t-violet-500" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
