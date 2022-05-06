const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');
const User = require('../models/User');

router.get('/', authenticateLogin, async function (req, res, next) {
    const user = await User.findById(res.id).populate("cardCollection");
    let createdCards = await Card.find({creator: res.id});
    let createdDecks = await Deck.find({creator: res.id});

    // IMPLEMENT AUTOFILL FOR QUERY
    let searchables = []
    let cardAutofill = await Card.find({}).lean()
    cardAutofill.forEach((card) => {
        card.cardName.split(' ').forEach((word) => {
            searchables.push(word.toLowerCase())
        })
    })
    let deckAutofill = await Deck.find({}).lean()
    deckAutofill.forEach((deck) => {
        deck.deckName.split(' ').forEach((word) => {
            searchables.push(word.toLowerCase())
        })
    })
    let taggedCardAutofill = await CardTag.find({}).lean()
    taggedCardAutofill.forEach((tag) => {
        searchables.push(tag.tag.toLowerCase())
    })
    let taggedDeckAutofill = await DeckTag.find({}).lean()
    taggedDeckAutofill.forEach((tag) => {
        searchables.push(tag.tag.toLowerCase())
    })
    searchables = Array.from(new Set(searchables));

    res.render('userAccount', {
        userImage: user.userImageUrl,
        createdDecks: createdDecks,
        createdCards: createdCards,
        cardCollection: user.cardCollection, 
        searchables: searchables,
        loggedIn: res.authenticate,
        username: res.username
    });
})

module.exports = router;