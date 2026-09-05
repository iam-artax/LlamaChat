"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    loadSettings,
    saveSettings,
    type AppSettings,
    type ContextLength,
    type Theme,
} from "@/lib/settings";

import styles from "./SettingsPanel.module.css";

type SettingsTab =
    | "general"
    | "appearance"
    | "about";

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

const contextOptions: {
    value: ContextLength;
    label: string;
}[] = [
    {
        value: 2048,
        label: "2K",
    },
    {
        value: 4096,
        label: "4K",
    },
    {
        value: 8192,
        label: "8K",
    },
    {
        value: 16384,
        label: "16K",
    },
    {
        value: 32768,
        label: "32K",
    },
    {
        value: 65536,
        label: "64K",
    },
    {
        value: 131072,
        label: "128K",
    },
];

export default function SettingsPanel({
    onClose,
}: SettingsPanelProps) {
    const [activeTab, setActiveTab] =
        useState<SettingsTab>("general");

    const [settings, setSettings] =
        useState<AppSettings | null>(null);

    useEffect(() => {
        setSettings(loadSettings());
    }, []);

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
        if (
            event.target ===
            event.currentTarget
        ) {
            onClose();
        }
    }

    function updateSetting<
        K extends keyof AppSettings,
    >(
        key: K,
        value: AppSettings[K],
    ) {
        setSettings((current) => {
            if (!current) {
                return current;
            }

            const nextSettings = {
                ...current,
                [key]: value,
            };

            saveSettings(nextSettings);

            return nextSettings;
        });
    }

    function handleThemeChange(
        theme: Theme,
    ) {
        updateSetting(
            "theme",
            theme,
        );

        document.documentElement.dataset.theme =
            theme;
    }

    if (!settings) {
        return null;
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
                    <div
                        className={
                            styles.sidebarHeader
                        }
                    >
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
                                    activeTab ===
                                    tab.id
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
                            className={
                                styles.closeButton
                            }
                            onClick={onClose}
                            aria-label="Close settings"
                        >
                            <i className="bx bx-x" />
                        </button>
                    </header>

                    <div className={styles.body}>
                        {activeTab ===
                            "general" && (
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
                                        Configure
                                        connection
                                        and model
                                        settings.
                                    </p>
                                </div>

                                <div
                                    className={
                                        styles.settingsList
                                    }
                                >
                                    <div
                                        className={
                                            styles.setting
                                        }
                                    >
                                        <div
                                            className={
                                                styles.settingInfo
                                            }
                                        >
                                            <label htmlFor="ollama-port">
                                                Ollama Port
                                            </label>

                                            <span>
                                                The
                                                local
                                                port
                                                used
                                                by
                                                Ollama.
                                            </span>
                                        </div>

                                        <input
                                            id="ollama-port"
                                            type="number"
                                            min="1"
                                            max="65535"
                                            value={
                                                settings.ollamaPort
                                            }
                                            onChange={(
                                                event,
                                            ) => {
                                                const value =
                                                    Number(
                                                        event
                                                            .target
                                                            .value,
                                                    );

                                                if (
                                                    value >=
                                                        1 &&
                                                    value <=
                                                        65535
                                                ) {
                                                    updateSetting(
                                                        "ollamaPort",
                                                        value,
                                                    );
                                                }
                                            }}
                                        />
                                    </div>

                                    <div
                                        className={
                                            styles.setting
                                        }
                                    >
                                        <div
                                            className={
                                                styles.settingInfo
                                            }
                                        >
                                            <label htmlFor="context-length">
                                                Context
                                                Length
                                            </label>

                                            <span>
                                                Maximum
                                                context
                                                size
                                                used
                                                for
                                                conversations.
                                            </span>
                                        </div>

                                        <select
                                            id="context-length"
                                            value={
                                                settings.contextLength
                                            }
                                            onChange={(
                                                event,
                                            ) =>
                                                updateSetting(
                                                    "contextLength",
                                                    Number(
                                                        event
                                                            .target
                                                            .value,
                                                    ) as ContextLength,
                                                )
                                            }
                                        >
                                            {contextOptions.map(
                                                (
                                                    option,
                                                ) => (
                                                    <option
                                                        key={
                                                            option.value
                                                        }
                                                        value={
                                                            option.value
                                                        }
                                                    >
                                                        {
                                                            option.label
                                                        }
                                                    </option>
                                                ),
                                            )}
                                        </select>
                                    </div>
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
                                        how Llama
                                        Chat looks.
                                    </p>
                                </div>

                                <div
                                    className={
                                        styles.settingsList
                                    }
                                >
                                    <div
                                        className={
                                            styles.setting
                                        }
                                    >
                                        <div
                                            className={
                                                styles.settingInfo
                                            }
                                        >
                                            <label>
                                                Theme
                                            </label>

                                            <span>
                                                Choose
                                                your
                                                preferred
                                                color
                                                theme.
                                            </span>
                                        </div>

                                        <div
                                            className={
                                                styles.themeOptions
                                            }
                                        >
                                            <button
                                                type="button"
                                                className={
                                                    settings.theme ===
                                                    "dark"
                                                        ? styles.selectedOption
                                                        : styles.option
                                                }
                                                onClick={() =>
                                                    handleThemeChange(
                                                        "dark",
                                                    )
                                                }
                                            >
                                                <i className="bx bx-moon" />

                                                <span>
                                                    Dark
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    settings.theme ===
                                                    "light"
                                                        ? styles.selectedOption
                                                        : styles.option
                                                }
                                                onClick={() =>
                                                    handleThemeChange(
                                                        "light",
                                                    )
                                                }
                                            >
                                                <i className="bx bx-sun" />

                                                <span>
                                                    Light
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab ===
                            "about" && (
                            <div
                                className={
                                    styles.section
                                }
                            >
                                <div
                                    className={
                                        styles.about
                                    }
                                >
                                    <img
                                        src="/logo.webp"
                                        alt="Llama Chat"
                                        className={
                                            styles.aboutLogo
                                        }
                                    />

                                    <h4>
                                        Llama Chat
                                    </h4>

                                    <p>
                                        A local-first
                                        chat
                                        interface
                                        for
                                        Ollama.
                                    </p>

                                    <span
                                        className={
                                            styles.version
                                        }
                                    >
                                        Version 0.1.0
                                    </span>

                                    <a
                                        href="https://github.com/iam-artax/LlamaChat"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={
                                            styles.githubLink
                                        }
                                    >
                                        <i className="bx bxl-github" />

                                        <span>
                                            View on
                                            GitHub
                                        </span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}