import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { SESSION_COOKIE } from "./constants";

export { SESSION_COOKIE, SESSION_MAX_AGE } from "./constants";

export function expectedToken() {
  return process.env.WORKSPACE_TOKEN || "demo";
}

function secret() {
  return process.env.SESSION_SECRET || expectedToken();
}

export function signSession() {
  const nonce = randomBytes(16).toString("hex");
  const sig = createHmac("sha256", secret()).update(nonce).digest("hex");
  return `${nonce}.${sig}`;
}

export function verifySession(value?: string) {
  if (!value) return false;
  const [nonce, sig] = value.split(".");
  if (!nonce || !sig) return false;
  const expected = createHmac("sha256", secret()).update(nonce).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
