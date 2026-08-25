import type { Message } from "@/types/chat";

import ChatMessage from "../ChatMessage/ChatMessage";

import styles from "./ChatWindow.module.css";

type ChatWindowProps = {
    messages: Message[];
};

export default function ChatWindow({
    messages,
}: ChatWindowProps) {
    return (
        <section className={styles.window}>
            <div className={styles.messages}>
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}
            </div>
        </section>
    );
}