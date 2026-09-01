import { spawn } from "child_process";
import { writeFileSync } from "fs";
import { join } from "path";

const outFile = join(process.cwd(), ".tunnel-url");
const bin = process.platform === "win32" ? "cloudflared.exe" : "cloudflared";

const child = spawn(
  bin,
  [
    "tunnel",
    "--url",
    "http://127.0.0.1:3000",
    "--protocol",
    "http2",
  ],
  {
    stdio: ["ignore", "pipe", "pipe"],
  }
);

const seen = new Set();

const handle = (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);
  const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
  if (match && !seen.has(match[0])) {
    seen.add(match[0]);
    writeFileSync(outFile, match[0], "utf8");
    console.log(`\nPublic join base URL saved: ${match[0]}\nShare: ${match[0]}/join/YOUR_INTERVIEW_ID\n`);
  }
};

child.stdout.on("data", handle);
child.stderr.on("data", handle);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
