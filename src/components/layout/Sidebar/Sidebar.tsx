"use client";

import { useEffect, useState } from "react";

import ButtonIcon from "@/components/shared/ButtonIcon/ButtonIcon";

import type { Chat } from "@/types/chat";

import styles from "./Sidebar.module.css";

type SidebarProps = {
    databaseAvailable: boolean;
    onNewChat: () => void;
    onSettings: () => void;
};

export default function Sidebar({
    databaseAvailable,
    onNewChat,
    onSettings,
}: SidebarProps) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] =
        useState(false);

    useEffect(() => {
        if (!databaseAvailable) {
            setChats([]);
            return;
        }

        async function loadChats() {
            try {
                setIsLoading(true);

                const response = await fetch(
                    "/api/chats",
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load chats",
                    );
                }

                const data =
                    await response.json();

                setChats(data.chats ?? []);
            } catch (error) {
                console.error(
                    "Failed to load chats:",
                    error,
                );
            } finally {
                setIsLoading(false);
            }
        }

        loadChats();
    }, [databaseAvailable]);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h1>Ollama Chat</h1>
            </div>

            <div className={styles.chatList}>
                {!databaseAvailable ? (
                    <p
                        className={
                            styles.databaseMessage
                        }
                    >
                        Database is not configured.
                        <br />
                        Set it up in Settings.
                    </p>
                ) : isLoading ? (
                    <p
                        className={
                            styles.emptyMessage
                        }
                    >
                        Loading chats...
                    </p>
                ) : chats.length === 0 ? (
                    <p
                        className={
                            styles.emptyMessage
                        }
                    >
                        No conversations yet.
                    </p>
                ) : (
                    chats.map((chat) => (
                        <button
                            key={chat.id}
                            type="button"
                            className={
                                styles.chatItem
                            }
                        >
                            <i className="bx bx-message-rounded" />

                            <span>
                                {chat.title}
                            </span>
                        </button>
                    ))
                )}
            </div>

            <div className={styles.footer}>
                <ButtonIcon
                    iconName="bx-cog"
                    onClick={onSettings}
                />

                <ButtonIcon
                    iconName="bx-plus"
                    text="New Chat"
                    onClick={onNewChat}
                />
            </div>
        </aside>
    );
}