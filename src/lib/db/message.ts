import { getDatabase } from "@/lib/db/client";

export async function createMessage(
    chatId: string,
    role: "user" | "assistant",
    content: string,
) {
    const db = await getDatabase();

    const [result] = await db.query(
        `
        CREATE message SET
            chat = type::record($chatId),
            role = $role,
            content = $content,
            created_at = time::now();

        UPDATE type::record($chatId) SET
            updated_at = time::now();
        `,
        {
            chatId,
            role,
            content,
        },
    );

    return result;
}

export async function getMessages(chatId: string) {
    const db = await getDatabase();

    const [result] = await db.query(
        `
        SELECT
            id,
            role,
            content,
            created_at
        FROM message
        WHERE chat = type::record($chatId)
        ORDER BY created_at ASC;
        `,
        {
            chatId,
        },
    );

    return result;
}