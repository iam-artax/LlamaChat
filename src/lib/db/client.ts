import { Surreal } from "surrealdb";

const db = new Surreal();

let connected = false;

export async function getDatabase() {
    if (connected) {
        return db;
    }

    const url = process.env.SURREALDB_URL;
    const namespace = process.env.SURREALDB_NAMESPACE;
    const database = process.env.SURREALDB_DATABASE;
    const username = process.env.SURREALDB_USERNAME;
    const password = process.env.SURREALDB_PASSWORD;

    if (
        !url ||
        !namespace ||
        !database ||
        !username ||
        !password
    ) {
        throw new Error(
            "SurrealDB environment variables are not configured.",
        );
    }

    await db.connect(url);

    await db.signin({
        username,
        password,
    });

    await db.use({
        namespace,
        database,
    });

    connected = true;

    return db;
}