const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');

router.get('/', authenticateLogin, async function(req, res, next) {
    const card = await Card.findByIdAndDelete(req.params.id);
    console.log(req.params.id)
    res.redirect('/')
})

module.exports = router;