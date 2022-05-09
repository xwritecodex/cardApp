const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const CardTag = require('../models/CardTag');
const DeckTag = require('../models/DeckTag');
const User = require('../models/User');


// GET LOGIN USER PAGE

router.get('/login', async function(req, res, next) {
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
  res.render('login', { searchables: searchables });
})

// POST USER LOGIN

router.post('/login', async function(req, res) {
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


  const {username, password} = req.body;
  let user;
  let match;

  if (username != '' && password != '') {
    if (username.length < 5 ) {
      return res.render('login', { messages: ["Username must be at least 5 aplhanumeric chars in length."], searchables: searchables });
    } else if (password.length < 8 || !(/^[a-zA-Z\d\-_]+$/.test(password))) {
      return res.render('login', { messages: ["Password must be at least 8 aplhanumeric chars in length."], searchables: searchables });
    } else {
      user = await User.findOne({username: username});
      if (user != null) {
        match = await bcrypt.compare(password, user.password);
      } else {
        return res.render('login', { messages: ["User not found."], searchables: searchables });
      }
    }
  } else {
    return res.render('login', { messages: ["Please fill in all fields!"], searchables: searchables });
  }

  if (match) {
    const payload = { id: user._id, username: username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '6h'});

    res.cookie('access_token', token);

    res.redirect('/');

  } else {
    res.render('login', { messages: ["Invalid password."], searchables: searchables });
  }
})


// GET REGISTER USER PAGE

router.get('/register', async function(req, res, next) {
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

  res.render('register',{ searchables: searchables });
});

// POST NEW USER

router.post('/register', async function(req, res, next) {
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


  const {username, userImageUrl, password, repeatPassword} = req.body;

  if (username != '' && password != '' && repeatPassword != '') {
    if (password != repeatPassword) {
      return res.render('register', { messages: ["Password does not match re-password!"], searchables: searchables });
    } else {
      if (password.length < 8 || !(/^[a-z\d\-_]+$/.test(password))) {
        return res.render('register', { messages: ["Password must be at least 8 aplhanumeric chars in length."], searchables: searchables });
      } else {
        const salt = bcrypt.genSaltSync(+process.env.SALT);
        const hash = bcrypt.hashSync(password, salt);
        const newUser = new User({
          username,
          password: hash,
          userImageUrl
        });
        newUser.save((err) => {
          if (err) {
            const errMsg = newUser.validateSync().errors;
            let messages = [];
            if (errMsg.username) {
                console.log(errMsg.username.properties.message);
                messages.push(errMsg.username.properties.message);
            };
            return res.render('register', { messages: messages, searchables: searchables });
          } else {
            return res.render('login',{ searchables: searchables });
          };
        });
      };
    };
  } else {
    res.render('register', { messages: ["Please fill in all fields!"], searchables: searchables });
  }
});

// LOGOUT USER

router.get('/logout', function(req, res, next) {
  res.clearCookie('access_token');
  res.clearCookie("selected_cards");
  res.redirect('/');
});

module.exports = router;