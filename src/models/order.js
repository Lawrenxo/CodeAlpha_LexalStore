import { z } from "zod";

export const OrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    total: z.coerce.number().nonnegative(),
    status: z.string().default("pending"),
    shippingAddress: z.string().optional().default(""),
    shippingType: z.string().optional().default("Standard"),
    createdAt: z.coerce.date().optional()
});

export const OrderItemSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    productId: z.string(),
    quantity: z.coerce.number().int().positive(),
    price: z.coerce.number().nonnegative()
});

export const CheckoutSchema = z.object({
    items: z.array(z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().positive().max(99)
    })).min(1),
    shippingAddress: z.string().min(3).max(500),
    shippingType: z.enum(["Economy", "Standard", "Express", "Cargo"]).default("Standard"),
    promoCode: z.string().optional().default("")
});

/**
 * @typedef {z.infer<typeof OrderSchema>} Order
 * @typedef {z.infer<typeof OrderItemSchema>} OrderItem
 */
