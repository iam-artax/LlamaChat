import { readFile } from "node:fs/promises";
import path from "node:path";
import { Surreal } from "surrealdb";
import { createNodeEngines } from "@surrealdb/node";

const db = new Surreal({
    engines: {
        ...createNodeEngines(),
    },
});

let initializationPromise: Promise<Surreal> | null = null;

async function initializeDatabase() {
    await db.connect("surrealkv://./data");

    await db.use({
        namespace: "llama_chat",
        database: "llama_chat",
    });

    const schemaPath = path.join(
        process.cwd(),
        "database",
        "schema.surql",
    );

    const schema = await readFile(schemaPath, "utf8");

    await db.query(schema);

    return db;
}

export async function getDatabase() {
    if (!initializationPromise) {
        initializationPromise = initializeDatabase().catch((error) => {
            initializationPromise = null;
            throw error;
        });
    }

    return initializationPromise;
}