import { z } from "zod";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { BaseRepo } from "./base.js";
import { UserSchema, UserSigninCredSchema, UserSignupCredSchema } from "../models/user.js";

/**
 * @typedef {z.infer<typeof UserSchema>} User
 * @typedef {z.infer<typeof UserSigninCredSchema>} UserSigninCred
 * @typedef {z.infer<typeof UserSignupCredSchema>} UserSignupCred
 */

export function hashPassword(password) {
    const salt = randomUUID().replace(/-/g, "").slice(0, 32);
    const hash = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
    try {
        const [salt, hash] = String(stored).split(":");
        if (!salt || !hash) return false;
        const derived = scryptSync(password, salt, 64);
        const expected = Buffer.from(hash, "hex");
        if (derived.length !== expected.length) return false;
        return timingSafeEqual(derived, expected);
    } catch {
        return false;
    }
}

function mapUser(u) {
    if (!u) return null;
    return {
        id: u.id,
        username: u.username,
        email: u.email,
        passwordHash: u.password_hash,
        createdAt: u.created_at ? new Date(u.created_at) : undefined
    };
}

export class UserRepo extends BaseRepo {
    /**
     * @param {UserSignupCred} cred
     * @returns {Promise<User>}
     */
    async create(cred) {
        const valid = UserSignupCredSchema.parse(cred);
        const id = randomUUID();
        const passwordHash = hashPassword(valid.password);
        await this.db().query(
            `INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)`,
            [id, valid.username, valid.email, passwordHash]
        );
        const user = await this.findById(id);
        return user;
    }

    /** @param {string} id */
    async findById(id) {
        const [rows] = await this.db().query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
        return rows.length ? mapUser(rows[0]) : null;
    }

    /** @param {string} email */
    async findByEmail(email) {
        const [rows] = await this.db().query(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
        return rows.length ? mapUser(rows[0]) : null;
    }

    /** Verify email+password, return user or null. */
    async verifySignin(email, password) {
        const user = await this.findByEmail(email);
        if (!user) return null;
        if (!verifyPassword(password, user.passwordHash)) return null;
        return user;
    }

    // Back-compat wrappers
    async signup(cred) { return this.create(cred); }
    async signin(cred) {
        const valid = UserSigninCredSchema.parse(cred);
        return this.verifySignin(valid.email, valid.password);
    }
}
