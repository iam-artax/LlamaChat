import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/variables.css"
import "boxicons/css/boxicons.min.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trackly",
  description: "A simple and modern issue tracker for managing projects and tasks.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
