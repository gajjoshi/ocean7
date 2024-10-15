"use client";

import { useState,useEffect } from "react";
import CardFlip from "../components/CardFlip";
import "@/app/globals.css";
import axios from "axios";
import cards from "../../backend/data/cards"
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

  const [data, setData] = useState(null);  // Card data from the API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch card state every 5 seconds
  const fetchCardState = async () => {
      try {
          const response = await fetch('https://gaj.pythonanywhere.com/myapp/api/update_card_state/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          const result = await response.json();
          if (result.status === 'success') {
              setData(result.cardState);
              setIsLoading(false);
          } else {
              setError(result.message);
              setIsLoading(false);
          }
      } catch (err) {
          setError(err.message);
          setIsLoading(false);
      }
  };

  // Use effect to poll the API every 5 seconds
  useEffect(() => {
      fetchCardState();  // Fetch immediately
      const interval = setInterval(fetchCardState, 1000);  // Poll every 5 seconds
      return () => clearInterval(interval);  // Clean up interval on component unmount
  }, []);




  return (
    <div className="min-h-screen bg-red-900 flex flex-col items-center text-center">
    

    {/* Grid layout for sections A, B, and Joker */}
    <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Section A */}
        <div className="col-span-1 relative">
            <div className="bg-red-700 border-2 border-yellow-500 p-4">
                <h1 className="text-yellow-300 mb-4">A</h1>
                <div className="h-40 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
                    {data && data.displayedCards[0].map((card, index) => (
                        <CardFlip
                            key={index}
                            frontImage={card.image}
                            // frontContent={card.name}
                            isRevealed={true} // Cards are revealed when displayed
                            alt={card.name}
                            width="100"
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Joker section */}
        <div className="col-span-1 row-span-2">
            <div className="bg-red-700 border-2 border-yellow-500 p-4 h-full flex flex-col justify-center">
                <h1 className="text-yellow-300 mb-4">Joker</h1>
                <div className="h-36 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
                {/* {data && ( // Ensure data and jokerCard exist
        <CardFlip
            frontImage={data.jokerCard.image} // Access the jokerCard correctly
            frontContent={data.jokerCard.name}
            isRevealed={true} // Joker card should be revealed if it exists
            alt={data.jokerCard.name}
            width="100"
        />
    )} */}
                </div>
            </div>
        </div>

        {/* Section B */}
        <div className="col-span-1 relative">
            <div className="bg-red-700 border-2 border-yellow-500 p-4">
                <h1 className="text-yellow-300 mb-4">B</h1>
                <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
                    {data && data.displayedCards[1].map((card, index) => (
                        <CardFlip
                            key={index}
                            frontImage={card.image}
                            // frontContent={card.name}
                            isRevealed={true} // Cards are revealed when displayed
                            alt={card.name}
                            width="100"
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>

    {/* BETS Section */}
    <div className="bg-red-700 border-t-2 border-yellow-500 mt-8 p-4 w-full max-w-4xl">
        <h2 className="text-yellow-300">BETS</h2>
        <p className="text-white">Max: 5000, Min: 100</p>
    </div>

    {/* STATISTICS Section */}
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