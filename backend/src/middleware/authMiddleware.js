import { verifyToken } from "../utils/auth.js";

function extractBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export function optionalAuth(req, res, next) {
  const token = extractBearerToken(req);
  if (token) {
    const payload = verifyToken(token);
    if (payload?.sub) {
      req.user = {
        id: payload.sub,
        username: payload.username,
        display_name: payload.display_name,
      };
      return next();
    }
  }
  req.user = null;
  next();
}

export function requireAuth(req, res, next) {
  const token = extractBearerToken(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload?.sub) {
    return res.status(401).json({ error: "Silakan login terlebih dahulu." });
  }
  req.user = {
    id: payload.sub,
    username: payload.username,
    display_name: payload.display_name,
  };
  next();
}
