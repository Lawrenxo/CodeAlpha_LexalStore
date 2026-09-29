import { randomUUID } from "node:crypto";
import { BaseRepo } from "./base.js";

const SHIPPING_FEES = { Economy: 0, Standard: 4.99, Express: 9.99, Cargo: 14.99 };
const PROMOS = { TECH10: 0.10, WELCOME15: 0.15, SAVE20: 0.20 };

export function shippingFee(type) { return SHIPPING_FEES[type] ?? 4.99; }
export function promoDiscount(code) {
    if (!code) return 0;
    return PROMOS[String(code).toUpperCase().trim()] ?? 0;
}

function mapOrder(r) {
    return {
        id: r.id,
        userId: r.user_id,
        total: Number(r.total),
        status: r.status ?? "pending",
        shippingAddress: r.shipping_address ?? "",
        shippingType: r.shipping_type ?? "Standard",
        createdAt: r.created_at ? new Date(r.created_at) : undefined
    };
}

export class OrderRepo extends BaseRepo {
    /**
     * Create order + items in a transaction.
     * @param {{userId:string, items:{productId:string,quantity:number,price:number}[], shippingAddress:string, shippingType:string, promoCode:string}} input
     */
    async createOrder(input) {
        const orderId = randomUUID();
        const subtotal = input.items.reduce((s, it) => s + it.price * it.quantity, 0);
        const discount = subtotal * promoDiscount(input.promoCode);
        const fee = shippingFee(input.shippingType);
        const total = Math.max(0, subtotal - discount + fee);

        await this.transaction(async (con) => {
            await con.query(
                `INSERT INTO orders (id, user_id, total, status, shipping_address, shipping_type) VALUES (?, ?, ?, 'pending', ?, ?)`,
                [orderId, input.userId, total.toFixed(2), input.shippingAddress, input.shippingType]
            );
            for (const it of input.items) {
                await con.query(
                    `INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)`,
                    [randomUUID(), orderId, it.productId, it.quantity, it.price]
                );
            }
        });
        return this.findById(orderId);
    }

    async findById(id) {
        const [rows] = await this.db().query(`SELECT * FROM orders WHERE id = ? LIMIT 1`, [id]);
        if (!rows.length) return null;
        const order = mapOrder(rows[0]);
        const [items] = await this.db().query(
            `SELECT oi.*, p.name, p.image_url FROM order_items oi LEFT JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`,
            [id]
        );
        return {
            ...order,
            items: items.map((r) => ({
                id: r.id, productId: r.product_id, quantity: r.quantity,
                price: Number(r.price), name: r.name ?? "Product", imageUrl: r.image_url ?? ""
            }))
        };
    }

    async listByUser(userId, limit = 20) {
        const n = Math.min(100, Math.max(1, Number(limit) || 20));
        const [rows] = await this.db().query(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ${n}`,
            [userId]
        );
        return rows.map(mapOrder);
    }

    async updateStatus(id, status) {
        await this.db().query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
        return this.findById(id);
    }
}