import { Router } from "express";
import { repo } from "../repos/repo.js";
import { seedProducts, ideas } from "../data/products.js";
import { requireAuthView } from "../middleware/session.js";

const router = Router();

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

async function getCatalog(query = {}) {
  const q = String(query.q || "");
  const category = String(query.category || "All");
  let products = [];
  let cats = [];
  try {
    products = await repo.product().list({ q, category: category === "All" ? "" : category });
    cats = await repo.product().categories().catch(() => []);
  } catch {}
  if (!cats.length) cats = ["Gadgets", "Smart Home", "Audio", "Wearables", "Accessories", "Sale"];
  return { products, cats, q, category };
}

// Home — Lexal Tech Store template
router.get("/", async (req, res) => {
  const { products, cats } = await getCatalog();
  const trending = products.slice(0, 6);
  res.render("index", {
    user: req.user,
    products: products.slice(0, 8),
    trending,
    categories: cats,
    ideas,
    money,
    q: "",
    category: "All",
    page: "home"
  });
});

// Shop / product listing
router.get("/shop", async (req, res) => {
  const { products, cats, q, category } = await getCatalog(req.query);
  res.render("pages/shop", { user: req.user, products, categories: cats, q, category, money, page: "shop" });
});

// Product details
router.get("/products/:id", async (req, res) => {
  let product = null;
  let related = [];
  try {
    product = await repo.product().findById(req.params.id);
    if (product) {
      const all = await repo.product().list({ category: product.category });
      related = all.filter((p) => p.id !== product.id).slice(0, 4);
      if (related.length < 4) {
        const more = await repo.product().list({});
        for (const m of more) {
          if (m.id !== product.id && !related.find((r) => r.id === m.id)) related.push(m);
          if (related.length >= 4) break;
        }
      }
    }
  } catch {}
  if (!product) return res.status(404).render("pages/404", { user: req.user, q: "", categories: [], page: "" });
  res.render("pages/product", { user: req.user, product, related, money, q: "", categories: [], page: "shop" });
});

// Cart (client-side localStorage, server renders shell + recommendations)
router.get("/cart", async (req, res) => {
  const { products } = await getCatalog();
  res.render("pages/cart", { user: req.user, recommendations: products.slice(0, 4), money, q: "", categories: [], page: "cart" });
});

// Checkout
router.get("/checkout", requireAuthView(), async (req, res) => {
  res.render("pages/checkout", { user: req.user, money, q: "", categories: [], page: "cart" });
});

// Auth pages
router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("pages/login", { user: null, next: req.query.next || "", q: "", categories: [], page: "" });
});
router.get("/register", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("pages/register", { user: null, next: req.query.next || "", q: "", categories: [], page: "" });
});

// Orders
router.get("/orders", requireAuthView(), async (req, res) => {
  let orders = [];
  try { orders = await repo.order().listByUser(req.user.id); } catch {}
  res.render("pages/orders", { user: req.user, orders, money, q: "", categories: [], page: "orders" });
});

router.get("/orders/:id", requireAuthView(), async (req, res) => {
  let order = null;
  try {
    order = await repo.order().findById(req.params.id);
    if (order && order.userId !== req.user.id) order = null;
  } catch {}
  if (!order) return res.status(404).render("pages/404", { user: req.user, q: "", categories: [], page: "" });
  res.render("pages/order", { user: req.user, order, money, q: "", categories: [], page: "orders" });
});

// Wishlist
router.get("/wishlist", async (req, res) => {
  const { products } = await getCatalog();
  res.render("pages/wishlist", { user: req.user, products: products.slice(0, 8), money, q: "", categories: [], page: "wishlist" });
});

router.get("/about", (req, res) => {
  res.render("pages/about", { user: req.user, q: "", categories: [], page: "" });
});

export default router;

