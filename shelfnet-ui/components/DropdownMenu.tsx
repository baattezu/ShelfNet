"use client";
import React, { useState, useRef, useEffect } from "react";

export default function DropdownMenu({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((s) => !s)} className="p-1 rounded-md">
        {trigger}
      </button>
      {open ? (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-md shadow-md z-50">
          {children}
        </div>
      ) : null}
    </div>
  );
}
