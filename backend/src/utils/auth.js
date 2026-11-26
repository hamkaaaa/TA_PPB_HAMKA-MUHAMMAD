import crypto from "crypto";

function getJwtSecret() {
  if (process.env.JWT_SECRET?.trim()) {
    return process.env.JWT_SECRET.trim();
  }
  return crypto
    .createHash("sha256")
    .update(process.env.SUPABASE_KEY || "tempomatch-dev-secret")
    .digest("hex");
}

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + "=".repeat(padLen), "base64").toString("utf8");
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== "string" || !stored.includes(":")) {
    return false;
  }
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;
  const expectedBuf = Buffer.from(hashHex, "hex");
  const actualBuf = crypto.scryptSync(password, salt, 64);
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

export function signToken(payload, expiresInSeconds = 7 * 86400) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const body = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    })
  );
  const signingInput = `${header}.${body}`;
  const signature = base64UrlEncode(
    crypto.createHmac("sha256", getJwtSecret()).update(signingInput).digest()
  );
  return `${signingInput}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, sig] = parts;
  const signingInput = `${header}.${body}`;
  const expectedSig = base64UrlEncode(
    crypto.createHmac("sha256", getJwtSecret()).update(signingInput).digest()
  );

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body));
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === "number" && payload.exp < now) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
