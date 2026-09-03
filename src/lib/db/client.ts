import { Surreal } from "surrealdb";
import { createNodeEngines } from "@surrealdb/node";

const db = new Surreal({
    engines: {
        ...createNodeEngines(),
    },
});

let initialized = false;

export async function getDatabase() {
    if (initialized) {
        return db;
    }

    await db.connect("surrealkv://./data");

    await db.use({
        namespace: "llama_chat",
        database: "llama_chat",
    });

    initialized = true;

    return db;
}