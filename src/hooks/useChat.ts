import { useState } from "react";

import type { Message } from "@/types/chat";

export function useChat(model: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            ...messages.map(({ role, content }) => ({
              role,
              content,
            })),
            {
              role: "user",
              content: trimmedContent,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const assistantMessageId = crypto.randomUUID();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
        },
      ]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        const lines = buffer.split("\n");

        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const data = JSON.parse(line);
          const token = data.message?.content ?? "";

          if (!token) {
            continue;
          }

          setMessages((currentMessages) =>
            currentMessages.map((currentMessage) =>
              currentMessage.id === assistantMessageId
                ? {
                    ...currentMessage,
                    content: currentMessage.content + token,
                  }
                : currentMessage,
            ),
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function newChat() {
      setMessages([]);
  }

  return {
    messages,
    isLoading,
    sendMessage,
    newChat,
  };
}