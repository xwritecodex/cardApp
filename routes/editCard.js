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
    res.render('editCard', {card: card, loggedIn: res.authenticate, username: res.username})
})

router.post('/', authenticateLogin, async function(req, res, next) {
    let card = await Card.findByIdAndUpdate(req.params.id, req.body);

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
    }
    card.save()
    res.redirect('/')
})

module.exports = router;