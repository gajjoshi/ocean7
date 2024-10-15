// routes/cardRoutes.js

const express = require('express');
const cardControllers = require('../controllers/cardController');

const router = express.Router();
router.route("/").get(cardControllers.home)

router.route("/cards").get(cardControllers.getCards);
router.route("/reset").get(cardControllers.reset);
router.route('/reveal/:sectionIndex').get(cardControllers.revealCard); // POST to reveal a card

module.exports = router;

