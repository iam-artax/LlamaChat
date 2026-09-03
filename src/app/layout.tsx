import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import "@/styles/variables.css";
import "boxicons/css/boxicons.min.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Llama Chat",
  description: "A local-first ChatGPT-style interface for Ollama.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}