"use client";

import { useEffect, useState } from "react";

import ChatInput from "@/components/chat/ChatInput/ChatInput";
import ChatWindow from "@/components/chat/ChatWindow/ChatWindow";
import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";

import { useChat } from "@/hooks/useChat";

import type { OllamaModel } from "@/types/ollama";

import styles from "./page.module.css";

export default function Home() {
    const [models, setModels] = useState<OllamaModel[]>([]);
    const [selectedModel, setSelectedModel] = useState("");

    const {
        messages,
        isLoading,
        sendMessage,
    } = useChat(selectedModel);

    useEffect(() => {
        async function loadModels() {
            try {
                const response = await fetch("/api/models");

                if (!response.ok) {
                    throw new Error("Failed to load models");
                }

                const data = await response.json();

                setModels(data.models);

                if (data.models.length > 0) {
                    setSelectedModel(data.models[0].name);
                }
            } catch (error) {
                console.error(error);
            }
        }

        loadModels();
    }, []);

    function handleNewChat() {
        // فعلاً فقط ظاهری
        console.log("New chat");
    }

    function handleSettings() {
        // فعلاً فقط ظاهری
        console.log("Settings");
    }

    return (
        <main className={styles.app}>
            <div className={styles.content}>
            <Header
                models={models}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                disabled={Boolean(isLoading)}
            />

                <ChatWindow messages={messages} />
                <ChatInput
                    onSend={sendMessage}
                    disabled={Boolean(isLoading || !selectedModel)}
                />
            </div>

            <Sidebar
                onNewChat={handleNewChat}
                onSettings={handleSettings}
            />
        </main>
    );
}