const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');
const User = require('../models/User');

router.get('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const deck = await Deck.findById(req.params.id);
    const currentCookie = req.cookies.selected_cards;

    let cards;
    if (currentCookie == undefined) {
        cards = [];
    } else {
        let selectedCards = JSON.parse(req.cookies.selected_cards);
        cards = await Card.find({
            _id: {
                $in: selectedCards
            },
        });
    }
    if (currentCookie != undefined) {
        cards.forEach((card) => {
            JSON.parse(currentCookie).forEach((id) => {
                if (card._id.valueOf() == id) {
                    card.selected = true;
                }
            });
        });
        res.render('editDeck', {deck: deck, cards: cards, loggedIn: res.authenticate, username: res.username})
    } else {
        let currentCookie = req.cookies.selected_cards;
        let cards = await Card.find({}).lean();
        let decks = await Deck.find({}).lean();
        if (currentCookie != undefined) {
            cards.forEach((card) => {
                JSON.parse(currentCookie).forEach((id) => {
                    if (card._id.valueOf() == id) {
                        card.selected = true
                    }
                })
            })
        }
        let messages = ["Please select cards before editing deck!"];
        res.render('editDeck', {deck: deck, cards: cards, loggedIn: res.authenticate, username: res.username, messages: messages})
    }
})

router.post('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const deck = await Deck.findByIdAndUpdate(req.params.id, req.body);

    const tags = req.body.tags.split(' ');
    let withoutCommas = []

    tags.forEach((tag) => {
        tag = tag.replace(/,/g, '')
        withoutCommas.push(tag)
    })

    deck.tags = withoutCommas

    // TAGGING HERE
    if (req.body.tags != "") {
        tags.forEach(async (tag) => {
            let findTag = await DeckTag.findOne({
                tag: tag
            }).exec();
            if (findTag == null) {
                let newTag = new DeckTag({
                    tag: tag,
                    decks: [deck._id],
                });
                await newTag.save((err, doc) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("SAVED NEW DECK TAG:", doc);
                    }
                });
            } else {
                await DeckTag.findByIdAndUpdate(findTag._id, {
                    $push: {
                        decks: deck._id
                    },
                }).exec();
            }
        });
        let selectedCards = req.cookies.selected_cards
        deck.cards = JSON.parse(selectedCards);
        deck.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("DECK SAVED:", doc);
                res.clearCookie("selected_cards");
                res.redirect("/");
            }
        });
    } else {
        let selectedCards = req.cookies.selected_cards
        deck.cards = JSON.parse(selectedCards);
        deck.save((err, doc) => {
            if (err) {
                console.log(err);
            } else {
                console.log("DECK SAVED:", doc);
                res.clearCookie("selected_cards");
                res.redirect("/");
            }
        });
    }
}) 


module.exports = router;