import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../config.js";
import { repo } from "../repos/repo.js";

/** In-memory session store: sid -> userId */
const sessions = new Map();

function sign(value) {
  return createHmac("sha256", env.SESSION_SECRET).update(value).digest("hex");
}

function parseCookies(req) {
  const out = {};
  const header = req.headers?.cookie;
  if (!header) return out;
  for (const part of header.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = decodeURIComponent(part.slice(i + 1).trim());
    out[k] = v;
  }
  return out;
}

export function sessionMiddleware(req, _res, next) {
  req.cookies = parseCookies(req);
  req.session = null;
  req.user = null;
  const raw = req.cookies.sid;
  if (raw) {
    const [sid, sig] = String(raw).split(".");
    if (sid && sig) {
      try {
        const expected = sign(sid);
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length === b.length && timingSafeEqual(a, b)) {
          const userId = sessions.get(sid);
          if (userId) req.session = { sid, userId };
        }
      } catch {}
    }
  }
  next();
}

export async function attachUser(req, _res, next) {
  if (req.session?.userId) {
    try {
      req.user = await repo.user().findById(req.session.userId);
    } catch {
      req.user = null;
    }
  }
  next();
}

export function createSession(res, userId) {
  const sid = randomBytes(24).toString("hex");
  sessions.set(sid, userId);
  const sig = sign(sid);
  res.setHeader("Set-Cookie", `sid=${sid}.${sig}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`);
}

export function destroySession(req, res) {
  if (req.session?.sid) sessions.delete(req.session.sid);
  res.setHeader("Set-Cookie", `sid=; HttpOnly; Path=/; Max-Age=0`);
}

export function requireAuthApi(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Login required" });
  next();
}

export function requireAuthView(redirectTo = "/login") {
  return (req, res, next) => {
    if (!req.user) return res.redirect(`${redirectTo}?next=${encodeURIComponent(req.originalUrl)}`);
    next();
  };
}
