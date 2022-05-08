const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');

// GET RATING ROUTE

router.get('/card/:id/:rating', authenticateLogin, restrictRoute, async (req, res, next) => {
    await Card.findByIdAndUpdate(req.params.id, { $push: {ratings: [+req.params.rating]} })
    res.redirect('/')
})

router.get('/deck/:id/:rating', authenticateLogin, restrictRoute, async (req, res, next) => {
    await Deck.findByIdAndUpdate(req.params.id, { $push: {ratings: [+req.params.rating]} })
    res.redirect('/')
})

module.exports = router;