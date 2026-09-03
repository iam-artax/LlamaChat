"use client";

import { useEffect, useState } from "react";

import type { Settings } from "@/types/settings";

import styles from "./SettingsModal.module.css";

type SettingsModalProps = {
    settings: Settings;
    onSave: (settings: Settings) => void;
    onClose: () => void;
};

export default function SettingsModal({
    settings,
    onSave,
    onClose,
}: SettingsModalProps) {
    const [form, setForm] =
        useState<Settings>(settings);

    useEffect(() => {
        setForm(settings);
    }, [settings]);

    function updateField(
        field: keyof Settings,
        value: string,
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        onSave({
            ...form,
            ollamaPort:
                form.ollamaPort.trim(),
            surrealdbUrl:
                form.surrealdbUrl.trim(),
            surrealdbNamespace:
                form.surrealdbNamespace.trim(),
            surrealdbDatabase:
                form.surrealdbDatabase.trim(),
            surrealdbUsername:
                form.surrealdbUsername.trim(),
        });
    }

    return (
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="settings-title"
            >
                <div className={styles.header}>
                    <div>
                        <h2 id="settings-title">
                            Settings
                        </h2>

                        <p>
                            Configure application
                            connections.
                        </p>
                    </div>

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
                </div>

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <div
                        className={
                            styles.section
                        }
                    >
                        <h3>Ollama</h3>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="ollama-port">
                                Port
                            </label>

                            <input
                                id="ollama-port"
                                type="number"
                                min="1"
                                max="65535"
                                value={
                                    form.ollamaPort
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "ollamaPort",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                            />

                            <span
                                className={
                                    styles.hint
                                }
                            >
                                Host is fixed to
                                localhost.
                            </span>
                        </div>
                    </div>

                    <div
                        className={
                            styles.section
                        }
                    >
                        <h3>SurrealDB</h3>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="surrealdb-url">
                                URL
                            </label>

                            <input
                                id="surrealdb-url"
                                type="text"
                                placeholder="ws://localhost:8000"
                                value={
                                    form.surrealdbUrl
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "surrealdbUrl",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div
                            className={
                                styles.row
                            }
                        >
                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="surrealdb-namespace">
                                    Namespace
                                </label>

                                <input
                                    id="surrealdb-namespace"
                                    type="text"
                                    value={
                                        form.surrealdbNamespace
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateField(
                                            "surrealdbNamespace",
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                />
                            </div>

                            <div
                                className={
                                    styles.field
                                }
                            >
                                <label htmlFor="surrealdb-database">
                                    Database
                                </label>

                                <input
                                    id="surrealdb-database"
                                    type="text"
                                    value={
                                        form.surrealdbDatabase
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateField(
                                            "surrealdbDatabase",
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="surrealdb-username">
                                Username
                            </label>

                            <input
                                id="surrealdb-username"
                                type="text"
                                value={
                                    form.surrealdbUsername
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "surrealdbUsername",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                            />
                        </div>

                        <div
                            className={
                                styles.field
                            }
                        >
                            <label htmlFor="surrealdb-password">
                                Password
                            </label>

                            <input
                                id="surrealdb-password"
                                type="password"
                                value={
                                    form.surrealdbPassword
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "surrealdbPassword",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div
                        className={
                            styles.warning
                        }
                    >
                        <i className="bx bx-info-circle" />

                        <p>
                            Restart the project
                            to apply connection
                            settings.
                        </p>
                    </div>

                    <div
                        className={
                            styles.actions
                        }
                    >
                        <button
                            type="button"
                            className={
                                styles.cancelButton
                            }
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={
                                styles.saveButton
                            }
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}