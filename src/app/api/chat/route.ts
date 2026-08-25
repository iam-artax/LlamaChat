import { NextRequest } from "next/server";

const OLLAMA_URL = "http://localhost:11434";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: body.model,
        messages: body.messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      return new Response("Failed to communicate with Ollama", {
        status: response.status,
      });
    }

    if (!response.body) {
      return new Response("Ollama returned no response body", {
        status: 500,
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/x-ndjson",
      },
    });
  } catch {
    return new Response("Unable to connect to Ollama", {
      status: 503,
    });
  }
}