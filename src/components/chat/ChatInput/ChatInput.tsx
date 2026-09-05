"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import ButtonIcon from "@/components/shared/ButtonIcon/ButtonIcon";

import styles from "./ChatInput.module.css";

type ChatInputProps = {
    onSend: (message: string) => void;
    disabled: boolean;
};

const MAX_INPUT_HEIGHT = 127;

export default function ChatInput({
    onSend,
    disabled,
}: ChatInputProps) {
    const [value, setValue] = useState("");

    const textareaRef =
        useRef<HTMLTextAreaElement>(null);

    function adjustTextareaHeight() {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.style.height = "auto";

        const nextHeight = Math.min(
            textarea.scrollHeight,
            MAX_INPUT_HEIGHT,
        );

        textarea.style.height = `${nextHeight}px`;

        textarea.style.overflowY =
            textarea.scrollHeight > MAX_INPUT_HEIGHT
                ? "auto"
                : "hidden";
    }

    function focusInput() {
        if (disabled) {
            return;
        }

        textareaRef.current?.focus();
    }

    function handleSubmit() {
        const message = value.trim();

        if (!message || disabled) {
            return;
        }

        onSend(message);
        setValue("");
    }

    function handleChange(
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) {
        setValue(event.target.value);
    }

    function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>,
    ) {
        if (event.key !== "Enter") {
            return;
        }

        if (event.shiftKey) {
            return;
        }

        event.preventDefault();

        handleSubmit();
    }

    useEffect(() => {
        adjustTextareaHeight();
    }, [value]);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) {
            return;
        }

        textarea.disabled = disabled;

        if (!disabled) {
            textarea.focus();
        }
    }, [disabled]);

    return (
        <div
            className={styles.container}
            onClick={focusInput}
        >
            <div className={styles.inputWrapper}>
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    rows={1}
                />

                <ButtonIcon
                    iconName="bx-send"
                    onClick={handleSubmit}
                    disabled={
                        disabled ||
                        !value.trim()
                    }
                />
            </div>
        </div>
    );
}