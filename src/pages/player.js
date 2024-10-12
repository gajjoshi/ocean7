import { useEffect, useState } from "react";
import axios from "axios";
import CardFlip from "../components/CardFlip";
import io from "socket.io-client";
const socket = io("http://localhost:5000/dealer"); // Adjust the URL as necessary
const Player = () => {
  const [cardData, setCardData] = useState({
    sectionA: [],
    sectionB: [],
    joker: null,
  });

  useEffect(() => {
    // Fetch initial card data
    const fetchCardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cards");
        console.log("Initial card data for player:", response.data);
        setCardData(response.data);
      } catch (error) {
        console.error("Error fetching card data:", error);
      }
    };

    fetchCardData();

    // Listen for card revealed events
    socket.on("cardRevealed", (updatedCardData) => {
      console.log("Updated card data from server:", updatedCardData); // Log the updated data
      setCardData(updatedCardData); // Update state with new card data
    });

    // Cleanup the socket listener
    return () => {
      socket.off("cardRevealed");
    };
  }, []);

  return (
    <div className="min-h-screen bg-red-900 flex flex-col justify-center items-center text-center p-8">
      {/* Your UI for displaying cards, similar to dealer's UI */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        {/* Section A */}
        <div className="col-span-1">
          <h1 className="text-yellow-300 mb-4">A</h1>
          <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
            {cardData.sectionA.map((image, index) => (
              <CardFlip
                key={index}
                frontImage={image}
                isRevealed={true} // All cards are revealed in player view
              />
            ))}
          </div>
        </div>

        {/* Joker Section */}
        <div className="col-span-1">
          <h1 className="text-yellow-300 mb-4">Joker</h1>
          <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
            {cardData.joker ? (
              <CardFlip
                frontImage={cardData.joker}
                isRevealed={true} // Joker is revealed
              />
            ) : (
              <span>No Joker Revealed</span>
            )}
          </div>
        </div>

        {/* Section B */}
        <div className="col-span-1">
          <h1 className="text-yellow-300 mb-4">B</h1>
          <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
            {cardData.sectionB.map((image, index) => (
              <CardFlip
                key={index}
                frontImage={image}
                isRevealed={true} // All cards are revealed in player view
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
