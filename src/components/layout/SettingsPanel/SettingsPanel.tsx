"use client";

import { useEffect, useState } from "react";

import styles from "./SettingsPanel.module.css";

type SettingsTab = "general" | "appearance" | "about";

type SettingsPanelProps = {
    onClose: () => void;
};

const tabs: {
    id: SettingsTab;
    label: string;
    icon: string;
}[] = [
    {
        id: "general",
        label: "General",
        icon: "bx-cog",
    },
    {
        id: "appearance",
        label: "Appearance",
        icon: "bx-palette",
    },
    {
        id: "about",
        label: "About",
        icon: "bx-info-circle",
    },
];

export default function SettingsPanel({
    onClose,
}: SettingsPanelProps) {
    const [activeTab, setActiveTab] =
        useState<SettingsTab>("general");

    useEffect(() => {
        function handleKeyDown(
            event: KeyboardEvent,
        ) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [onClose]);

    function handleOverlayClick(
        event: React.MouseEvent<HTMLDivElement>,
    ) {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }

    return (
        <div
            className={styles.overlay}
            onMouseDown={handleOverlayClick}
        >
            <section
                className={styles.panel}
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2>Settings</h2>
                    </div>

                    <nav
                        className={styles.navigation}
                        aria-label="Settings"
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                className={`${styles.tab} ${
                                    activeTab === tab.id
                                        ? styles.activeTab
                                        : ""
                                }`}
                                onClick={() =>
                                    setActiveTab(
                                        tab.id,
                                    )
                                }
                            >
                                <i
                                    className={`bx ${tab.icon}`}
                                />

                                <span>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className={styles.content}>
                    <header className={styles.header}>
                        <h3>
                            {
                                tabs.find(
                                    (tab) =>
                                        tab.id ===
                                        activeTab,
                                )?.label
                            }
                        </h3>

                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close settings"
                        >
                            <i className="bx bx-x" />
                        </button>
                    </header>

                    <div className={styles.body}>
                        {activeTab === "general" && (
                            <div
                                className={
                                    styles.section
                                }
                            >
                                <div
                                    className={
                                        styles.sectionHeader
                                    }
                                >
                                    <h4>
                                        General
                                    </h4>

                                    <p>
                                        General
                                        application
                                        settings.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab ===
                            "appearance" && (
                            <div
                                className={
                                    styles.section
                                }
                            >
                                <div
                                    className={
                                        styles.sectionHeader
                                    }
                                >
                                    <h4>
                                        Appearance
                                    </h4>

                                    <p>
                                        Customize
                                        the appearance
                                        of Llama Chat.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "about" && (
                            <div
                                className={
                                    styles.section
                                }
                            >
                                <div
                                    className={
                                        styles.sectionHeader
                                    }
                                >
                                    <h4>About</h4>

                                    <p>
                                        Information
                                        about Llama
                                        Chat.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}