import React, { useState, useEffect } from 'react';
import "@/app/globals.css";

const CardSections = () => {
    const [data, setData] = useState(null);  // Card data from the API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jokerCard, setJokerCard] = useState(null);
  
    // Function to fetch card state after revealing a card
    const fetchCardState = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/myapp/api/update_card_state/', {
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
            const response = await fetch(`http://127.0.0.1:8000/myapp/api/assign_card/${id}/`, {
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
          const response = await fetch('http://127.0.0.1:8000/myapp/api/reset_card_state/', {
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
          const response = await fetch('http://127.0.0.1:8000/myapp/api/reveal_joker/', {
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

    // Render card data for each section
    return (
        <div>
            <h2>Cards in Each Section:</h2>


            <button onClick={handleReset}>Reset Card State</button>

            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    {data && data.displayedCards.map((sectionCards, sectionIndex) => (
                        <div key={sectionIndex}>
                            <h3>Section {sectionIndex + 1}</h3>
                            <ul>
                                {sectionCards.map((card, cardIndex) => (
                                    <li key={cardIndex}>
                                        <p>{card.name}</p>
                                        <img src={card.image} alt={card.name} width="100" />
                                    </li>
                                ))}
                            </ul>
                            {/* Reveal button for each section */}
                            <button onClick={() => handleReveal(sectionIndex)}>
                                Reveal Card for Section {sectionIndex + 1}
                            </button>
                        </div>
                    ))}

<div>
            <button onClick={revealJoker}>Reveal Joker Card</button>
            {error && <p className="text-red-500">{error}</p>}
            {jokerCard && (
                <div className="mt-4">
                    <h2>Joker Card Revealed:</h2>
                    <p>{jokerCard.name}</p>
                    <img src={jokerCard.image} alt={jokerCard.name}  width="100"/>
                </div>
            )}
        </div>

                </>
            )}
        </div>
    );
};

export default CardSections;
