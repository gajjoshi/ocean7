import React, { useState, useEffect } from 'react';
import CardFlip from '../components/CardFlip'; // Assuming you have a CardFlip component
import "@/app/globals.css";
const GameLayout = () => {


// const cardImages = [
//         { "id": 1, "name": "Ace of Spades", "image": "/cardImages/ffive.png" },
//         { "id": 2, "name": "King of Hearts", "image":  "/cardImages/sthree.png" },
//         { "id": 3, "name": "Queen of Diamond", "image": "/cardImages/hsix.png" },    
//         { "id": 5, "name": "Queen of Diamond", "image": "/cardImages/hsix.png" },   
//         { "id": 6, "name": "King of Hearts", "image":  "/cardImages/sthree.png" },
//         { "id": 7, "name": "Queen of Diamond", "image": "/cardImages/hsix.png" },
//     ]
    
    const [data, setData] = useState(null);  // Card data from the API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jokerCard, setJokerCard] = useState(null);
    const [revealedCards, setRevealedCards] = useState(Array(52).fill(false));

    // Function to fetch card state after revealing a card
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

    // Function to handle revealing a card based on section id
    const handleReveal = async (id) => {
        setIsLoading(true); // Show loading while revealing a card
        try {
            const response = await fetch(`http://127.0.0.1:8000/myapp/api/assign_card_to_section3/${id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (result.success) {
                console.log(`Card revealed for section ${id}:`, result.card);
                // Fetch updated card state to reflect the changes in the UI
                fetchCardState();
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    };

    const handleReset = async () => {
      setIsLoading(true);  // Show loading while resetting
      try {
          const response = await fetch('https://gaj.pythonanywhere.com/myapp/api/reset_card_state/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
          const result = await response.json();
          if (result.status === 'success') {
              console.log("Card state reset successfully!");
              // Fetch the updated state to reflect the reset
              fetchCardState();
          } else {
              setError(result.message);
          }
      } catch (err) {
          setError(err.message);
      }
      setIsLoading(false);
  };
 
  const revealJoker = async () => {
      try {
          const response = await fetch('https://gaj.pythonanywhere.com/myapp/api/reveal_joker/', {
              method: 'POST', // Use POST or GET depending on your backend setup
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          const data = await response.json();

          if (response.ok) {
              setJokerCard(data.jokerCard); // Update the state with the joker card details
              setError(null); // Clear any previous errors
          } else {
              throw new Error(data.error || 'Failed to reveal joker card');
          }
      } catch (err) {
          setError(err.message); // Handle any errors
      }
  };

    useEffect(() => {
        fetchCardState();  // Fetch card state on initial load
    }, []);
  return (
        <div className="min-h-screen bg-red-900 flex flex-col items-center text-center">
            {/* Button controls */}
            <div className="w-full flex justify-between p-4 max-w-4xl">
                <button onClick={handleReset} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Assign Values
                </button>
                <button onClick={() => handleReveal(0)} className="bg-yellow-500 text-black px-4 py-2 rounded">
                    Reveal Card A
                </button>
                <button onClick={() => handleReveal(1)} className="bg-yellow-500 text-black px-4 py-2 rounded">
                    Reveal Card B
                </button>
                <button onClick={revealJoker} className="bg-yellow-500 text-black px-4 py-2 rounded">
                    Reveal Joker
                </button>
            </div>

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
                            {jokerCard && (
                                <CardFlip
                                    frontImage={jokerCard.image}
                                    // frontContent={jokerCard.name}
                                    isRevealed={true} // Joker card should be revealed if it exists
                                    alt={jokerCard.name}
                                    width="100"
                                />
                            )}
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
  

export default GameLayout;
