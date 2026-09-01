"use client";

import type { JoinDevice } from "@/components/VideoChat";

export default function JoinDeviceSelect({
  value,
  onChange,
}: {
  value: JoinDevice;
  onChange: (value: JoinDevice) => void;
}) {
  return (
    <label className="mb-4 flex w-full max-w-md flex-col gap-2 text-sm">
      <span className="font-medium">Join from</span>
      <select
        className="rounded-lg border border-border bg-background px-3 py-2"
        value={value}
        onChange={(event) => onChange(event.target.value as JoinDevice)}
      >
        <option value="computer">Laptop / Windows PC</option>
        <option value="phone">This phone</option>
      </select>
      <span className="text-muted-foreground">
        {value === "phone"
          ? "Uses this phone camera. The PC will not take the phone as its webcam."
          : "Uses the laptop built-in webcam only. Phone Link / S24 virtual camera is ignored."}
      </span>
    </label>
  );
}
