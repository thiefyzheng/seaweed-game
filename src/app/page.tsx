"use client";

import SeaweedFarmer from "@/components/SeaweedFarmer";
import HowToPlayPopup from "@/components/HowToPlayPopup";
import { useState } from "react";

export default function Home() {
  const [showHowToPlay, setShowHowToPlay] = useState(true);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <SeaweedFarmer />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowHowToPlay(true)}>How to Play</button>
      {showHowToPlay && <HowToPlayPopup onClose={() => setShowHowToPlay(false)} />}
    </main>
  );
}
