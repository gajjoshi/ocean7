// controllers/cardController.js
// const cardImages =require("../../public/cardImages");
const cards = require('../data/cards');

// State management for revealed cards
const cardState = {
    revealedCardIds: [], // Track all revealed card IDs
    currentIndex: [0, 0, 0], // Indexes for sections 0, 1, and 2
    assignedCardIndices: [[], [], []], // Assigned card indices for sections 0, 1, and 2
    displayedCards: [[], [], []], // Displayed cards in sections 0, 1, and 2
    jokerCard: null, // Store the revealed joker card's index
};


const home = async (req, res) => {
    try {
        res.status(200).send("bill home");
    } catch (error) {
        console.log(error);
    }
};

const getCards = (req, res) => {
    // res.json(cards);
    res.json(cardState)
};

const revealCard = (req, res) => {
    const sectionIndex = parseInt(req.params.sectionIndex, 10); // Get section index from URL params

    // Validate the section index to be between 0 and 2 (inclusive)
    if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= cardState.displayedCards.length) {
        return res.status(400).json({ message: 'Invalid section index' });
    }

    let image;
    let found = false;

    // Loop through the cards to find a unique one for the selected section
    for (let index = cardState.currentIndex[sectionIndex]; index < cards.length; index++) {
        image = cards[index];
        const globalIndex = cards.indexOf(image);

        // Check if the card has already been assigned to any section
        if (!cardState.assignedCardIndices[0].includes(globalIndex) &&
            !cardState.assignedCardIndices[1].includes(globalIndex) &&
            !cardState.assignedCardIndices[2].includes(globalIndex)) {

            found = true;
            // Assign the card to the selected section
            cardState.assignedCardIndices[sectionIndex].push(globalIndex);
            cardState.displayedCards[sectionIndex].push(image);
            cardState.currentIndex[sectionIndex] += 1;
            break; // Exit the loop once a unique card is found
        }
    }

    if (found) {
        console.log(`Revealed card from Section ${sectionIndex + 1}: ${image.name}`); // Print the revealed card to the console
        res.json({
            message: `Revealed card from Section ${sectionIndex + 1}: ${image.name}`,
            card: image,
            cardState
        });
    } else {
        res.status(404).json({ message: `No more unique cards available in Section ${sectionIndex + 1}` });
    }
};


const reset = (req, res) => {
    // Shuffle card values
   

   

    // Reset assigned card indices, current indices, and displayed cards
    cardState.assignedCardIndices = [[], [],[]]; // Reset for Section A and B
    cardState.currentIndex = [0, 0,0]; // Reset current index for both sections
    cardState.displayedCards = [[], [],[]]; // Reset displayed cards for both sections

    // Send back the shuffled values and images
    res.json({
        message: 'Card values and images have been reset.',
    });
    console.log("reset")
};


module.exports = { home, getCards, revealCard,reset };
