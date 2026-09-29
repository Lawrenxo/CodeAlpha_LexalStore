import { z } from "zod";

const EnvSchema = z.object({
    PORT: z.coerce.number().int().default(3000),
    DB_HOST: z.string().default("localhost"),
    DB_NAME: z.string().default("lexal_store"),
    DB_USER: z.string().default("root"),
    DB_PASS: z.string().default(""),
    SESSION_SECRET: z.string().default("lexal-dev-secret-change-me")
});

/** @typedef {z.infer<typeof EnvSchema>} Env */

const raw = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    SESSION_SECRET: process.env.SESSION_SECRET
};

// Remove undefined so defaults apply; strip surrounding quotes from .env values
for (const k of Object.keys(raw)) {
    if (raw[k] === undefined || raw[k] === "") delete raw[k];
    else if (typeof raw[k] === "string") raw[k] = raw[k].replace(/^["']|["']$/g, "");
}

const parsed = EnvSchema.safeParse(raw);

/** @type {Env} */
export const env = parsed.success ? parsed.data : {
    PORT: 3000,
    DB_HOST: "localhost",
    DB_NAME: "lexal_store",
    DB_USER: "root",
    DB_PASS: "",
    SESSION_SECRET: "lexal-dev-secret-change-me"
};

if (!parsed.success) {
    console.warn("Invalid env, using defaults:", parsed.error.issues);
}
