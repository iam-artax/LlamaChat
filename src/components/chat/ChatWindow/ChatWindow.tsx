import { useEffect, useRef } from "react";

import type { Message } from "@/types/chat";

import ChatMessage from "../ChatMessage/ChatMessage";

import styles from "./ChatWindow.module.css";

type ChatWindowProps = {
    messages: Message[];
};

export default function ChatWindow({
    messages,
}: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
    });
}, [messages]);
    return (
        <section className={styles.window}>
            <div className={styles.messages}>
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}