import { z } from "zod";

const orderSchema = z.object({
    id: z.int(),
    userId: z.int(),
    total: z.float32(),
    statusPending: z.string(),
    createdAt: z.date.optional()
});

const orderItems = z.object({
    id: z.int(),
    orderId: z.int(),
    productId: z.int(),
    quantity: z.int(),
    price: z.float32()
});