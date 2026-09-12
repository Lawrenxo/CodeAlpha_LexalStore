import { createPool, Pool, PoolConnection } from "mysql2/promise";
import { env } from "../config.js";

export class BaseRepo {
    /** @type {Pool} */
    static #db = null;
    
    constructor() {
        if (!BaseRepo.#db) {
            BaseRepo.#db = createPool({
                host: env.DB_HOST,
                database: env.DB_NAME,
                user: env.DB_USER,
                password: env.DB_USER,
                waitForConnections: true,
                connectionLimit: 10
            })
        }
    }

    /**
     * @param {(con: PoolConnection) => Promise} work 
     */
    async transaction(work) {
        const con = await this.db().getConnection();
        try {
            await con.beginTransaction();
            const result = await work(con);
            con.commit();
            return result;
        } catch (error) {
            await con.rollback();
            throw error
        } finally {
            con.release();
        }
    }

    db() {
        return BaseRepo.#db;
    }
}

