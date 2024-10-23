import { useState, useEffect } from 'react';
import axios from 'axios';

export default function JokerCard() {
  const [jokerCard, setJokerCard] = useState(null); // To store joker card details
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(null); // To manage error state
  const [polling, setPolling] = useState(false); // To control polling

  // Function to call the API once and start polling
  const fetchJokerCard = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/assign_joker_directly');
      
      if (response.data.success) {
        setJokerCard(response.data.jokerCard); // Set the joker card
        setPolling(false); // Stop polling after successful response
      }
    } catch (err) {
      console.error('Error fetching joker card:', err);
      setError('Error fetching joker card');
    } finally {
      setLoading(false);
    }
  };

  // Function triggered on button click to start polling
  const startPolling = () => {
    setPolling(true);  // Start polling
  };

  // useEffect to poll the API every 1 second when polling is true
  useEffect(() => {
    if (polling) {
      const interval = setInterval(() => {
        fetchJokerCard(); // Poll the API every second
      }, 500);
      
      return () => clearInterval(interval); // Cleanup the interval when component unmounts or polling stops
    }
  }, [polling]);

  return (
    <div>
      <h1>Joker Card Assignment</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!jokerCard && !loading && (
        <button onClick={startPolling} disabled={polling}>
          Assign Joker Card
        </button>
      )}

      {loading && <p>Assigning joker card... please wait.</p>}

      {jokerCard && (
        <div>
          <h2>Joker Card Assigned!</h2>
          <p>Card Name: {jokerCard.name}</p>
          <img src={jokerCard.image} alt={jokerCard.name} width={100} />
        </div>
      )}
    </div>
  );
}
