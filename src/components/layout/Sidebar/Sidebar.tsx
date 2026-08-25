import ButtonIcon from "@/components/shared/ButtonIcon/ButtonIcon";

import styles from "./Sidebar.module.css";

type SidebarProps = {
    onNewChat: () => void;
    onSettings: () => void;
};

export default function Sidebar({
    onNewChat,
    onSettings,
}: SidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <h1>Ollama Chat</h1>
            </div>

            <div className={styles.chatList}>
                <button className={styles.chatItem}>
                    <i className="bx bx-message-rounded" />
                    <span>First conversation</span>
                </button>

                <button className={styles.chatItem}>
                    <i className="bx bx-message-rounded" />
                    <span>React project</span>
                </button>

                <button className={styles.chatItem}>
                    <i className="bx bx-message-rounded" />
                    <span>Learning TypeScript</span>
                </button>
            </div>

            <div className={styles.footer}>
                <ButtonIcon
                    iconName="bx-cog"
                    onClick={onSettings}
                />

                <ButtonIcon
                    iconName="bx-plus"
                    text="New Chat"
                    onClick={onNewChat}
                />
            </div>
        </aside>
    );
}