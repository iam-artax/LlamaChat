"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    defaultSettings,
    type Settings,
} from "@/types/settings";

const STORAGE_KEY = "ollama-chat-settings";

export function useSettings() {
    const [settings, setSettings] =
        useState<Settings>(defaultSettings);

    const [isLoaded, setIsLoaded] =
        useState(false);

    useEffect(() => {
        try {
            const stored =
                localStorage.getItem(
                    STORAGE_KEY,
                );

            if (stored) {
                const parsed =
                    JSON.parse(stored);

                setSettings({
                    ...defaultSettings,
                    ...parsed,
                });
            }
        } catch (error) {
            console.error(
                "Failed to load settings:",
                error,
            );
        } finally {
            setIsLoaded(true);
        }
    }, []);

    function updateSettings(
        newSettings: Settings,
    ) {
        setSettings(newSettings);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(newSettings),
        );
    }

    return {
        settings,
        updateSettings,
        isLoaded,
    };
}