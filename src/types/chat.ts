export type MessageRole =
    | "user"
    | "assistant";

export interface Message {
    id: string;
    role: MessageRole;
    content: string;
}

export interface Chat {
    id: string;
    title: string;
    model: string;
    created_at: string;
    updated_at: string;
}