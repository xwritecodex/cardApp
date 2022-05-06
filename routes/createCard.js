const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');


//GET CREATE CARD PAGE

router.get('/', authenticateLogin, restrictRoute, async function(req, res, next) {

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

    res.render('createCard', { searchables: searchables, loggedIn: res.authenticate, username: res.username });
});

router.post('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const card = new Card(req.body);
    const tags = req.body.tags.split(' ');

    let withoutCommas = []

    tags.forEach((tag) => {
        tag = tag.replace(/,/g, '')
        withoutCommas.push(tag)
    })

    card.tags = withoutCommas

    // TAGGING HERE
    if (req.body.tags != '') {
        tags.forEach(async (tag) => {
            let findTag = await CardTag.findOne({ tag: tag }).exec();
            if (findTag == null) {
                let newTag = new CardTag ({
                    tag: tag,
                    cards: [card._id]
                });
                await newTag.save((err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("SAVED NEW CARD TAG:", doc);
                    };
                })
            } else {
                await CardTag.findByIdAndUpdate(findTag._id, { $push: { cards: card._id } }).exec();
            };
        });
        card.creator = res.id
        card.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("CARD SAVED:", doc);
            };
        })
    } else {
        card.creator = res.id
        card.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("CARD SAVED:", doc);
            };
        });
    };
    res.redirect('/');
});

module.exports = router;