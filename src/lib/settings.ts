export type Theme =
    | "dark"
    | "light"
    | "system";

export type ContextLength =
    | 2048
    | 4096
    | 8192
    | 16384
    | 32768
    | 65536
    | 131072;

export type AppSettings = {
    ollamaPort: number;
    contextLength: ContextLength;
    theme: Theme;
};

export const DEFAULT_SETTINGS: AppSettings = {
    ollamaPort: 11434,
    contextLength: 4096,
    theme: "dark",
};

const SETTINGS_STORAGE_KEY =
    "llama-chat-settings";

export function loadSettings(): AppSettings {
    if (typeof window === "undefined") {
        return DEFAULT_SETTINGS;
    }

    try {
        const stored =
            localStorage.getItem(
                SETTINGS_STORAGE_KEY,
            );

        if (!stored) {
            return DEFAULT_SETTINGS;
        }

        const parsed = JSON.parse(
            stored,
        ) as Partial<AppSettings>;

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

export function saveSettings(
    settings: AppSettings,
) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings),
    );
}

export function updateSettings(
    updates: Partial<AppSettings>,
): AppSettings {
    const settings = {
        ...loadSettings(),
        ...updates,
    };

    saveSettings(settings);

    return settings;
}

export function getResolvedTheme(
    theme: Theme,
): "dark" | "light" {
    if (theme !== "system") {
        return theme;
    }

    if (
        typeof window !== "undefined" &&
        window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches
    ) {
        return "dark";
    }

    return "light";
}

export function applyTheme(
    theme: Theme,
) {
    if (typeof document === "undefined") {
        return;
    }

    document.documentElement.dataset.theme =
        getResolvedTheme(theme);
}