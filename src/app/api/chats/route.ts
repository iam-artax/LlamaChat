import { NextResponse } from "next/server";

import {
    createChat,
    getChats,
} from "@/lib/db/chat";

export async function GET() {
    try {
        const chats = await getChats();

        return NextResponse.json({
            success: true,
            chats,
        });
    } catch (error) {
        console.error("Failed to get chats:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to get chats",
            },
            {
                status: 500,
            },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const title =
            typeof body.title === "string" &&
            body.title.trim()
                ? body.title.trim()
                : "New Chat";

        const model =
            typeof body.model === "string"
                ? body.model.trim()
                : "";

        if (!model) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Model is required",
                },
                {
                    status: 400,
                },
            );
        }

        const chat = await createChat(
            title,
            model,
        );

        return NextResponse.json(
            {
                success: true,
                chat,
            },
            {
                status: 201,
            },
        );
    } catch (error) {
        console.error("Failed to create chat:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to create chat",
            },
            {
                status: 500,
            },
        );
    }
}