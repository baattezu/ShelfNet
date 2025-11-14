export default function EmptyState({
  title = "Empty for now",
  description = "Add books to fill this collection",
  actionLabel = "Add book",
  onAction,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-[#0f172a] rounded-lg">
      <div className="text-6xl">📖</div>
      <div className="text-lg font-semibold text-white">{title}</div>
      <div className="text-sm text-[#94a3b8] text-center max-w-md">
        {description}
      </div>
      <button
        onClick={() => onAction?.()}
        className="mt-2 px-4 py-2 rounded-lg bg-[#3b82f6] text-white"
      >
        {actionLabel}
      </button>
    </div>
  );
}
