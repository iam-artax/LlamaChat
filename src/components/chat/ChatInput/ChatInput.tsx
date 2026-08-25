"use client";

import { useState } from "react";

import ButtonIcon from "@/components/shared/ButtonIcon/ButtonIcon";

import styles from "./ChatInput.module.css";

type ChatInputProps = {
    onSend: (message: string) => void;
    disabled?: boolean;
};

export default function ChatInput({
    onSend,
    disabled,
}: ChatInputProps) {
    const isDisabled = disabled === true;
    const [value, setValue] = useState("");

    function handleSubmit() {
        const message = value.trim();

        if (!message || isDisabled) {
            return;
        }

        onSend(message);
        setValue("");
    }

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            handleSubmit();
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputWrapper}>
                <textarea
                    value={value}
                    onChange={(event) =>
                        setValue(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    disabled={isDisabled}
                    rows={1}
                />

                <ButtonIcon
                    iconName="bx-send"
                    onClick={handleSubmit}
                    disabled={isDisabled || !value.trim()}
                />
            </div>
        </div>
    );
}