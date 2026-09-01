import { networkInterfaces } from "os";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const host = request.headers.get("host") || "localhost:3000";
  const port = host.includes(":") ? host.split(":").pop() : "3000";
  const nets = networkInterfaces();
  let lan: string | null = null;

  for (const entries of Object.values(nets)) {
    for (const net of entries || []) {
      if (net.family === "IPv4" && !net.internal) {
        lan = `http://${net.address}:${port}`;
        break;
      }
    }
    if (lan) break;
  }

  let https: string | null = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || null;
  if (!https?.startsWith("https://")) {
    try {
      const saved = (await readFile(path.join(process.cwd(), ".tunnel-url"), "utf8")).trim();
      https = saved.startsWith("https://") ? saved : null;
    } catch {
      https = null;
    }
  }

  return Response.json({
    local: `http://localhost:${port}`,
    lan,
    https,
  });
}
