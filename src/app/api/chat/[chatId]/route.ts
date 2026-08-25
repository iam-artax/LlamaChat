import { NextResponse } from "next/server";

import { getChat } from "@/lib/db/chat";
import { getMessages } from "@/lib/db/message";

type RouteContext = {
    params: Promise<{
        chatId: string;
    }>;
};

export async function GET(
    _request: Request,
    { params }: RouteContext,
) {
    try {
        const { chatId } = await params;

        const [chat, messages] = await Promise.all([
            getChat(chatId),
            getMessages(chatId),
        ]);

        if (!chat) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Chat not found",
                },
                {
                    status: 404,
                },
            );
        }

        return NextResponse.json({
            success: true,
            chat,
            messages,
        });
    } catch (error) {
        console.error("Failed to get chat:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to get chat",
            },
            {
                status: 500,
            },
        );
    }
}