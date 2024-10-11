"use client"; // Mark this as a client component

import { useContext } from "react";
import { CardContext } from "@/context/CardContext";
import CardFlip from "../components/CardFlip";
import "@/app/globals.css";

const Player = () => {
  const { revealedCards, displayedCards } = useContext(CardContext); // Get revealed cards from context

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/redvelvet.png')" }}>
      <div className="flex flex-col items-center justify-center">
        <div className="flex space-x-[-130px]">
          {displayedCards.map((section, sectionIndex) =>
            section.map((image, cardIndex) => (
              <div key={`${sectionIndex}-${cardIndex}`}>
                <CardFlip
                  frontImage={image}
                  isRevealed={revealedCards[cardIndex]}
                  frontContent={revealedCards[cardIndex] ? "Some Content" : null} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
