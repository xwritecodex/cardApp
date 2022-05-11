const express = require("express");
const router = express.Router();
const authenticateLogin = require("../middleware/authenticateLogin");
const restrictRoute = require("../middleware/restrictRoute");
const Deck = require("../models/Deck");
const Card = require("../models/Card");
const CardTag = require("../models/CardTag");
const DeckTag = require("../models/DeckTag");

// GET SEARCH RESULTS

router.get("/", authenticateLogin, async function (req, res, next) {

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


  // HANDLE QUERY LOGIC
  if (req.query.search != "" && req.query.search != undefined) {
    let cards = await Card.find({})
      .where("cardName")
      .equals({
        $regex: req.query.search,
        $options: "i"
      })
      .exec();
    let decks = await Deck.find({})
      .where("deckName")
      .equals({
        $regex: req.query.search,
        $options: "i"
      })
      .exec();
    let taggedCards = await CardTag.find({})
      .where("tag")
      .equals({
        $regex: req.query.search,
        $options: "i"
      })
      .populate("cards");
    if (taggedCards.length != 0) {
      taggedCards = taggedCards[0].cards;
    };
    let taggedDecks = await DeckTag.find({})
      .where("tag")
      .equals({
        $regex: req.query.search,
        $options: "i"
      })
      .populate("decks");
    if (taggedDecks.length != 0) {
      taggedDecks = taggedDecks[0].decks;
    };



    if (cards.length == 0 && decks.length == 0 && taggedCards == 0 && taggedDecks == 0) {
      let cards = await Card.find({});
      let decks = await Deck.find({});
      let messages = ["No cards, decks, or tags matched your search"]
      res.render("index", {
        cards: cards,
        decks: decks,
        searchables: searchables,
        loggedIn: res.authenticate,
        username: res.username,
        messages: messages,
      })
    } else {
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

      // DECK RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
      decks.forEach((deck) => {
        let averageRating = (deck.ratings.reduce(function (a, b) {
          return +a + +b
        }, 0) / deck.ratings.length)
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
      })

      // TAGGED CARD RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
  taggedCards.forEach((card) => {
    let averageRating = (card.ratings.reduce(function (a, b) { return +a + +b }, 0) / card.ratings.length)
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

  // TAGGED DECK RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
  taggedDecks.forEach((deck) => {
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
  })


      res.render("index", {
        searched: req.query.search,
        cards: cards,
        decks: decks,
        taggedCards: taggedCards,
        taggedDecks: taggedDecks,
        searchables: searchables,
        loggedIn: res.authenticate,
        username: res.username,
        messages: messages,
      });
    }
  } else {
    res.redirect('/')
  };
});

router.post("/select/:id", authenticateLogin, restrictRoute, async function (req, res, next) {
  const currentCookie = req.cookies.selected_cards;
  if (currentCookie == null) {
    res.cookie("selected_cards", [req.params.id]);
    res.redirect("/");
  } else {
    console.log("FAILED");
    res.redirect("/");
  };
});

module.exports = router;

// } else if (req.query.search != cardName || req.query.search != deckName || req.query.search != tag ) {
//   res.send("No cards, decks, or tags matched your search");