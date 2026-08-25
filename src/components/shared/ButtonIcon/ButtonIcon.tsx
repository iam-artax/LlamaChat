import styles from "./ButtonIcon.module.css";

type ButtonIconProps = {
    iconName: string;
    text?: string;
    onClick?: () => void;
    disabled?: boolean;
};

export default function ButtonIcon({
    iconName,
    text,
    onClick,
    disabled = false,
}: ButtonIconProps) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
            type="button"
        >
            {text && <span>{text}</span>}

            <i
                className={`bx ${iconName}`}
                aria-hidden="true"
            />
        </button>
    );
}