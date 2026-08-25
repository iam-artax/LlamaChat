"use client";

import type { OllamaModel } from "@/types/ollama";

import styles from "./ModelSelector.module.css";

type ModelSelectorProps = {
    models: OllamaModel[];
    selectedModel: string;
    onChange: (model: string) => void;
    disabled?: boolean;
};

export default function ModelSelector({
    models,
    selectedModel,
    onChange,
    disabled = false,
}: ModelSelectorProps) {
    return (
        <select
            className={styles.select}
            value={selectedModel}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
        >
            {models.map((model) => (
                <option
                    key={model.name}
                    value={model.name}
                >
                    {model.name}
                </option>
            ))}
        </select>
    );
}