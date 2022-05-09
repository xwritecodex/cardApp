const express = require('express');
const router = express.Router({mergeParams: true});
const authenticateLogin = require('../middleware/authenticateLogin');
const restrictRoute = require('../middleware/restrictRoute');
const Deck = require('../models/Deck');
const Card = require('../models/Card');
const User = require('../models/User');

router.get('/', authenticateLogin, restrictRoute, async function(req, res, next) {
    const user = await User.findById(res.id);
    console.log("to test req.params.id", req.params.id)
    let collected = false;

    user.cardCollection.forEach((id) => {
        if (id == req.params.id) {
            collected = true;
        }
    })

    if (collected == false) {
        user.cardCollection.push(req.params.id);
        console.log("card was added to the users collection", user);
    } else {
       await User.findByIdAndUpdate(res.id, {$pull: {cardCollection: req.params.id}})
    }
    user.save()
    
    

    res.redirect('/')
})

module.exports = router;
