import { z } from "zod";

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    imageUrl: z.string().default(""),
    description: z.string().optional().default(""),
    price: z.coerce.number().nonnegative(),
    category: z.string().default("Gadgets"),
    rating: z.coerce.number().min(0).max(5).default(4.5),
    reviewsCount: z.coerce.number().int().nonnegative().default(0),
    stock: z.coerce.number().int().nonnegative().default(50),
    badge: z.string().optional().default(""),
    createdAt: z.coerce.date().optional()
});

export const ProductCreateSchema = ProductSchema.omit({ id: true, createdAt: true });

/**
 * @typedef {z.infer<typeof ProductSchema>} Product
 */

