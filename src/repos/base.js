import { createPool } from "mysql2/promise";
import { env } from "../config.js";

export class BaseRepo {
    /** @type {Pool} */
    static #db = null;

    constructor() {
        if (!BaseRepo.#db) {
            BaseRepo.#db = createPool({
                host: env.DB_HOST,
                database: env.DB_NAME,
                user: env.DB_USER,
                password: env.DB_PASS,
                waitForConnections: true,
                connectionLimit: 10
            });
        }
    }

    /**
     * @param {(con: PoolConnection) => Promise<any>} work
     */
    async transaction(work) {
        const con = await this.db().getConnection();
        try {
            await con.beginTransaction();
            const result = await work(con);
            await con.commit();
            return result;
        } catch (error) {
            try { await con.rollback(); } catch {}
            throw error;
        } finally {
            con.release();
        }
    }

    /** @returns {Pool} */
    db() {
        return BaseRepo.#db;
    }

    /** Ensure extra product columns exist (idempotent migration). */
    async ensureProductColumns() {
        const con = await this.db().getConnection();
        try {
            const [cols] = await con.query(`SHOW COLUMNS FROM products`);
            const names = new Set(cols.map((c) => c.Field));
            const alters = [];
            if (!names.has("category")) alters.push(`ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'Gadgets'`);
            if (!names.has("rating")) alters.push(`ADD COLUMN rating DECIMAL(2,1) NOT NULL DEFAULT 4.5`);
            if (!names.has("reviews_count")) alters.push(`ADD COLUMN reviews_count INT NOT NULL DEFAULT 0`);
            if (!names.has("stock")) alters.push(`ADD COLUMN stock INT NOT NULL DEFAULT 50`);
            if (!names.has("badge")) alters.push(`ADD COLUMN badge VARCHAR(30) NOT NULL DEFAULT ''`);
            if (!names.has("reviews_count") || !names.has("category")) {
                // also ensure orders has shipping columns
            }
            for (const a of alters) {
                await con.query(`ALTER TABLE products ${a}`);
            }
            const [ocols] = await con.query(`SHOW COLUMNS FROM orders`);
            const onames = new Set(ocols.map((c) => c.Field));
            if (!onames.has("shipping_address")) {
                await con.query(`ALTER TABLE orders ADD COLUMN shipping_address VARCHAR(500) NOT NULL DEFAULT ''`);
            }
            if (!onames.has("shipping_type")) {
                await con.query(`ALTER TABLE orders ADD COLUMN shipping_type VARCHAR(20) NOT NULL DEFAULT 'Standard'`);
            }
        } finally {
            con.release();
        }
    }
}

