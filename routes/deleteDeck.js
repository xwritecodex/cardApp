const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');

router.get('/', authenticateLogin, async function(req, res, next) {

    await Deck.findByIdAndDelete(req.params.id).exec();
    res.redirect('/')
})

module.exports = router;