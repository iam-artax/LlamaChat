"use client";

import { useEffect, useState } from "react";

import ChatInput from "@/components/chat/ChatInput/ChatInput";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow";
import Header from "@/components/layout/Header/Header";
import SettingsPanel from "@/components/layout/SettingsPanel/SettingsPanel";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { loadSettings } from "@/lib/settings";
import { useChat } from "@/hooks/useChat";
import { useChats } from "@/hooks/useChats";

import type { OllamaModel } from "@/types/ollama";

import styles from "./page.module.css";

export default function Home() {
    const [models, setModels] = useState<
        OllamaModel[]
    >([]);

    useEffect(() => {
        const settings = loadSettings();

        document.documentElement.dataset.theme =
            settings.theme;
    }, []);

    const [selectedModel, setSelectedModel] =
        useState("");

    const [isSettingsOpen, setIsSettingsOpen] =
        useState(false);

    const {
        messages,
        isLoading,
        chatId,
        error,
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

        if (chatId === selectedChatId) {
            newChat();
        }

        await loadChats();

        return true;
    }

    function handleSettings() {
        setIsSettingsOpen(true);
    }

    function handleCloseSettings() {
        setIsSettingsOpen(false);
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
                    error={error}
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

                {isSettingsOpen && (
                    <SettingsPanel
                        onClose={
                            handleCloseSettings
                        }
                    />
                )}
            </div>
        </main>
    );
}