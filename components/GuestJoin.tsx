"use client";

import { useEffect, useState } from "react";
import PeerAgent from "@/components/PeerAgent";
import JoinDeviceSelect from "@/components/JoinDeviceSelect";
import { Button } from "@/components/ui/button";
import type { JoinDevice } from "@/components/VideoChat";

interface GuestJoinProps {
  interviewId: string;
  roomId: string;
  role: string;
  level: string;
}

export default function GuestJoin({
  interviewId,
  roomId,
  role,
  level,
}: GuestJoinProps) {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [joinDevice, setJoinDevice] = useState<JoinDevice>("phone");
  const [joined, setJoined] = useState(false);
  const [guestId, setGuestId] = useState("guest");
  const [showInAppTip, setShowInAppTip] = useState(false);

  useEffect(() => {
    const savedId = sessionStorage.getItem("peer-guest-id") || `guest-${Date.now()}`;
    const savedName = sessionStorage.getItem("peer-guest-name") || "";
    const savedDevice = sessionStorage.getItem("peer-join-device");
    setGuestId(savedId);
    setName(savedName);
    if (savedDevice === "phone" || savedDevice === "computer") {
      setJoinDevice(savedDevice);
    } else if (window.innerWidth >= 768) {
      setJoinDevice("computer");
    }
    setShowInAppTip(/WhatsApp|FBAN|FBAV|Instagram/i.test(navigator.userAgent));
    setReady(true);
  }, []);

  const start = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem("peer-guest-id", guestId);
    sessionStorage.setItem("peer-guest-name", trimmed);
    sessionStorage.setItem("peer-join-device", joinDevice);
    setJoined(true);
  };

  if (!ready) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Loading join options…</p>
      </div>
    );
  }

  if (!joined) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Join as interviewer</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {role} interview · {level}. Choose how you are joining so your phone
          is not used as the Windows camera.
        </p>
        {showInAppTip && (
          <p className="mt-3 rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-3 text-sm">
            Tap the menu and choose Open in Chrome or Safari before joining.
          </p>
        )}

        <div className="mt-6">
          <JoinDeviceSelect value={joinDevice} onChange={setJoinDevice} />
        </div>

        <input
          className="mt-6 w-full rounded-lg border border-border bg-background px-3 py-2"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") start();
          }}
        />
        <Button className="mt-4 w-full" onClick={start} disabled={!name.trim()}>
          Join from {joinDevice === "phone" ? "this phone" : "this computer"}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Join as interviewer</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Joined from {joinDevice === "phone" ? "this phone" : "this computer"}
      </p>
      <PeerAgent
        userName={name}
        userId={guestId}
        interviewId={interviewId}
        roomId={roomId}
        role={role}
        level={level}
        isInterviewer
        showCards={false}
        canStartCall
        joinDevice={joinDevice}
      />
    </div>
  );
}
