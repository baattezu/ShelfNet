export default function BookCard({
  book,
  onAction,
}: {
  book?: any;
  onAction?: (action: string, bookId: any) => void;
}) {
  const cover = book?.cover || book?.image || book?.coverUrl || "";
  const genre = book?.genre || (book?.tags && book.tags[0]) || "—";
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-[#1e293b] p-4 shadow-md hover:shadow-xl transition-all hover:scale-105">
      <div className="relative overflow-hidden rounded-lg">
        {cover ? (
          <div
            className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg"
            style={{ backgroundImage: `url(${cover})` }}
          />
        ) : (
          <div className="w-full aspect-[3/4] rounded-lg bg-[#0f172a] flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-[#94a3b8]">
              photo_camera
            </span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-semibold text-white truncate">
          {book?.title ?? book?.name ?? "—"}
        </h3>
        <p className="text-sm text-[#94a3b8]">
          {book?.author ?? book?.authors?.join(", ") ?? "—"}
        </p>
        <div className="mt-2">
          <span className="text-xs font-medium bg-[#0f172a] text-[#3b82f6] px-2 py-1 rounded-full">
            {genre}
          </span>
        </div>
      </div>
    </div>
  );
}
