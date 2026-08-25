import { NextResponse } from "next/server";

import type {
  OllamaModelsResponse,
} from "@/types/ollama";

const OLLAMA_URL = "http://localhost:11434";

export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch Ollama models",
        },
        {
          status: response.status,
        },
      );
    }

    const data: OllamaModelsResponse = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to connect to Ollama",
      },
      {
        status: 500,
      },
    );
  }
}