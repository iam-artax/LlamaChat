import { useState } from "react";

import type { Message } from "@/types/chat";

export function useChat(model: string) {
    const [messages, setMessages] = useState<
        Message[]
    >([]);

    const [isLoading, setIsLoading] =
        useState(false);

    const [chatId, setChatId] = useState<
        string | null
    >(null);

    async function sendMessage(content: string) {
        const trimmedContent = content.trim();

        if (!trimmedContent || isLoading) {
            return;
        }

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
                throw new Error(
                    "Failed to send message",
                );
            }

            if (!response.body) {
                throw new Error(
                    "Response body is empty",
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
            console.error(error);

            // Remove empty assistant message
            // if the request failed.
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

    function newChat() {
        setMessages([]);
        setChatId(null);
    }

  return {
      messages,
      isLoading,
      chatId,
      sendMessage,
      newChat,
  };
}