"use client";

const LoadingScan = ({ label = "Loading…" }: { label?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="size-10 animate-spin rounded-full border-4 border-neutral-200 border-t-primary" />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
};

export default LoadingScan;
