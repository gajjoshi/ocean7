const http = require('http');
const express = require('express');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port=5000;
app.use(cors());
app.use(express.json());

let cardData = {
  sectionA: [],
  sectionB: [],
  joker: null,
};

app.use(cors());
app.use(express.json());

const cardImages = [
  "/cardImages/ffive.png",
  "/cardImages/sthree.png",
  "/cardImages/hsix.png",
  "/cardImages/d1.png",
  "/cardImages/d3.png",
  "/cardImages/d4.png",
  "/cardImages/d5.png",
  "/cardImages/fjack.png",
];

let assignedCardIndices = {
  A: [],
  B: [],
  joker: null,
};

app.post('/api/cards/reveal', (req, res) => {
  const { section } = req.body;

  if (section === 'joker') {
    if (assignedCardIndices.joker) {
      return res.status(400).json({ success: false, message: "Joker card already revealed." });
    }

    // Reveal a random card for the Joker
    let found = false;
    while (!found) {
      const randomIndex = Math.floor(Math.random() * cardImages.length);
      if (!assignedCardIndices.A.includes(randomIndex) && !assignedCardIndices.B.includes(randomIndex)) {
        assignedCardIndices.joker = cardImages[randomIndex];
        found = true;
      }
    }
    return res.json({ success: true, card: assignedCardIndices.joker });
  } else if (section === 'A' || section === 'B') {
    const sectionIndex = section === 'A' ? 'A' : 'B';
    const currentIndex = assignedCardIndices[sectionIndex].length;

    // Reveal a card from the designated section
    if (currentIndex >= cardImages.length) {
      return res.status(400).json({ success: false, message: `No more cards available in Section ${section}` });
    }

    let found = false;
    let card;
    while (!found && currentIndex < cardImages.length) {
      card = cardImages[currentIndex];
      if (!assignedCardIndices.A.includes(currentIndex) && !assignedCardIndices.B.includes(currentIndex)) {
        assignedCardIndices[sectionIndex].push(currentIndex);
        found = true;
      }
      currentIndex++;
    }

    if (found) {
      return res.json({ success: true, card });
    } else {
      return res.status(400).json({ success: false, message: `No more unique cards available in Section ${section}` });
    }
  } else {
    return res.status(400).json({ success: false, message: "Invalid section specified." });
  }
});



// API to get card data (for displaying revealed cards)
app.get('/api/revealedCards', (req, res) => {
    const revealedData = {
      sectionA: cardData.sectionA,
      sectionB: cardData.sectionB,
      joker: cardData.joker,
    };
    res.json(revealedData);
  });
  
 
  
 
  
  
 



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
