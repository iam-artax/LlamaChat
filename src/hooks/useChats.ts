"use client";

import { useEffect, useState } from "react";

export type Chat = {
    id: string;
    title: string;
    model: string;
    created_at: string;
    updated_at: string;
};

export function useChats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] =
        useState(true);
    const [databaseAvailable, setDatabaseAvailable] =
        useState(true);

    async function loadChats() {
        try {
            setIsLoading(true);

            const response = await fetch(
                "/api/chats",
            );

            if (!response.ok) {
                throw new Error(
                    "Database unavailable",
                );
            }

            const data = await response.json();

            setChats(
                Array.isArray(data.chats)
                    ? data.chats
                    : [],
            );

            setDatabaseAvailable(true);
        } catch (error) {
            console.error(
                "Failed to load chats:",
                error,
            );

            setDatabaseAvailable(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadChats();
    }, []);

    async function renameChat(
        chatId: string,
        title: string,
    ): Promise<boolean> {
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            return false;
        }

        try {
            const response = await fetch(
                `/api/chat/${encodeURIComponent(chatId)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        title: trimmedTitle,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to rename chat",
                );
            }

            await loadChats();

            return true;
        } catch (error) {
            console.error(
                "Failed to rename chat:",
                error,
            );

            return false;
        }
    }

    async function deleteChat(
        chatId: string,
    ): Promise<boolean> {
        try {
            const response = await fetch(
                `/api/chat/${encodeURIComponent(chatId)}`,
                {
                    method: "DELETE",
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to delete chat",
                );
            }

            return true;
        } catch (error) {
            console.error(
                "Failed to delete chat:",
                error,
            );

            return false;
        }
    }

    return {
        chats,
        isLoading,
        databaseAvailable,
        renameChat,
        deleteChat,
        loadChats,
    };
}