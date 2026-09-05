import { useEffect, useRef } from "react";

import type { Message } from "@/types/chat";

import ChatMessage from "../ChatMessage/ChatMessage";

import styles from "./ChatWindow.module.css";

type ChatWindowProps = {
    messages: Message[];
    error: string | null;
};

export default function ChatWindow({
    messages,
    error,
}: ChatWindowProps) {
    const messagesEndRef =
        useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, error]);

    return (
        <section className={styles.window}>
            <div className={styles.messages}>
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                {error && (
                    <div
                        className={
                            styles.error
                        }
                        role="alert"
                    >
                        <span
                            className={
                                styles.errorIcon
                            }
                            aria-hidden="true"
                        >
                            !
                        </span>

                        <p
                            className={
                                styles.errorText
                            }
                        >
                            {error}
                        </p>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}