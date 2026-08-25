import type { OllamaModel } from "@/types/ollama";

import ModelSelector from "@/components/chat/ModelSelector/ModelSelector";

import styles from "./Header.module.css";

type HeaderProps = {
    models: OllamaModel[];
    selectedModel: string;
    onModelChange: (model: string) => void;
    disabled?: boolean;
};

export default function Header({
    models,
    selectedModel,
    onModelChange,
    disabled = false,
}: HeaderProps) {
    return (
        <header className={styles.header}>
            <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onChange={onModelChange}
                disabled={disabled}
            />
        </header>
    );
}