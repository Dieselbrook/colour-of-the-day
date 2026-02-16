import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { colour1, colour2 } = await req.json();

    if (!colour1 || !colour2) {
      return NextResponse.json({ error: "Need 2 colours" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 1,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content:
            "You are a dad joke comedian. Given two colours with their mood/energy descriptions, write ONE short, punny dad joke that combines both colours. Keep it family-friendly, groan-worthy, and under 2 sentences. Return ONLY the joke, nothing else.",
        },
        {
          role: "user",
          content: `Colour 1: ${colour1}\nColour 2: ${colour2}`,
        },
      ],
    });

    const joke = completion.choices[0]?.message?.content?.trim() || "I'm drawing a blank... must be colour-blind!";

    return NextResponse.json({ joke });
  } catch (e) {
    console.error("Joke API error:", e);
    return NextResponse.json({ joke: "My joke generator is feeling blue... try again!" }, { status: 500 });
  }
}
