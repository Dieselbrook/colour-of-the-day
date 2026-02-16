"use client";

import { useState, useCallback } from "react";

interface ColourCard {
  name: string;
  mood: string;
  hex: string;
}

const COLOUR_POOL: ColourCard[] = [
  { name: "Ocean Blue", mood: "calm & collected", hex: "#0077B6" },
  { name: "Sunset Orange", mood: "fired up", hex: "#F77F00" },
  { name: "Emerald Green", mood: "growth mode", hex: "#2D6A4F" },
  { name: "Royal Purple", mood: "creative genius", hex: "#7B2D8E" },
  { name: "Golden Yellow", mood: "pure sunshine", hex: "#F4A100" },
  { name: "Cherry Red", mood: "bold & fearless", hex: "#D00000" },
  { name: "Coral Pink", mood: "warm & fuzzy", hex: "#FF6B6B" },
  { name: "Midnight Navy", mood: "deep thinker", hex: "#1B2845" },
  { name: "Electric Teal", mood: "buzzing with ideas", hex: "#00B4D8" },
  { name: "Lavender", mood: "peaceful vibes", hex: "#B388EB" },
  { name: "Sage Green", mood: "grounded & steady", hex: "#87A878" },
  { name: "Hot Magenta", mood: "main character energy", hex: "#FF006E" },
  { name: "Burnt Sienna", mood: "cozy & nostalgic", hex: "#C1440E" },
  { name: "Sky Blue", mood: "limitless", hex: "#89CFF0" },
  { name: "Forest Green", mood: "back to basics", hex: "#1B4332" },
  { name: "Copper", mood: "resourceful & sharp", hex: "#B87333" },
  { name: "Blush", mood: "soft power", hex: "#DE6FA1" },
  { name: "Slate Grey", mood: "focused & efficient", hex: "#708090" },
  { name: "Tangerine", mood: "unstoppable", hex: "#FF9505" },
  { name: "Indigo", mood: "visionary mode", hex: "#3F37C9" },
];

function pickRandom(pool: ColourCard[], count: number): ColourCard[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function Home() {
  const [stage, setStage] = useState<"button" | "pick" | "loading" | "joke">("button");
  const [colours, setColours] = useState<ColourCard[]>([]);
  const [selected, setSelected] = useState<ColourCard[]>([]);
  const [joke, setJoke] = useState("");

  const handlePress = useCallback(() => {
    setColours(pickRandom(COLOUR_POOL, 5));
    setSelected([]);
    setJoke("");
    setStage("pick");
  }, []);

  const handleSelect = useCallback(
    async (card: ColourCard) => {
      if (stage !== "pick") return;

      const alreadySelected = selected.find((s) => s.name === card.name);
      if (alreadySelected) {
        setSelected(selected.filter((s) => s.name !== card.name));
        return;
      }

      const next = [...selected, card];
      setSelected(next);

      if (next.length === 2) {
        setStage("loading");
        try {
          const res = await fetch("/api/joke", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              colour1: next[0].name,
              colour2: next[1].name,
              mood1: next[0].mood,
              mood2: next[1].mood,
            }),
          });
          const data = await res.json();
          setJoke(data.joke);
          setStage("joke");
        } catch {
          setJoke("Couldn't think of a joke... guess my humour is feeling a bit grey today 😅");
          setStage("joke");
        }
      }
    },
    [stage, selected]
  );

  const reset = useCallback(() => {
    setStage("button");
    setColours([]);
    setSelected([]);
    setJoke("");
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight text-center">
        Colour of the Day
      </h1>
      <p className="text-zinc-500 mb-12 text-center text-sm md:text-base">
        {stage === "button" && "Press the button to discover your vibe"}
        {stage === "pick" && "Pick 2 colours that speak to you"}
        {stage === "loading" && "Brewing a dad joke..."}
        {stage === "joke" && "Your colours have spoken 🎨"}
      </p>

      {/* BIG RED BUTTON */}
      {stage === "button" && (
        <button
          onClick={handlePress}
          className="pulse-glow w-40 h-40 md:w-52 md:h-52 rounded-full bg-red-600 hover:bg-red-500 transition-colors text-white font-bold text-xl md:text-2xl cursor-pointer select-none"
        >
          PRESS ME
        </button>
      )}

      {/* COLOUR CARDS */}
      {(stage === "pick" || stage === "loading" || stage === "joke") && (
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl">
          {colours.map((card, i) => {
            const isSelected = selected.some((s) => s.name === card.name);
            const isDimmed = stage !== "pick" && !isSelected;
            return (
              <button
                key={card.name}
                onClick={() => handleSelect(card)}
                disabled={stage !== "pick"}
                className="fade-in-up rounded-2xl p-5 w-36 md:w-40 text-center transition-all duration-300 cursor-pointer disabled:cursor-default"
                style={{
                  animationDelay: `${i * 100}ms`,
                  opacity: 0,
                  backgroundColor: card.hex,
                  transform: isSelected ? "scale(1.1)" : "scale(1)",
                  filter: isDimmed ? "brightness(0.4)" : "brightness(1)",
                  border: isSelected ? "3px solid white" : "3px solid transparent",
                }}
              >
                <div className="font-bold text-white text-sm md:text-base drop-shadow-lg">
                  {card.name}
                </div>
                <div className="text-white/80 text-xs mt-1 drop-shadow">
                  {card.mood}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* LOADING */}
      {stage === "loading" && (
        <div className="mt-10 text-zinc-400 animate-pulse text-lg">
          🤔 Thinking...
        </div>
      )}

      {/* JOKE */}
      {stage === "joke" && (
        <div className="mt-10 max-w-md text-center fade-in">
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
            <p className="text-lg md:text-xl leading-relaxed">{joke}</p>
          </div>
          <button
            onClick={reset}
            className="mt-6 px-6 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors font-medium cursor-pointer"
          >
            Go Again 🔄
          </button>
        </div>
      )}
    </main>
  );
}
