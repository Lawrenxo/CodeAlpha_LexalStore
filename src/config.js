import { z } from "zod";

const EnvSchema = z.object({
    PORT: z.int(),
    DB_HOST: z.string(),
    DB_NAME: z.string(),
    DB_USER: z.string(),
    DB_PASS: z.string()
});

/** @typedef {z.infer<typeof EnvSchema>} Env */


/** @type {Env} */
const devEnv = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS
};

/** @type {Env} */
const prodEnv = {
    PORT: 3000,
    DB_HOST: "",
    DB_NAME: "",
    DB_USER: "",
    DB_PASS: ""
};

/** @type {Env} */
export const env = process.env.NODE_ENV === "production" ? prodEnv : devEnv;
