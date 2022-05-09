const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');
const User = require('../models/User');

router.get('/', authenticateLogin, async function(req, res, next) {


    const card = await Card.findById(req.params.id);

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


        let creator = false;
        if (card.creator == res.id) {
            creator = true;
        }


    res.render('cardView', {card: card, creator, searchables: searchables, loggedIn: res.authenticate, username: res.username})
})

module.exports = router;