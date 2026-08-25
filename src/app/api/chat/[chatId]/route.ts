import { NextResponse } from "next/server";

import {
    deleteChat,
    getChat,
    renameChat,
} from "@/lib/db/chat";
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
        console.error(
            "Failed to get chat:",
            error,
        );

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

export async function PATCH(
    request: Request,
    { params }: RouteContext,
) {
    try {
        const { chatId } = await params;

        const body = await request.json();

        const title =
            typeof body.title === "string"
                ? body.title.trim()
                : "";

        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Title is required",
                },
                {
                    status: 400,
                },
            );
        }

        const chat = await getChat(chatId);

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

        const updatedChat = await renameChat(
            chatId,
            title,
        );

        return NextResponse.json({
            success: true,
            chat: updatedChat,
        });
    } catch (error) {
        console.error(
            "Failed to rename chat:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to rename chat",
            },
            {
                status: 500,
            },
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {
    try {
        const { chatId } = await params;

        const chat = await getChat(chatId);

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

        await deleteChat(chatId);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error(
            "Failed to delete chat:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error: "Failed to delete chat",
            },
            {
                status: 500,
            },
        );
    }
}