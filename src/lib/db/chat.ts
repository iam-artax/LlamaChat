import { getDatabase } from "@/lib/db/client";

export async function createChat(
    title: string,
    model: string,
) {
    const db = await getDatabase();

    const [result] = await db.query(
        `
        CREATE chat SET
            title = $title,
            model = $model,
            created_at = time::now(),
            updated_at = time::now();
        `,
        {
            title,
            model,
        },
    );

    return result;
}

export async function getChats() {
    const db = await getDatabase();

    const [result] = await db.query(
        `
        SELECT
            id,
            title,
            model,
            created_at,
            updated_at
        FROM chat
        ORDER BY updated_at DESC;
        `,
    );

    return result;
}

export async function getChat(chatId: string) {
    const db = await getDatabase();

    const result = await db.query<
        Array<{
            id: string;
            title: string;
            model: string;
            created_at: string;
            updated_at: string;
        }>
    >(
        `
        SELECT *
        FROM type::record($chatId);
        `,
        {
            chatId,
        },
    );

    return result[0];
}

export async function renameChat(
    chatId: string,
    title: string,
) {
    const db = await getDatabase();

    const [result] = await db.query(
        `
        UPDATE type::record($chatId) SET
            title = $title,
            updated_at = time::now();
        `,
        {
            chatId,
            title,
        },
    );

    return result;
}

export async function deleteChat(chatId: string) {
    const db = await getDatabase();

    await db.query(
        `
        DELETE message
        WHERE chat = type::record($chatId);

        DELETE type::record($chatId);
        `,
        {
            chatId,
        },
    );
}