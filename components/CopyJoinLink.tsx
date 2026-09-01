"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function CopyJoinLink({ interviewId }: { interviewId: string }) {
  const path = `/join/${interviewId}`;
  const [localUrl, setLocalUrl] = useState("");
  const [publicUrl, setPublicUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLocalUrl(`${window.location.origin}${path}`);

    const load = () =>
      fetch("/api/share-origin")
        .then((response) => response.json())
        .then((data: { https?: string | null }) => {
          if (data.https) setPublicUrl(`${data.https}${path}`);
        })
        .catch(() => undefined);

    void load();
    const timer = window.setInterval(load, 4000);
    return () => window.clearInterval(timer);
  }, [path]);

  const shareUrl = publicUrl || localUrl;
  const shareText = `Join my peer interview (works on any Wi-Fi or mobile data): ${shareUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent("Join my peer interview")}&body=${encodeURIComponent(shareText)}`;

  const copy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-6">
      <h3 className="mb-2 text-xl font-semibold">Share join link</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Keep <code className="text-xs">npm run tunnel</code> running with the
        site. Then anyone on another Wi-Fi or mobile data can open the https
        link.
      </p>

      <div className="mb-3 overflow-auto rounded-lg bg-muted p-3">
        <p className="mb-1 text-xs text-muted-foreground">Anyone, any network</p>
        <code className="break-all text-sm">
          {publicUrl || "Start npm run tunnel, then refresh — waiting for https://….trycloudflare.com"}
        </code>
      </div>

      <div className="mb-4 overflow-auto rounded-lg bg-muted p-3">
        <p className="mb-1 text-xs text-muted-foreground">This computer only</p>
        <code className="break-all text-sm">{localUrl || path}</code>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={copy} disabled={!publicUrl}>
          {copied ? "Copied" : "Copy public link"}
        </Button>
        <Button asChild variant="outline">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={emailHref}>Email</a>
        </Button>
      </div>
    </div>
  );
}
