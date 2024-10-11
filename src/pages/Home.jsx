import { useState } from 'react';
import "@/app/globals.css";

export default function Home() {
  const [cardA, setCardA] = useState(null);
  const [cardB, setCardB] = useState(null);
  const [joker, setJoker] = useState(null);

  const revealCardA = () => setCardA('Card A Revealed');
  const revealCardB = () => setCardB('Card B Revealed');
  const revealJoker = () => setJoker('Joker Revealed');

  return (
    <div className="min-h-screen bg-red-900 flex flex-col justify-center items-center text-center p-8">
      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="col-span-1">
          <div className="bg-red-700 border-2 border-yellow-500 p-4">
            <h1 className="text-yellow-300 mb-4">A</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              {cardA ? (
                <p className="text-white">{cardA}</p>
              ) : (
                <button
                  onClick={revealCardA}
                  className="bg-yellow-500 text-black px-4 py-2 rounded"
                >
                  Reveal Card A
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-red-700 border-2 border-yellow-500 p-4">
            <h1 className="text-yellow-300 mb-4">1st Card</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              <p className="text-white">First Card Placeholder</p>
            </div>
          </div>
        </div>

        {/* Joker column that spans 2 rows */}
        <div className="col-span-1 row-span-2">
          <div className="bg-red-700 border-2 border-yellow-500 p-4 h-full flex flex-col justify-center">
            <h1 className="text-yellow-300 mb-4">Joker</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              {joker ? (
                <p className="text-white">{joker}</p>
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

        <div className="col-span-1">
          <div className="bg-red-700 border-2 border-yellow-500 p-4">
            <h1 className="text-yellow-300 mb-4">B</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              {cardB ? (
                <p className="text-white">{cardB}</p>
              ) : (
                <button
                  onClick={revealCardB}
                  className="bg-yellow-500 text-black px-4 py-2 rounded"
                >
                  Reveal Card B
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-red-700 border-2 border-yellow-500 p-4">
            <h1 className="text-yellow-300 mb-4">1st Card</h1>
            <div className="h-48 border-dashed border-2 border-yellow-300 flex items-center justify-center mb-4">
              <p className="text-white">First Card Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-700 border-t-2 border-yellow-500 mt-8 p-4 w-full max-w-4xl">
        <h2 className="text-yellow-300">BETS</h2>
        <p className="text-white">Max: 5000, Min: 100</p>
      </div>

      <div className="bg-red-700 border-t-2 border-yellow-500 mt-4 p-4 w-full max-w-4xl">
        <h2 className="text-yellow-300">STATISTICS</h2>
        <div className="flex justify-between">
          <span className="text-white">A</span>
          <div className="bg-gray-200 h-4 w-3/4 relative mx-2">
            <div className="bg-yellow-500 h-full" style={{ width: '50%' }}></div>
            <div className="bg-blue-500 h-full absolute top-0 left-1/2 w-1/2"></div>
          </div>
          <span className="text-white">B</span>
        </div>
      </div>
    </div>
  );
}
