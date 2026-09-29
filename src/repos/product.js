import { randomUUID } from "node:crypto";
import { BaseRepo } from "./base.js";

function mapRow(r) {
    if (!r) return null;
    return {
        id: r.id,
        name: r.name,
        imageUrl: r.image_url ?? "",
        description: r.description ?? "",
        price: Number(r.price),
        category: r.category ?? "Gadgets",
        rating: Number(r.rating ?? 4.5),
        reviewsCount: Number(r.reviews_count ?? 0),
        stock: Number(r.stock ?? 50),
        badge: r.badge ?? "",
        createdAt: r.created_at ? new Date(r.created_at) : undefined
    };
}

export class ProductRepo extends BaseRepo {
    async list({ q = "", category = "" } = {}) {
        await this.ensureProductColumns().catch(() => {});
        const where = [];
        const params = [];
        if (q) { where.push(`(name LIKE ? OR description LIKE ?)`); params.push(`%${q}%`, `%${q}%`); }
        if (category && category !== "All") { where.push(`category = ?`); params.push(category); }
        const sql = `SELECT * FROM products ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT 100`;
        const [rows] = await this.db().query(sql, params);
        return rows.map(mapRow);
    }

    async findById(id) {
        await this.ensureProductColumns().catch(() => {});
        const [rows] = await this.db().query(`SELECT * FROM products WHERE id = ? LIMIT 1`, [id]);
        return rows.length ? mapRow(rows[0]) : null;
    }

    async findManyByIds(ids) {
        if (!ids.length) return [];
        const marks = ids.map(() => "?").join(",");
        const [rows] = await this.db().query(`SELECT * FROM products WHERE id IN (${marks})`, ids);
        const byId = new Map(rows.map((r) => [r.id, mapRow(r)]));
        return ids.map((id) => byId.get(id)).filter(Boolean);
    }

    async categories() {
        await this.ensureProductColumns().catch(() => {});
        const [rows] = await this.db().query(`SELECT DISTINCT category FROM products ORDER BY category`);
        return rows.map((r) => r.category).filter(Boolean);
    }

    async create(data) {
        const id = data.id || randomUUID();
        await this.db().query(
            `INSERT INTO products (id, name, image_url, description, price, category, rating, reviews_count, stock, badge)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, data.name, data.imageUrl || "", data.description || "", data.price,
             data.category || "Gadgets", data.rating ?? 4.5, data.reviewsCount ?? 0,
             data.stock ?? 50, data.badge || ""]
        );
        return this.findById(id);
    }

    async count() {
        const [rows] = await this.db().query(`SELECT COUNT(*) AS n FROM products`);
        return rows[0].n;
    }

    async seedIfEmpty(products) {
        const n = await this.count();
        if (n > 0) return n;
        for (const p of products) {
            await this.create(p).catch(() => {});
        }
        return products.length;
    }
}