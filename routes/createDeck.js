const express = require("express");
const router = express.Router();
const authenticateLogin = require("../middleware/authenticateLogin");
const restrictRoute = require("../middleware/restrictRoute");
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');

// GET CREATE DECK PAGE

router.get("/", authenticateLogin, restrictRoute, async function (req, res, next) {
    const currentCookie = req.cookies.selected_cards;

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

        // CARD RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
        cards.forEach((card) => {
            let averageRating = (card.ratings.reduce(function (a, b) {
                return +a + +b
            }, 0) / card.ratings.length)
            if (averageRating > 0 && averageRating < 1.5) {
                card.stars = `
        <a href='/rate/card/${card._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/2' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/3' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 1.5 && averageRating < 2.5) {
                card.stars = `
        <a href='/rate/card/${card._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/3' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 2.5 && averageRating < 3.5) {
                card.stars = `
        <a href='/rate/card/${card._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/3' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 3.5 && averageRating < 4.5) {
                card.stars = `
        <a href='/rate/card/${card._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/3' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/4' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 4.5) {
                card.stars = `
        <a href='/rate/card/${card._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/3' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/4' class="ratingLink"><i class='fa fa-star checked'></i></a>
        <a href='/rate/card/${card._id}/5' class="ratingLink"><i class='fa fa-star checked'></i></a>`
            } else {
                card.stars = `
        <a href='/rate/card/${card._id}/1' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/2' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/3' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
        <a href='/rate/card/${card._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            }
        })

        res.render("createDeck", {
            searchables: searchables,
            cards: cards,
            loggedIn: res.authenticate,
            username: res.username,
        });
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

        let messages = ["Please select cards before designing deck!"];
        res.render('index', {
            searchables: searchables,
            cards: cards,
            decks: decks,
            loggedIn: res.authenticate,
            username: res.username,
            messages: messages
        });
    }
});

router.post("/", authenticateLogin, restrictRoute, async function (req, res, next) {
    const deck = new Deck(req.body);
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
        deck.creator = res.id
        deck.ratings = []
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
        deck.creator = res.id
        deck.ratings = []
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
});

module.exports = router;