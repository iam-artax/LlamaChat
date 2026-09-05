"use client";

import { useState } from "react";

import {
    loadSettings,
} from "@/lib/settings";

import type { Message } from "@/types/chat";

type ChatErrorResponse = {
    success?: boolean;
    error?: string;
    code?: string;
};

export function useChat(model: string) {
    const [messages, setMessages] = useState<
        Message[]
    >([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [chatId, setChatId] = useState<
        string | null
    >(null);

    const [error, setError] = useState<
        string | null
    >(null);

    async function loadChat(id: string) {
        if (isLoading) {
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/chat/${id}`,
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load chat",
                );
            }

            const data = await response.json();

            setMessages(data.messages ?? []);
            setChatId(id);
        } catch (error) {
            console.error(
                "Failed to load chat:",
                error,
            );

            setError(
                "Unable to load this conversation.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function sendMessage(content: string) {
        const trimmedContent = content.trim();

        if (!trimmedContent || isLoading) {
            return;
        }

        setError(null);

        const settings = loadSettings();

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: trimmedContent,
        };

        setMessages((currentMessages) => [
            ...currentMessages,
            userMessage,
        ]);

        setIsLoading(true);

        try {
            const response = await fetch(
                "/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        chatId,
                        model,
                        ollamaPort:
                            settings.ollamaPort,
                        contextLength:
                            settings.contextLength,
                        messages: [
                            ...messages.map(
                                ({
                                    role,
                                    content,
                                }) => ({
                                    role,
                                    content,
                                }),
                            ),
                            {
                                role: "user",
                                content:
                                    trimmedContent,
                            },
                        ],
                    }),
                },
            );

            if (!response.ok) {
                let errorData:
                    ChatErrorResponse = {};

                try {
                    errorData =
                        await response.json();
                } catch {
                    // Ignore invalid error responses.
                }

                throw new Error(
                    errorData.error ||
                        "Something went wrong while communicating with Ollama.",
                );
            }

            if (!response.body) {
                throw new Error(
                    "Ollama returned an empty response.",
                );
            }

            const assistantMessageId =
                crypto.randomUUID();

            setMessages(
                (currentMessages) => [
                    ...currentMessages,
                    {
                        id: assistantMessageId,
                        role: "assistant",
                        content: "",
                    },
                ],
            );

            const reader =
                response.body.getReader();

            const decoder =
                new TextDecoder();

            let buffer = "";

            while (true) {
                const {
                    value,
                    done,
                } = await reader.read();

                if (done) {
                    break;
                }

                buffer += decoder.decode(
                    value,
                    {
                        stream: true,
                    },
                );

                const lines =
                    buffer.split("\n");

                buffer =
                    lines.pop() ?? "";

                for (const line of lines) {
                    if (!line.trim()) {
                        continue;
                    }

                    const data =
                        JSON.parse(line);

                    if (
                        data.type === "chat" &&
                        data.chatId
                    ) {
                        setChatId(
                            data.chatId,
                        );

                        continue;
                    }

                    if (
                        data.type === "token"
                    ) {
                        const token =
                            data.content ?? "";

                        if (!token) {
                            continue;
                        }

                        setMessages(
                            (
                                currentMessages,
                            ) =>
                                currentMessages.map(
                                    (
                                        currentMessage,
                                    ) =>
                                        currentMessage.id ===
                                        assistantMessageId
                                            ? {
                                                  ...currentMessage,
                                                  content:
                                                      currentMessage.content +
                                                      token,
                                              }
                                            : currentMessage,
                                ),
                        );
                    }
                }
            }
        } catch (error) {
            console.error(
                "Failed to send message:",
                error,
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong while communicating with Ollama.";

            setError(message);

            setMessages(
                (currentMessages) =>
                    currentMessages.filter(
                        (message) =>
                            !(
                                message.role ===
                                    "assistant" &&
                                message.content ===
                                    ""
                            ),
                    ),
            );
        } finally {
            setIsLoading(false);
        }
    }

    function newChat(
        id: string | null = null,
    ) {
        setMessages([]);
        setChatId(id);
        setError(null);
    }

    return {
        messages,
        isLoading,
        chatId,
        error,
        sendMessage,
        newChat,
        loadChat,
    };
}