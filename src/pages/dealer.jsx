"use client";

import { useState } from "react";
import CardFlip from "../components/CardFlip";
import "@/app/globals.css";

const Dealer = () => {
  const cardImages = [
    "/cardImages/ffive.png",
    "/cardImages/sthree.png",
    "/cardImages/hsix.png",
    "/cardImages/d1.png",
    "/cardImages/d3.png",
    "/cardImages/d4.png",
    "/cardImages/d5.png",
    "/cardImages/fjack.png",
  ]; // Your card images

  const [cardValues, setCardValues] = useState(Array(cardImages.length).fill(null));
  const [revealedCards, setRevealedCards] = useState(Array(cardImages.length).fill(false));
  const [displayedCards, setDisplayedCards] = useState([[], []]); // A and B sections
  const [currentIndex, setCurrentIndex] = useState([0, 0]); // Indexes for sections A and B
  const [assignedCardIndices, setAssignedCardIndices] = useState([[], []]); // Track assigned card indices
  const [jokerCard, setJokerCard] = useState(null); // Joker card state

  // Assign unique card values and shuffle
  const assignCardValues = () => {
    const uniqueValues = Array.from({ length: cardImages.length }, (_, i) => `Value ${i + 1}`);

    // Shuffle card values and images
    for (let i = uniqueValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueValues[i], uniqueValues[j]] = [uniqueValues[j], uniqueValues[i]];
    }

    const shuffledImagesArray = [...cardImages];
    for (let i = shuffledImagesArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImagesArray[i], shuffledImagesArray[j]] = [shuffledImagesArray[j], shuffledImagesArray[i]];
    }

    setCardValues(shuffledImagesArray.map((_, i) => uniqueValues[i]));
    setRevealedCards(Array(cardImages.length).fill(false));
    setCurrentIndex([0, 0]);
    setDisplayedCards([[], []]);
    setAssignedCardIndices([[], []]);
    setJokerCard(null);
  };

  // Reveal card in a section (A or B)
  const handleReveal = (sectionIndex) => {
    var index = currentIndex[sectionIndex];
    let image;

    if (index < cardImages.length) {
      let found = false;
      while (index < cardImages.length && !found) {
        image = cardImages[index];
        const globalIndex = cardImages.indexOf(image);

        if (!assignedCardIndices[0].includes(globalIndex) && !assignedCardIndices[1].includes(globalIndex)) {
          found = true;
          setAssignedCardIndices((prev) => {
            const newAssigned = [...prev];
            newAssigned[sectionIndex].push(globalIndex);
            return newAssigned;
          });
        }
        index++;
      }

      if (found) {
        setDisplayedCards((prev) => {
          const newDisplayedCards = [...prev];
          newDisplayedCards[sectionIndex].push(image);
          return newDisplayedCards;
        });

        setRevealedCards((prev) => {
          const newRevealedCards = [...prev];
          newRevealedCards[cardImages.indexOf(image)] = true;
          return newRevealedCards;
        });

        setCurrentIndex((prev) => {
          const newIndex = [...prev];
          newIndex[sectionIndex] += 1;
          return newIndex;
        });
      } else {
        alert(`No more unique cards available in Section ${sectionIndex + 1}`);
      }
    } else {
      alert(`No more cards available in Section ${sectionIndex + 1}`);
    }
  };

  // Reveal the Joker card
  const revealJoker = () => {
    if (!jokerCard) {
      let found = false;
      while (!found) {
        const randomIndex = Math.floor(Math.random() * cardImages.length);
        if (!assignedCardIndices[0].includes(randomIndex) && !assignedCardIndices[1].includes(randomIndex)) {
          setJokerCard(cardImages[randomIndex]);
          found = true;
        }
      }
    } else {
      alert("The Joker card has already been revealed.");
    }
  };

  return (
    <div className="min-h-screen bg-red-900 flex flex-col  items-center text-center ">
          <div className="w-full flex justify-between p-4 max-w-4xl">

      <button
        onClick={assignCardValues}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Assign Values
      </button>
      <button
        onClick={() => handleReveal(1)}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Reveal Card B
      </button>
      <button
        onClick={() => handleReveal(0)}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Reveal Card A
      </button>
</div>

      {/* Stacked sections A and B with Joker section on the right */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Section A */}
        <div className="col-span-1 relative">

          <div className="bg-red-700 border-2 border-yellow-500 p-4 ">
            <h1 className="text-yellow-300 mb-4">A</h1>
            <div className="h-40 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              {displayedCards[0].map((image, index) => (
                <CardFlip
                  key={index}
                  frontImage={image}
                  frontContent={revealedCards[cardImages.indexOf(image)] ? cardValues[cardImages.indexOf(image)] : null}
                  isRevealed={revealedCards[cardImages.indexOf(image)]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Joker section spanning 2 rows */}
        <div className="col-span-1 row-span-2">
          <div className="bg-red-700 border-2 border-yellow-500 p-4 h-full flex flex-col justify-center">
            <h1 className="text-yellow-300 mb-4">Joker</h1>
            <div className="h-36 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              {jokerCard ? (
                <CardFlip
                  frontImage={jokerCard}
                  frontContent={revealedCards[cardImages.indexOf(jokerCard)] ? cardValues[cardImages.indexOf(jokerCard)] : null}
                  isRevealed={true}
                />
              ) : (
                <button
                  onClick={revealJoker}
                  className="bg-yellow-500 text-black px-4 py-2 rounded"
                >
                  Reveal Joker
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section B */}
        <div className="col-span-1 relative">

          <div className="bg-red-700 border-2 border-yellow-500 p-4 ">
            <h1 className="text-yellow-300 mb-4">B</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              {displayedCards[1].map((image, index) => (
                <CardFlip
                  key={index}
                  frontImage={image}
                  frontContent={revealedCards[cardImages.indexOf(image)] ? cardValues[cardImages.indexOf(image)] : null}
                  isRevealed={revealedCards[cardImages.indexOf(image)]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BETS section */}
      <div className="bg-red-700 border-t-2 border-yellow-500 mt-8 p-4 w-full max-w-4xl">
        <h2 className="text-yellow-300">BETS</h2>
        <p className="text-white">Max: 5000, Min: 100</p>
      </div>

      {/* STATISTICS section */}
      <div className="bg-red-700 border-t-2 border-yellow-500 mt-4 p-4 w-full max-w-4xl">
        <h2 className="text-yellow-300">STATISTICS</h2>
        <div className="flex justify-between">
          <span className="text-white">A</span>
          <div className="bg-gray-200 h-4 w-3/4 relative mx-2">
            <div className="bg-blue-500 h-4 absolute left-0 top-0 w-1/3"></div>
          </div>
          <span className="text-white">B</span>
        </div>
      </div>
    </div>

  );
};

export default Dealer;
