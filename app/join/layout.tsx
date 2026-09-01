import { ReactNode } from "react";

export default function JoinLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
