"use client";

import * as React from "react";

export type JoinDevice = "phone" | "computer";

interface VideoChatProps {
  roomId: string;
  userName: string;
  role: "interviewer" | "interviewee";
  joinDevice?: JoinDevice;
  onError?: (errorMessage: string) => void;
}

function roomName(roomId: string) {
  const id = roomId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 60);
  return `CareerSync${id || "Room"}`;
}

const VideoChat = ({ roomId, userName }: VideoChatProps) => {
  const room = roomName(roomId);
  const src = React.useMemo(() => {
    const hash = [
      `userInfo.displayName="${encodeURIComponent(userName || "Guest")}"`,
      "config.prejoinPageEnabled=false",
      "config.startWithAudioMuted=false",
      "config.startWithVideoMuted=false",
      "config.disableDeepLinking=true",
    ].join("&");
    return `https://meet.jit.si/${room}#${hash}`;
  }, [room, userName]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {userName} · Live video works on any Wi-Fi or mobile data. In the call
        settings, pick your laptop webcam (not Phone Link / S24).
      </p>
      <div className="overflow-hidden rounded-2xl border border-border bg-black">
        <iframe
          title="Peer interview video"
          src={src}
          allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
          allowFullScreen
          className="aspect-video h-[min(70vh,640px)] w-full border-0 bg-black"
        />
      </div>
    </div>
  );
};

export default VideoChat;
