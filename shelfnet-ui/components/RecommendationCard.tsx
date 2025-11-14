export default function RecommendationCard({ book }: { book?: any }) {
  return (
    <div className="flex flex-col bg-surface-dark dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-xl overflow-hidden shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 group">
      <div
        className="aspect-[2/3] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${book?.cover || ""})` }}
      />
      <div className="p-5 flex flex-col flex-grow bg-white dark:bg-slate-800">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">
          {book?.title ?? "Title"}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {book?.author ?? "Author"}
        </p>
        <p className="text-sm text-slate-400 mt-3 flex-grow">
          {book?.desc ?? "Book description..."}
        </p>
        <div className="mt-4">
          <span className="inline-block bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {book?.badge ?? "Reason"}
          </span>
        </div>
      </div>
    </div>
  );
}
