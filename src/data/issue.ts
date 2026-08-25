import type { Issue } from "@/types/issue";

export const issues: Issue[] = [
  {
    id: "Fix-login-page",
    title: "Fix login page",
    description: "Fix the login page",
    status: "open",
    priority: "high",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "Update-dashboard",
    title: "Update dashboard",
    description: "Update dashboard UI",
    status: "in progress",
    priority: "medium",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];