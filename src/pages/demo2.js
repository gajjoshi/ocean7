import React, { useEffect, useState } from 'react';
import "@/app/globals.css";

const CardSections = () => {
    const [data, setData] = useState(null);  // Card data from the API
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch card state every 5 seconds
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

    // Use effect to poll the API every 5 seconds
    useEffect(() => {
        fetchCardState();  // Fetch immediately
        const interval = setInterval(fetchCardState, 500);  // Poll every 5 seconds
        return () => clearInterval(interval);  // Clean up interval on component unmount
    }, []);

    // Render card data
    return (
        <div>
            <h2>Cards in Each Section:</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    {/* Render cards for each section */}
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
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default CardSections;
