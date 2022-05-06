const express = require('express');
const router = express.Router();
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');


// GET HOME PAGE

router.get('/', authenticateLogin, async function(req, res, next) {
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
  
  // CARD RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
  cards.forEach((card) => {
    let averageRating = (card.ratings.reduce(function (a, b) { return +a + +b }, 0) / card.ratings.length)
    if (averageRating > 0 && averageRating < 1.5) {
      card.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 1.5 && averageRating < 2.5) {
      card.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 2.5 && averageRating < 3.5) {
      card.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 3.5 && averageRating < 4.5) {
      card.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 4.5) {
      card.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>`
    } else {
      card.stars = `
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    }
  })

  // CARD RATING: DETERMINE RATING AND ADD TEMPLATE LITERAL TO EACH card.rating
  decks.forEach((deck) => {
    let averageRating = (deck.ratings.reduce(function (a, b) { return +a + +b }, 0) / deck.ratings.length)
    if (averageRating > 0 && averageRating < 1.5) {
      deck.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 1.5 && averageRating < 2.5) {
      deck.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 2.5 && averageRating < 3.5) {
      deck.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 3.5 && averageRating < 4.5) {
      deck.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star'></i>`
    } else if (averageRating >= 4.5) {
      deck.stars = `
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>
      <i class='fa fa-star' style='color:#f3da35'></i>`
    } else {
      deck.stars = `
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>
      <i class='fa fa-star'></i>`
    }
  })



  let messages = [];
  res.render('index', { cards: cards, decks: decks, searchables: searchables, loggedIn: res.authenticate, username: res.username, messages: messages });
});

// SELECT CARDS

router.get('/select/:id', authenticateLogin, restrictRoute, async function (req, res, next) {
  let currentCookie = req.cookies.selected_cards;
  let cards = await Card.find({}).lean();
  let id = [req.params.id]
  
  if (currentCookie == undefined) {
    res.cookie('selected_cards', JSON.stringify(id));
  } else {
    let parsedCookie = JSON.parse(currentCookie);
    let unselect = false
    
    parsedCookie.forEach((id) => {
      console.log(id)
      console.log(req.params.id)
      if (id == req.params.id) {
        unselect = true
      }
    })
    
    if (unselect == false) {
      parsedCookie.push(req.params.id)
      console.log("SELECTED CARD IDs:", parsedCookie)
      res.clearCookie('selected_cards')
      res.cookie('selected_cards', JSON.stringify(parsedCookie))
    } else {
      let cookie = parsedCookie
      cookie.forEach((id, i) => {
        if (req.params.id == id) {
          parsedCookie.splice(i,1)
        }
        res.clearCookie('selected_cards')
        if (parsedCookie.length > 0) {
          res.cookie('selected_cards', JSON.stringify(cookie))
          console.log("UNSELECTED CARD IDs:", parsedCookie)
        }
      })
    }
  }
  
  res.redirect('/')
})

module.exports = router;