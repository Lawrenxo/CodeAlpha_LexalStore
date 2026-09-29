import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { env } from "./config.js";
import apiRouter from "./routes/api.js";
import viewRouter from "./routes/view.js";
import { sessionMiddleware, attachUser } from "./middleware/session.js";
import { repo } from "./repos/repo.js";
import { seedProducts } from "./data/products.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(sessionMiddleware);
app.use(attachUser);

// Fallback SVG art for legacy .svg URLs (real JPG photos now live in public/img/).
// express.static serves /img/products/*.jpg, /img/hero/*.jpg, /img/ideas/*.jpg first;
// this route only handles *.svg misses so old DB rows don't break.
app.get("/img/products/:name.svg", (req, res) => {
  const key = String(req.params.name || "").replace(/[^a-z-]/g, "");
  const palettes = {
    watch: ["#111827", "#E11D2E"], earbuds: ["#F3F4F6", "#E11D2E"],
    speaker: ["#1F2937", "#E11D2E"], charger: ["#F9FAFB", "#111827"],
    drone: ["#0F172A", "#E11D2E"], gimbal: ["#374151", "#E11D2E"],
    smartspeaker: ["#7F1D1D", "#FCA5A5"], keyboard: ["#111827", "#F87171"],
    powerbank: ["#E5E7EB", "#E11D2E"], bulb: ["#FEF3C7", "#F59E0B"],
    band: ["#111827", "#22C55E"], headphones: ["#F3F4F6", "#111827"]
  };
  const [bg, fg] = palettes[key] || ["#F3F4F6", "#E11D2E"];
  res.type("image/svg+xml").send(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">` +
    `<rect width="600" height="450" rx="24" fill="${bg}"/>` +
    `<circle cx="480" cy="90" r="120" fill="${fg}" opacity="0.25"/>` +
    `<circle cx="120" cy="360" r="90" fill="${fg}" opacity="0.2"/>` +
    `<rect x="170" y="120" width="260" height="170" rx="28" fill="none" stroke="${fg}" stroke-width="10"/>` +
    `<circle cx="300" cy="205" r="46" fill="${fg}"/>` +
    `<text x="300" y="350" text-anchor="middle" font-family="Arial" font-size="28" font-weight="bold" fill="${fg}">${key.toUpperCase()}</text></svg>`
  );
});

app.use("/api", apiRouter);
app.use("/", viewRouter);

// seed DB in background + migrate old .svg image_urls to .jpg photos
async function seed() {
  try {
    await repo.product().ensureProductColumns();
    const n = await repo.product().seedIfEmpty(seedProducts);
    try {
      const db = repo.product().db();
      await db.query(`UPDATE products SET image_url = REPLACE(image_url, '.svg', '.jpg') WHERE image_url LIKE '%.svg'`);
      // refresh any rows whose file doesn't match new catalogue names (safety)
      const [rows] = await db.query(`SELECT id, name, image_url FROM products`);
      const byName = new Map(seedProducts.map((p) => [p.name, p.imageUrl]));
      for (const r of rows) {
        const correct = byName.get(r.name);
        if (correct && r.image_url !== correct) {
          await db.query(`UPDATE products SET image_url = ? WHERE id = ?`, [correct, r.id]);
        }
      }
    } catch (e) {
      console.warn("Image URL migration skipped:", e.message);
    }
    console.log(`Products in DB: ${n}`);
  } catch (e) {
    console.warn("Seed skipped (DB not ready):", e.message);
  }
}
seed();

const port = env.PORT || 3000;
app.listen(port, () => {
  console.log(`Lexal Tech Store / Lexal Store running on http://localhost:${port}`);
});

