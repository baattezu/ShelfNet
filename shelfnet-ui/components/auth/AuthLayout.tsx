"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] font-sans">
      <div className="w-full max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
