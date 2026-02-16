import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { colour1, colour2, mood1, mood2 } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 150,
      temperature: 1,
      messages: [
        {
          role: "system",
          content:
            "You are a dad joke generator. Given two colours and their mood descriptions, generate ONE short, punny dad joke that cleverly combines both colours. Keep it clean, wholesome, and groan-worthy. Return ONLY the joke text, nothing else.",
        },
        {
          role: "user",
          content: `Colour 1: ${colour1} (${mood1})\nColour 2: ${colour2} (${mood2})`,
        },
      ],
    });

    const joke = completion.choices[0]?.message?.content?.trim() || "I'm drawing a blank... must be running low on colour-ful ideas!";

    return NextResponse.json({ joke });
  } catch (error) {
    console.error("Joke API error:", error);
    return NextResponse.json(
      { joke: "My joke machine broke... it's feeling a bit blue 😅" },
      { status: 500 }
    );
  }
}
