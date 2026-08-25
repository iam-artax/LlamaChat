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
    const [isLoading, setIsLoading] = useState(true);
    const [databaseAvailable, setDatabaseAvailable] = useState(true);

    useEffect(() => {
        async function loadChats() {
            try {
                const response = await fetch("/api/chats");

                if (!response.ok) {
                    throw new Error("Database unavailable");
                }

                const data = await response.json();

                setChats(data.chats ?? []);
                setDatabaseAvailable(true);
            } catch (error) {
                console.error(error);
                setDatabaseAvailable(false);
            } finally {
                setIsLoading(false);
            }
        }

        loadChats();
    }, []);

    return {
        chats,
        isLoading,
        databaseAvailable,
    };
}