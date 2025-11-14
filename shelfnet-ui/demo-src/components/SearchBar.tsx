"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { LoaderCircle, Search, XCircle } from "lucide-react";

type SearchBarStatus = "idle" | "loading" | "success" | "error";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  status?: SearchBarStatus;
  helper?: string;
  disabled?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = "Search repositories…",
  status = "idle",
  helper,
  disabled,
}: SearchBarProps) {
  const statusColorMap: Record<SearchBarStatus, string> = {
    idle: "text-slate-400",
    loading: "text-sky-400",
    success: "text-emerald-400",
    error: "text-rose-400",
  };

  const showClear = Boolean(value?.length);

  return (
    <div className="space-y-1">
      <div className="relative flex items-center gap-2">
        <div className="pointer-events-none absolute left-3 text-slate-500">
          <Search size={16} />
        </div>
        <input
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSubmit?.();
          }}
          placeholder={placeholder}
          className={clsx(
            "input-base pl-9 pr-12",
            status === "error" && "input-invalid",
            status === "success" && "input-valid",
            disabled && "opacity-60"
          )}
        />
        {showClear ? (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-28 text-slate-400 transition hover:text-slate-100"
            onClick={() => {
              if (onClear) onClear();
              else onChange("");
            }}
          >
            <XCircle size={18} />
          </button>
        ) : null}
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          disabled={disabled}
          className="flex h-11 min-w-[90px] items-center justify-center rounded-lg bg-sky-500/90 px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </motion.button>
      </div>
      {helper ? (
        <p className={clsx("text-xs", statusColorMap[status])}>{helper}</p>
      ) : null}
    </div>
  );
}

export default SearchBar;
