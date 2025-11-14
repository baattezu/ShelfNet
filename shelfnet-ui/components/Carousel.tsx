export default function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-2">
      <div className="flex gap-4 overflow-x-auto px-2 py-2">{children}</div>
    </div>
  );
}
