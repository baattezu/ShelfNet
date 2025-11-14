export default function LayoutContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-6 py-6     ${className}`}>
      {children}
    </div>
  );
}
