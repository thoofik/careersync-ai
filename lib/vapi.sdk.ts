import Vapi from "@vapi-ai/web";
import { formatError } from "@/lib/format-error";

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

const createStub = () => {
  const noop = () => {};
  return {
    on: noop,
    off: noop,
    start: async () => {
      throw new Error("Voice interviews need NEXT_PUBLIC_VAPI_WEB_TOKEN in .env.local");
    },
    stop: noop,
  } as unknown as Vapi;
};

export const vapi = token ? new Vapi(token) : createStub();

if (token) {
  vapi.on("error", (error) => {
    console.warn("[VAPI] Connection error:", formatError(error));
  });
}
