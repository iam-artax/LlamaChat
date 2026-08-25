import { NextResponse } from "next/server";

import { createChat } from "@/lib/db/chat";
import { createMessage } from "@/lib/db/message";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const chatId =
            typeof body.chatId === "string" &&
            body.chatId.trim()
                ? body.chatId.trim()
                : null;

        const model =
            typeof body.model === "string"
                ? body.model.trim()
                : "";

        const messages = Array.isArray(body.messages)
            ? body.messages
            : [];

        if (!model) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Model is required",
                },
                {
                    status: 400,
                },
            );
        }

        if (messages.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Messages are required",
                },
                {
                    status: 400,
                },
            );
        }

        const lastMessage = messages[messages.length - 1];

        if (
            !lastMessage ||
            lastMessage.role !== "user" ||
            typeof lastMessage.content !== "string" ||
            !lastMessage.content.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "A valid user message is required",
                },
                {
                    status: 400,
                },
            );
        }

        const userContent = lastMessage.content.trim();

        let currentChatId = chatId;

        // Create a chat only when the first message is sent.
        if (!currentChatId) {
            const title = userContent.slice(0, 10);

            const chat = await createChat(
                title,
                model,
            );

            const createdChat = Array.isArray(chat)
                ? chat[0]
                : chat;

            if (!createdChat?.id) {
                throw new Error(
                    "Failed to create chat",
                );
            }

            currentChatId = String(
                createdChat.id,
            );
        }

        // Save user message.
        await createMessage(
            currentChatId,
            "user",
            userContent,
        );

        const ollamaResponse = await fetch(
            "http://localhost:11434/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model,
                    messages,
                    stream: true,
                }),
            },
        );

        if (!ollamaResponse.ok) {
            const errorText =
                await ollamaResponse.text();

            console.error(
                "Ollama request failed:",
                errorText,
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Ollama request failed",
                },
                {
                    status: ollamaResponse.status,
                },
            );
        }

        if (!ollamaResponse.body) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Ollama response body is empty",
                },
                {
                    status: 500,
                },
            );
        }

        const reader =
            ollamaResponse.body.getReader();

        const decoder = new TextDecoder();

        let buffer = "";
        let assistantContent = "";

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Send chat ID to the client first.
                    controller.enqueue(
                        new TextEncoder().encode(
                            JSON.stringify({
                                type: "chat",
                                chatId:
                                    currentChatId,
                            }) + "\n",
                        ),
                    );

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

                            const token =
                                data.message
                                    ?.content ?? "";

                            if (!token) {
                                continue;
                            }

                            assistantContent +=
                                token;

                            controller.enqueue(
                                new TextEncoder().encode(
                                    JSON.stringify({
                                        type: "token",
                                        content:
                                            token,
                                    }) + "\n",
                                ),
                            );
                        }
                    }

                    // Save the complete assistant response.
                    if (assistantContent) {
                        await createMessage(
                            currentChatId!,
                            "assistant",
                            assistantContent,
                        );
                    }

                    controller.enqueue(
                        new TextEncoder().encode(
                            JSON.stringify({
                                type: "done",
                            }) + "\n",
                        ),
                    );

                    controller.close();
                } catch (error) {
                    console.error(
                        "Failed to process Ollama stream:",
                        error,
                    );

                    controller.error(error);
                }
            },
        });

        return new Response(stream, {
            status: 200,
            headers: {
                "Content-Type":
                    "application/x-ndjson",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error(
            "Failed to process chat:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to process chat",
            },
            {
                status: 500,
            },
        );
    }
}