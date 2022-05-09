const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');
const User = require('../models/User');

router.get('/:id', authenticateLogin, function(req, res, next) {

    // let creator = false;
    // if (deck.creator == res.id) {
    //     creator = true;
    // }

    res.render('deckView', {loggedIn: res.authenticate, username: res.username})
})

module.exports = router;