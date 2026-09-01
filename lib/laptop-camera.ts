export type JoinDevice = "phone" | "computer";

export function isVirtualOrPhoneCamera(label: string) {
  return /iphone|ipad|continuity|camo|iriun|droidcam|epoccam|s24|s23|s22|s21|galaxy|samsung|android|virtual camera|windows virtual|phone link|link to windows|obs virtual|obs studio|many ?cam|snap camera|\bphone\b/i.test(
    label
  );
}

export function isIntegratedWebcam(label: string) {
  return /integrated|built[- ]?in|facetime|webcam|hd camera|usb|uvc|logitech|lenovo|dell|hp |realtek|microsoft camera|laptop|true vision|user facing/i.test(
    label
  );
}

function mediaErrorMessage(err: unknown) {
  const name = err instanceof DOMException ? err.name : "";
  const text = err instanceof Error ? err.message : "";
  if (name === "NotAllowedError" || /permission|denied/i.test(text)) {
    return "Camera or mic is blocked. Click the camera icon in the address bar, choose Allow, then Reload.";
  }
  if (name === "NotReadableError" || /in use|busy/i.test(text)) {
    return "The camera is already open in another app (Camera, Teams, Zoom). Close that app, then Reload.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError" || /Requested device not found/i.test(text)) {
    return "Could not open the laptop webcam. Close other video apps, then Reload.";
  }
  return text || "Could not start the camera.";
}

async function openCamera(constraints: MediaStreamConstraints) {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    throw new Error(mediaErrorMessage(err));
  }
}

function uniqueCameras(cameras: MediaDeviceInfo[]) {
  const seen = new Set<string>();
  return cameras.filter((camera) => {
    if (!camera.deviceId || seen.has(camera.deviceId)) return false;
    seen.add(camera.deviceId);
    return true;
  });
}

export async function getCallMedia(joinDevice: JoinDevice, cameraId?: string) {
  const media = navigator.mediaDevices;
  if (!media?.getUserMedia) {
    throw new Error("Allow the camera, then reload.");
  }

  if (joinDevice === "phone") {
    const stream = await openCamera({
      video: { facingMode: "user" },
      audio: true,
    });
    return {
      stream,
      cameraLabel: stream.getVideoTracks()[0]?.label || "Phone camera",
      cameras: [] as MediaDeviceInfo[],
    };
  }

  const probe = await openCamera({ video: true, audio: true });
  const devices = await media.enumerateDevices();
  probe.getTracks().forEach((track) => track.stop());
  await new Promise((resolve) => setTimeout(resolve, 250));

  const cameras = uniqueCameras(
    devices.filter(
      (device) => device.kind === "videoinput" && !isVirtualOrPhoneCamera(device.label)
    )
  );

  const preferred = uniqueCameras(
    [
      cameras.find((device) => device.deviceId === cameraId),
      cameras.find((device) => isIntegratedWebcam(device.label)),
      ...cameras,
    ].filter((device): device is MediaDeviceInfo => Boolean(device))
  );

  for (const camera of preferred) {
    try {
      const stream = await media.getUserMedia({
        video: { deviceId: { exact: camera.deviceId } },
        audio: true,
      });
      const label = stream.getVideoTracks()[0]?.label || camera.label;
      if (isVirtualOrPhoneCamera(label)) {
        stream.getTracks().forEach((track) => track.stop());
        continue;
      }
      return { stream, cameraLabel: label || "Laptop webcam", cameras };
    } catch {
      continue;
    }
  }

  throw new Error(
    "No laptop webcam found. Windows is offering the phone virtual camera only. Turn off Phone Link camera (Settings → Bluetooth & devices → Mobile devices), then Reload."
  );
}
