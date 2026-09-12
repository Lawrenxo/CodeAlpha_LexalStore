import { z } from "zod";
import { BaseRepo } from "./base.js";
import { UserSchema, UserSigninCredSchema, UserSignupCredSchema } from "../models/user.js";

/** 
 * @typedef {z.infer<typeof UserSchema>} User
 * @typedef {z.infer<typeof UserSigninCredSchema>} UserSigninCred
 * @typedef {z.infer<typeof UserSignupCredSchema>} UserSignupCred
 */

export class UserRepo extends BaseRepo {

    /**
     * @param {UserSignupCred} cred
     * @returns {Promise<User>}
     */
    async create(cred) {
        const validCred = UserSignupCredSchema.parse(cred);
        const { email, username } = validCred;
        const id = "";
        const passwordHash = ""; // TODO: Hash the password before storing it
        const createdAt = new Date();

        await this.transaction((c) => {
            c.execute(`INSERT INTO users (id, username, email, password_hash, created_at) VALUES (?, ?, ?, ?)`,
                [id, username, email, passwordHash, createdAt]
            );
        });

        return { id, username, email, passwordHash, createdAt };
    }

    /**
     * @param {string} id
     * @returns {Promise<User | null>}
     */
    async findById(id) {
        const result = await this.transaction((c) => {
            return c.execute(`SELECT * FROM users WHERE id = ?`, [id]);
        });

        if (result.length === 0) {
            return null;
        }

        const user = result[0];
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            passwordHash: user.password_hash,
            createdAt: user.created_at
        };
    }

    /**
     * @param {UserSigninCred} cred
     * @returns {Promise<User | null>}
     */
    async signin(cred) {
        const validCred = UserSigninCredSchema.parse(cred);
        const { email } = validCred;
        const passwordHash = "";

        const result = await this.transaction((c) => {
            return c.execute(`SELECT * FROM users WHERE email = ? AND password_hash = ?`, [email, passwordHash]);
        });

        if (result.length === 0) {
            return null;
        }

        const user = result[0];
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            passwordHash: user.password_hash,
            createdAt: user.created_at
        };
    }

    /**
     * @param {UserSignupCred} cred
     * @returns {Promise<User>}
     */
    async signup(cred) {
        return await create(cred);
    }
}
