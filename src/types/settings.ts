export type Settings = {
    ollamaPort: string;

    surrealdbUrl: string;
    surrealdbNamespace: string;
    surrealdbDatabase: string;
    surrealdbUsername: string;
    surrealdbPassword: string;
};

export const defaultSettings: Settings = {
    ollamaPort: "11434",

    surrealdbUrl: "",
    surrealdbNamespace: "",
    surrealdbDatabase: "",
    surrealdbUsername: "",
    surrealdbPassword: "",
};