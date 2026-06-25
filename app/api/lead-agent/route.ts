import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a friendly AI assistant for Studio FX, a creative digital agency based in Birmingham, UK that specialises in websites, AI systems, and content production.

Your role is to help website visitors understand what Studio FX does, answer questions about services and process, and gently qualify leads so the right enquiries reach the team.

Key facts:
- Services: bespoke websites, AI automation systems, and content production (video/photo/copy)
- Typical clients: startups, scale-ups, and established brands wanting to look world-class
- First call is always free — 30 minutes, no obligation
- Response time: under 24 hours
- Based in Birmingham, serving clients worldwide
- Contact: hello@studiofx.co

Guidelines:
- Keep replies concise and conversational — max 3 short paragraphs
- Ask one qualifying question at a time if needed (budget, timeline, what they're building)
- Never invent specific pricing — say the team will provide a quote on the free call
- If someone is clearly ready to enquire, encourage them to use the contact form or book a call
- Don't use em-dashes (—), excessive punctuation, or sales clichés
- Tone: confident, warm, direct. Like a smart colleague, not a bot.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages?: Message[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages array is required." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service is not configured." }, { status: 500 });
    }

    const client = new Anthropic({ apiKey });

    const stream = await client.messages.stream({
      model: "claude-opus-4-8",
      max_tokens: 512,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to get a response." }, { status: 500 });
  }
}
