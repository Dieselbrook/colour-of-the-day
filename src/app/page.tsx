"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLOUR_POOL = [
  { name: "Ocean Blue", hex: "#0077B6", mood: "calm & collected" },
  { name: "Sunset Orange", hex: "#F77F00", mood: "fired up" },
  { name: "Emerald Green", hex: "#2DC653", mood: "growth mode" },
  { name: "Royal Purple", hex: "#7B2D8E", mood: "mysterious energy" },
  { name: "Hot Pink", hex: "#FF006E", mood: "unapologetically bold" },
  { name: "Golden Yellow", hex: "#FFD60A", mood: "pure sunshine" },
  { name: "Cherry Red", hex: "#D90429", mood: "passion unleashed" },
  { name: "Electric Teal", hex: "#00F5D4", mood: "future vibes" },
  { name: "Coral", hex: "#FF7F7F", mood: "soft & warm" },
  { name: "Midnight Indigo", hex: "#3A0CA3", mood: "deep thinker" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "button" | "picking" | "loading" | "joke";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("button");
  const [colours, setColours] = useState<typeof COLOUR_POOL>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [joke, setJoke] = useState("");

  const start = useCallback(() => {
    setColours(shuffle(COLOUR_POOL).slice(0, 5));
    setSelected([]);
    setJoke("");
    setPhase("picking");
  }, []);

  const toggle = (i: number) => {
    setSelected((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= 2) return prev;
      return [...prev, i];
    });
  };

  const getJoke = async () => {
    const c1 = colours[selected[0]];
    const c2 = colours[selected[1]];
    setPhase("loading");
    try {
      const res = await fetch("/api/joke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colour1: `${c1.name} (${c1.mood})`,
          colour2: `${c2.name} (${c2.mood})`,
        }),
      });
      const data = await res.json();
      setJoke(data.joke || "Couldn't think of one... I'm feeling a bit colourblind today.");
    } catch {
      setJoke("Something went wrong... guess the colours clashed!");
    }
    setPhase("joke");
  };

  const reset = () => {
    setPhase("button");
    setColours([]);
    setSelected([]);
    setJoke("");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">
        {phase === "button" && (
          <motion.div
            key="button"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-center">
              Colour of the Day
            </h1>
            <p className="text-zinc-400 text-lg">What&apos;s your vibe?</p>
            <button
              onClick={start}
              className="w-40 h-40 rounded-full bg-red-500 hover:bg-red-400 active:scale-95 transition-all shadow-[0_0_60px_rgba(239,68,68,0.4)] hover:shadow-[0_0_80px_rgba(239,68,68,0.6)] text-white font-bold text-xl"
            >
              TAP ME
            </button>
          </motion.div>
        )}

        {phase === "picking" && (
          <motion.div
            key="picking"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-8 w-full max-w-2xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center">Pick 2 colours</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              {colours.map((c, i) => {
                const isSelected = selected.includes(i);
                return (
                  <motion.button
                    key={c.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => toggle(i)}
                    className={`rounded-2xl p-5 text-left transition-all border-2 ${
                      isSelected
                        ? "border-white scale-105 shadow-lg"
                        : "border-transparent hover:border-zinc-600"
                    }`}
                    style={{ backgroundColor: c.hex + "22" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full mb-3 shadow-md"
                      style={{ backgroundColor: c.hex }}
                    />
                    <div className="font-bold text-sm" style={{ color: c.hex }}>
                      {c.name}
                    </div>
                    <div className="text-zinc-400 text-xs mt-1">{c.mood}</div>
                  </motion.button>
                );
              })}
            </div>
            <button
              disabled={selected.length !== 2}
              onClick={getJoke}
              className="mt-2 px-8 py-3 rounded-full bg-white text-black font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition-all"
            >
              Get My Joke →
            </button>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-zinc-600 border-t-white rounded-full animate-spin" />
            <p className="text-zinc-400">Cooking up a dad joke...</p>
          </motion.div>
        )}

        {phase === "joke" && (
          <motion.div
            key="joke"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col items-center gap-8 max-w-lg text-center"
          >
            <div className="flex gap-3">
              {selected.map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full shadow-md"
                  style={{ backgroundColor: colours[i].hex }}
                />
              ))}
            </div>
            <p className="text-2xl md:text-3xl font-bold leading-relaxed">{joke}</p>
            <button
              onClick={reset}
              className="px-8 py-3 rounded-full border-2 border-zinc-600 hover:border-white font-bold transition-all"
            >
              Go Again 🎨
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
