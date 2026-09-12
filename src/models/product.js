import { z } from "zod";

export const ProductSchema = z.object({
    id: z.uuid(),
    name: z.string(),
    imageUrl: z.string(),
    description: z.string().optional(),
    price: z.number(),
    createdAt: z.date().optional()
});

