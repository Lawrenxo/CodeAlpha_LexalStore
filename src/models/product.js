import { z } from "zod";

const productSchema = z.object({
    id: z.int(),
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    createdAt: z.date().optional()


});

