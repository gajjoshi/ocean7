"use client";

import { useState } from "react";
import CardFlip from "../components/CardFlip";
import "@/app/globals.css";
import axios from "axios";
import cards from "../../backend/data/cards"
const Dealer = () => {
  // const cardImages = [
  //   "/cardImages/ffive.png",
  //   "/cardImages/sthree.png",
  //   "/cardImages/hsix.png",
  //   "/cardImages/d1.png",
  //   "/cardImages/d3.png",
  //   "/cardImages/d4.png",
  //   "/cardImages/d5.png",
  //   "/cardImages/fjack.png",
  // ]; // Your card images

  const [cardValues, setCardValues] = useState(Array(cardImages.length).fill(null));
  const [revealedCards, setRevealedCards] = useState(Array(cardImages.length).fill(false));
  const [displayedCards, setDisplayedCards] = useState([[], [], []]); // A and B sections
  const [currentIndex, setCurrentIndex] = useState([0, 0,0]); // Indexes for sections A and B
  const [assignedCardIndices, setAssignedCardIndices] = useState([[], [], []]); // Track assigned card indices


  const handleReveal = async (sectionIndex) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reveal/${sectionIndex}`);
      const revealedCard = response.data.card; // Assuming it returns the card object
      
      console.log(`Revealed card: ${revealedCard.name}`);

      // Find the card object in the cards array
      const card = cards.find(c => c.id === revealedCard.id);
      if (card) {
        setDisplayedCards(prev => {
          const newDisplayed = [...prev];
          newDisplayed[sectionIndex].push(card.id); // Store the card ID instead of the whole card object
          return newDisplayed;
        });

        // Mark the card as revealed
        setRevealedCards(prev => {
          const newRevealedCards = [...prev];
          newRevealedCards[cards.indexOf(card)] = true; // Update the revealed status
          return newRevealedCards;
        });
      }
    } catch (error) {
      console.error('Error fetching card:', error);
    }
  };


  const reassignCards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reset');
      const resetCards = response.data.cards; // Assuming it returns an array of card objects

      setCards(resetCards); // Update the state with the reset cards
      console.log("Cards reset done");
    } catch (error) {
      console.error('Error resetting cards:', error);
    }
  };
  return (
    <div className="min-h-screen bg-red-900 flex flex-col  items-center text-center ">
          <div className="w-full flex justify-between p-4 max-w-4xl">

      <button
        onClick={()=> reassignCards}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Assign Values
      </button>
      
      <button
        onClick={() => handleReveal(0)}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Reveal Card A
      </button>
      <button
        onClick={() => handleReveal(1)}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Reveal Card B
      </button>
      <button
        onClick={() => handleReveal(2)}
        className="bg-yellow-500 text-black px-4 py-2 rounded"
      >
        Reveal Joker
      </button>
</div>

      {/* Stacked sections A and B with Joker section on the right */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Section A */}
        <div className="col-span-1 relative">

          <div className="bg-red-700 border-2 border-yellow-500 p-4 ">
            <h1 className="text-yellow-300 mb-4">A</h1>
            <div className="h-40 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
            {displayedCards[0].map((cardId, index) => {
                const card = cards.find(c => c.id === cardId); // Find the card object by ID
                return card ? (
                  <CardFlip
                    key={index}
                    frontImage={card.image} // Use the image path from the card object
                    frontContent={revealedCards[cards.indexOf(card)] ? card.name : null} // Display name or null based on revealed state
                    isRevealed={revealedCards[cards.indexOf(card)]} // Pass the revealed state
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Joker section spanning 2 rows */}
        <div className="col-span-1 row-span-2">
          <div className="bg-red-700 border-2 border-yellow-500 p-4 h-full flex flex-col justify-center">
            <h1 className="text-yellow-300 mb-4">Joker</h1>
            <div className="h-36 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
            {displayedCards[2].map((cardId, index) => {
                const card = cards.find(c => c.id === cardId); // Find the card object by ID
                return card ? (
                  <CardFlip
                    key={index}
                    frontImage={card.image} // Use the image path from the card object
                    frontContent={revealedCards[cards.indexOf(card)] ? card.name : null} // Display name or null based on revealed state
                    isRevealed={revealedCards[cards.indexOf(card)]} // Pass the revealed state
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Section B */}
        <div className="col-span-1 relative">

          <div className="bg-red-700 border-2 border-yellow-500 p-4 ">
            <h1 className="text-yellow-300 mb-4">B</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
            {displayedCards[1].map((cardId, index) => {
                const card = cards.find(c => c.id === cardId); // Find the card object by ID
                return card ? (
                  <CardFlip
                    key={index}
                    frontImage={card.image} // Use the image path from the card object
                    frontContent={revealedCards[cards.indexOf(card)] ? card.name : null} // Display name or null based on revealed state
                    isRevealed={revealedCards[cards.indexOf(card)]} // Pass the revealed state
                  />
                ) : null;
              })}
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