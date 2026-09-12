import { z } from "zod";

export const OrderSchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    total: z.float32(),
    statusPending: z.string(),
    createdAt: z.date.optional()
});

export const OrderItemSchema = z.object({
    id: z.uuid(),
    orderId: z.uuid(),
    productId: z.uuid(),
    quantity: z.int(),
    price: z.float32()
});
