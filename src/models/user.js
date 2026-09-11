import { z } from "zod";

const UserSchema = z.object({
    id: z.int(),
    username: z.string(),
    email: z.email(),
    passwordHash: z.string().optional(),
    createdAt: z.date().optional()
});

/**
 * @typedef {z.infer<typeof UserSchema>} User
 */
