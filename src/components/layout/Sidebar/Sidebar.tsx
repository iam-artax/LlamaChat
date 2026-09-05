"use client";

import { useEffect, useRef, useState } from "react";

import ButtonIcon from "@/components/shared/ButtonIcon/ButtonIcon";

import type { Chat } from "@/types/chat";

import styles from "./Sidebar.module.css";

type SidebarProps = {
    chats: Chat[];
    databaseAvailable: boolean;
    activeChatId: string | null;
    onNewChat: () => void;
    onSettings: () => void;
    onSelectChat: (chatId: string) => void;
    onRenameChat: (
        chatId: string,
        title: string,
    ) => Promise<boolean>;
    onDeleteChat: (
        chatId: string,
    ) => Promise<boolean>;
};

export default function Sidebar({
    chats,
    databaseAvailable,
    activeChatId,
    onNewChat,
    onSettings,
    onSelectChat,
    onRenameChat,
    onDeleteChat,
}: SidebarProps) {
    const sidebarRef =
        useRef<HTMLElement>(null);

    const [openMenuId, setOpenMenuId] =
        useState<string | null>(null);

    const [editingChatId, setEditingChatId] =
        useState<string | null>(null);

    const [editingTitle, setEditingTitle] =
        useState("");

    const [isEditing, setIsEditing] =
        useState(false);

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent,
        ) {
            const target = event.target;

            if (!(target instanceof Node)) {
                return;
            }

            if (
                !sidebarRef.current?.contains(
                    target,
                )
            ) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside,
            );
        };
    }, []);

    function startRename(chat: Chat) {
        setOpenMenuId(null);

        setEditingChatId(chat.id);
        setEditingTitle(chat.title);
    }

    function cancelRename() {
        setEditingChatId(null);
        setEditingTitle("");
    }

    async function handleRename(
        chatId: string,
    ) {
        const title = editingTitle.trim();

        if (!title || isEditing) {
            return;
        }

        setIsEditing(true);

        const success =
            await onRenameChat(
                chatId,
                title,
            );

        setIsEditing(false);

        if (success) {
            cancelRename();
        }
    }

    async function handleDelete(
        chatId: string,
    ) {
        setOpenMenuId(null);

        await onDeleteChat(chatId);
    }

    function handleNewChat() {
        setOpenMenuId(null);
        onNewChat();
    }

    function handleSettings() {
        setOpenMenuId(null);
        onSettings();
    }

    return (
        <aside
            ref={sidebarRef}
            className={styles.sidebar}
        >
            <div className={styles.header}>
                <img
                    src="/logo.webp"
                    alt="Llama Chat"
                />

                <h1>Llama Chat</h1>
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
                ) : chats.length === 0 ? (
                    <p
                        className={
                            styles.emptyMessage
                        }
                    >
                        No conversations yet.
                    </p>
                ) : (
                    chats.map((chat) => {
                        const isEditingChat =
                            editingChatId ===
                            chat.id;

                        const isMenuOpen =
                            openMenuId ===
                            chat.id;

                        return (
                            <div
                                key={chat.id}
                                className={
                                    styles.chatItemWrapper
                                }
                            >
                                {isEditingChat ? (
                                    <div
                                        className={
                                            styles.renameContainer
                                        }
                                    >
                                        <input
                                            value={
                                                editingTitle
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                setEditingTitle(
                                                    event
                                                        .target
                                                        .value,
                                                )
                                            }
                                            onKeyDown={(
                                                event,
                                            ) => {
                                                if (
                                                    event.key ===
                                                    "Enter"
                                                ) {
                                                    event.preventDefault();

                                                    handleRename(
                                                        chat.id,
                                                    );
                                                }

                                                if (
                                                    event.key ===
                                                    "Escape"
                                                ) {
                                                    cancelRename();
                                                }
                                            }}
                                            autoFocus
                                            disabled={
                                                isEditing
                                            }
                                        />

                                        <button
                                            type="button"
                                            className={
                                                styles.actionButton
                                            }
                                            onClick={() =>
                                                handleRename(
                                                    chat.id,
                                                )
                                            }
                                            disabled={
                                                isEditing
                                            }
                                        >
                                            <i className="bx bx-check" />
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                styles.actionButton
                                            }
                                            onClick={
                                                cancelRename
                                            }
                                            disabled={
                                                isEditing
                                            }
                                        >
                                            <i className="bx bx-x" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className={`${styles.chatItem} ${
                                                activeChatId ===
                                                chat.id
                                                    ? styles.activeChatItem
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                setOpenMenuId(
                                                    null,
                                                );

                                                onSelectChat(
                                                    chat.id,
                                                );
                                            }}
                                        >
                                            <i className="bx bx-message-rounded" />

                                            <span>
                                                {
                                                    chat.title
                                                }
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                styles.menuButton
                                            }
                                            onClick={(
                                                event,
                                            ) => {
                                                event.stopPropagation();

                                                setOpenMenuId(
                                                    isMenuOpen
                                                        ? null
                                                        : chat.id,
                                                );
                                            }}
                                        >
                                            <i className="bx bx-dots-vertical-rounded" />
                                        </button>

                                        {isMenuOpen && (
                                            <div
                                                className={
                                                    styles.chatMenu
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        startRename(
                                                            chat,
                                                        )
                                                    }
                                                >
                                                    <i className="bx bx-edit" />

                                                    <span>
                                                        Rename
                                                    </span>
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        styles.deleteAction
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            chat.id,
                                                        )
                                                    }
                                                >
                                                    <i className="bx bx-trash" />

                                                    <span>
                                                        Delete
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className={styles.footer}>
                <ButtonIcon
                    iconName="bx-cog"
                    onClick={handleSettings}
                />

                <ButtonIcon
                    iconName="bx-plus"
                    text="New Chat"
                    onClick={handleNewChat}
                />
            </div>
        </aside>
    );
}