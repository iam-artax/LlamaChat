"use client";

import { useEffect, useState } from "react";

import ChatInput from "@/components/chat/ChatInput/ChatInput";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow";
import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";

import { useChat } from "@/hooks/useChat";
import { useChats } from "@/hooks/useChats";

import type { OllamaModel } from "@/types/ollama";

import styles from "./page.module.css";

export default function Home() {
    const [models, setModels] = useState<
        OllamaModel[]
    >([]);

    const [selectedModel, setSelectedModel] =
        useState("");

    const {
        messages,
        isLoading,
        chatId,
        sendMessage,
        newChat,
        loadChat,
    } = useChat(selectedModel);

    const {
        chats,
        databaseAvailable,
        renameChat,
        deleteChat,
        loadChats,
    } = useChats();

    useEffect(() => {
        async function loadModels() {
            try {
                const response = await fetch(
                    "/api/models",
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load models",
                    );
                }

                const data =
                    await response.json();

                const availableModels =
                    data.models ?? [];

                setModels(availableModels);

                if (
                    availableModels.length > 0
                ) {
                    setSelectedModel(
                        availableModels[0].name,
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load models:",
                    error,
                );
            }
        }

        loadModels();
    }, []);

    function handleNewChat() {
        if (isLoading) {
            return;
        }

        newChat();
    }

    async function handleSelectChat(
        selectedChatId: string,
    ) {
        if (isLoading) {
            return;
        }

        await loadChat(selectedChatId);
    }

    async function handleSendMessage(
        content: string,
    ) {
        await sendMessage(content);

        /*
         * sendMessage خودش chat را در DB می‌سازد
         * اگر این اولین پیام چت باشد.
         *
         * بعد از اتمام درخواست، Sidebar را
         * دوباره از DB می‌خوانیم تا چت جدید
         * بدون refresh نمایش داده شود.
         */
        await loadChats();
    }

    async function handleRenameChat(
        selectedChatId: string,
        title: string,
    ): Promise<boolean> {
        return await renameChat(
            selectedChatId,
            title,
        );
    }

    async function handleDeleteChat(
        selectedChatId: string,
    ): Promise<boolean> {
        if (isLoading) {
            return false;
        }

        const success = await deleteChat(
            selectedChatId,
        );

        if (!success) {
            return false;
        }

        /*
         * اگر چتی که حذف شد، چت فعال بود،
         * صفحه چت را به حالت New Chat برمی‌گردانیم.
         */
        if (chatId === selectedChatId) {
            newChat();
        }

        /*
         * Sidebar را بعد از Delete از DB
         * دوباره می‌خوانیم.
         */
        await loadChats();

        return true;
    }

    function handleSettings() {
        console.log("Settings");
    }

    return (
        <main className={styles.app}>
            <Sidebar
                chats={chats}
                databaseAvailable={
                    databaseAvailable
                }
                activeChatId={chatId}
                onNewChat={handleNewChat}
                onSettings={handleSettings}
                onSelectChat={
                    handleSelectChat
                }
                onRenameChat={
                    handleRenameChat
                }
                onDeleteChat={
                    handleDeleteChat
                }
            />

            <div className={styles.content}>
                <Header
                    models={models}
                    selectedModel={
                        selectedModel
                    }
                    onModelChange={
                        setSelectedModel
                    }
                    disabled={Boolean(
                        isLoading,
                    )}
                />

                <ChatWindow
                    messages={messages}
                />

                <ChatInput
                    onSend={
                        handleSendMessage
                    }
                    disabled={Boolean(
                        isLoading ||
                            !selectedModel,
                    )}
                />
            </div>
        </main>
    );
}