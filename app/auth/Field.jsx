import React from "react";

export default function Field({ id, label, error, inputRef, ...props }) {
  const baseClass =
    "bg-background border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:shadow-[0_0_8px_rgba(0,240,255,0.4)] transition-shadow";

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-foreground/50">
        {label}
      </span>
      <input
        id={id}
        ref={inputRef}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
        required
        className={`${baseClass} ${error ? "border-red-500" : "border-panel-border"}`}
      />

      {error && (
        <p id={`${id}-error`} role="alert" aria-live="polite" className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </label>
  );
}
