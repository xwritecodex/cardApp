const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');
const User = require('../models/User');

router.get('/:id', authenticateLogin, async function(req, res, next) {

    let id = req.params.id
    let deck = await Deck.findById(id).populate('cards');

    let creator = false;
    if (deck.creator == res.id) {
        creator = true;
    }

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

            //Deck Rating:

            let averageRating = (deck.ratings.reduce(function (a, b) { return +a + +b }, 0) / deck.ratings.length)
            if (averageRating > 0 && averageRating < 1.5) {
              deck.stars = `
              <a href='/rate/deck/${deck._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/2' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/3' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 1.5 && averageRating < 2.5) {
              deck.stars = `
              <a href='/rate/deck/${deck._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/3' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 2.5 && averageRating < 3.5) {
              deck.stars = `
              <a href='/rate/deck/${deck._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/3' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 3.5 && averageRating < 4.5) {
              deck.stars = `
              <a href='/rate/deck/${deck._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/3' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/4' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            } else if (averageRating >= 4.5) {
              deck.stars = `
              <a href='/rate/deck/${deck._id}/1' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/2' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/3' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/4' class="ratingLink"><i class='fa fa-star checked'></i></a>
              <a href='/rate/deck/${deck._id}/5' class="ratingLink"><i class='fa fa-star checked'></i></a>`
            } else {
              deck.stars = `
              <a href='/rate/deck/${deck._id}/1' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/2' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/3' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/4' class="ratingLink"><i class='fa fa-star'></i></a>
              <a href='/rate/deck/${deck._id}/5' class="ratingLink"><i class='fa fa-star'></i></a>`
            }

    
            // CARD RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
            deck.cards.forEach((card) => {
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
    res.render('deckView', {deck: deck, cards: deck.cards, loggedIn: res.authenticate, username: res.username})
});

module.exports = router;