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
    password: z.string().min(6)
});

export const UserSignupCredSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.email(),
    password: z.string().min(6).max(100)
});

/**
 * @typedef {z.infer<typeof UserSchema>} User
 */
