"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SKILL_BANKS } from "@/lib/assessment/catalog";
import { ChevronDown } from "lucide-react";

export default function LanguagePicker() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const label = useMemo(() => {
    if (selected.length === 0) return "Select languages";
    const names = SKILL_BANKS.filter((bank) => selected.includes(bank.id)).map(
      (bank) => bank.title
    );
    if (names.length <= 2) return names.join(", ");
    return `${names.length} languages selected`;
  }, [selected]);

  const perLanguage = selected.length
    ? Math.floor(25 / selected.length)
    : 0;
  const extra = selected.length ? 25 % selected.length : 0;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const start = () => {
    if (selected.length === 0) return;
    router.push(`/assessment/take?langs=${encodeURIComponent(selected.join(","))}`);
  };

  return (
    <div className="mt-8 max-w-xl rounded-2xl border border-border bg-card p-6">
      <label className="text-sm font-medium">Languages to include</label>
      <div ref={boxRef} className="relative mt-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-left text-sm"
        >
          <span className={selected.length ? "text-foreground" : "text-muted-foreground"}>
            {label}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg">
            {SKILL_BANKS.map((bank) => (
              <label
                key={bank.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(bank.id)}
                  onChange={() => toggle(bank.id)}
                />
                {bank.title}
              </label>
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        One paper of 50: 25 aptitude plus 25 language questions split across what you
        check
        {selected.length > 0
          ? ` (~${perLanguage}${extra ? `–${perLanguage + 1}` : ""} each).`
          : "."}
      </p>
      <Button className="mt-5" disabled={selected.length === 0} onClick={start}>
        Start mixed test
      </Button>
    </div>
  );
}
