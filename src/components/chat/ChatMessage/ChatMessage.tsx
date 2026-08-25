"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import styles from "./ChatMessage.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessageProps = {
  message: Message;
};

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`${styles.message} ${
        message.role === "user" ? styles.user : styles.assistant
      }`}
    >
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre({ children }) {
              return <CodeBlock>{children}</CodeBlock>;
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const code = codeRef.current?.textContent ?? "";

    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className={styles.codeBlock}>
      <button
        type="button"
        className={styles.copyButton}
        onClick={handleCopy}
      >
        {copied ? "Copied" : "Copy"}
      </button>

      <pre ref={codeRef}>{children}</pre>
    </div>
  );
}