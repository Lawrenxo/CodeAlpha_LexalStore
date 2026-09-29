import { Router } from "express";
import { z } from "zod";
import { repo } from "../repos/repo.js";
import { UserSignupCredSchema, UserSigninCredSchema } from "../models/user.js";
import { CheckoutSchema } from "../models/order.js";
import { createSession, destroySession, requireAuthApi } from "../middleware/session.js";

const router = Router();

function safeUser(u) {
  if (!u) return null;
  return { id: u.id, username: u.username, email: u.email, createdAt: u.createdAt };
}

// ---------- Products ----------
router.get("/products", async (req, res) => {
  try {
    const q = String(req.query.q || "");
    const category = String(req.query.category || "");
    const products = await repo.product().list({ q, category });
    res.json({ products });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load products" });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const p = await repo.product().findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json({ product: p });
  } catch (e) {
    res.status(500).json({ error: "Failed to load product" });
  }
});

// ---------- Auth ----------
router.post("/auth/signup", async (req, res) => {
  try {
    const cred = UserSignupCredSchema.parse(req.body);
    const existing = await repo.user().findByEmail(cred.email).catch(() => null);
    if (existing) return res.status(409).json({ error: "Email already registered" });
    const user = await repo.user().create(cred);
    createSession(res, user.id);
    res.status(201).json({ user: safeUser(user) });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: "Invalid input", issues: e.issues });
    if (String(e?.message || "").includes("Duplicate")) return res.status(409).json({ error: "Username or email already taken" });
    if (e?.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Username or email already taken" });
    console.error(e);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const cred = UserSigninCredSchema.parse(req.body);
    const user = await repo.user().verifySignin(cred.email, cred.password);
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    createSession(res, user.id);
    res.json({ user: safeUser(user) });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: "Invalid input", issues: e.issues });
    console.error(e);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/auth/logout", (req, res) => {
  destroySession(req, res);
  res.json({ ok: true });
});

router.get("/auth/me", (req, res) => {
  res.json({ user: safeUser(req.user) });
});

// ---------- Orders / Checkout ----------
router.post("/orders/checkout", requireAuthApi, async (req, res) => {
  try {
    const input = CheckoutSchema.parse(req.body);
    const ids = [...new Set(input.items.map((i) => i.productId))];
    const products = await repo.product().findManyByIds(ids);
    if (products.length !== ids.length) return res.status(400).json({ error: "One or more products not found" });
    const priceById = new Map(products.map((p) => [p.id, Number(p.price)]));
    // stock check
    for (const p of products) {
      const qty = input.items.find((i) => i.productId === p.id)?.quantity ?? 0;
      if (p.stock < qty) return res.status(400).json({ error: `Only ${p.stock} left for ${p.name}` });
    }
    const items = input.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: priceById.get(i.productId) }));
    const order = await repo.order().createOrder({
      userId: req.user.id,
      items,
      shippingAddress: input.shippingAddress,
      shippingType: input.shippingType,
      promoCode: input.promoCode || ""
    });
    res.status(201).json({ order });
  } catch (e) {
    if (e instanceof z.ZodError) return res.status(400).json({ error: "Invalid checkout data", issues: e.issues });
    console.error(e);
    res.status(500).json({ error: "Checkout failed" });
  }
});

router.get("/orders", requireAuthApi, async (req, res) => {
  try {
    const orders = await repo.order().listByUser(req.user.id);
    res.json({ orders });
  } catch (e) {
    res.status(500).json({ error: "Failed to load orders" });
  }
});

router.get("/orders/:id", requireAuthApi, async (req, res) => {
  try {
    const order = await repo.order().findById(req.params.id);
    if (!order || order.userId !== req.user.id) return res.status(404).json({ error: "Order not found" });
    res.json({ order });
  } catch (e) {
    res.status(500).json({ error: "Failed to load order" });
  }
});

export default router;
