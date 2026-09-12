import { z } from "zod";

export const UserSchema = z.object({
    id: z.uuid(),
    username: z.string(),
    email: z.email(),
    passwordHash: z.string().optional(),
    createdAt: z.date().optional()
});

export const UserSigninCredSchema = z.object({
    email: z.email(),
    passwordHash: z.string()
});

export const UserSignupCredSchema = z.object({
    username: z.string(),
    email: z.email(),
    passwordHash: z.string()
});

/**
 * @typedef {z.infer<typeof UserSchema>} User
 */
