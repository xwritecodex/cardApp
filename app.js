const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

// PAGE ROUTES
const indexRouter = require('./routes/index');
const aboutRouter = require('./routes/about');
const usersRouter = require('./routes/users');
const createCardRouter = require('./routes/createCard');
const createDeckRouter = require('./routes/createDeck');
const searchRouter = require('./routes/search');
const userAccountRouter = require('./routes/userAccount');
const rateRouter = require('./routes/rate');
const collectRouter = require('./routes/collect');
const cardViewRouter = require('./routes/cardView');
const deckViewRouter = require('./routes/deckView');
const deleteCardRouter = require('./routes/deleteCard');
const deleteDeckRouter = require('./routes/deleteDeck');
const editCardRouter = require('./routes/editCard');
const editDeckRouter = require('./routes/editDeck');



// HIDE YOUR MONGO CONNECTION VARIABLES 

require('dotenv').config();


// MONGO DB CONNECTION

mongoose.connect(process.env.DB_URI, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(res => console.log("MongoDB connected!"))
.catch(err => console.log(err));


// VIEW ENGINE SETUP

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(__dirname + '/views/partials');


// UNRESTRICTED ROUTES

app.use('/', indexRouter);

app.use('/about', aboutRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/cardView/:id', cardViewRouter);
app.use('/deckView', deckViewRouter);


// RESTRICTED ROUTES

app.use('/users/logout', usersRouter);
app.use('/createCard', createCardRouter);
app.use('/createDeck', createDeckRouter);
app.use('/userAccount', userAccountRouter);
app.use('/rate', rateRouter);
app.use('/collect/:id', collectRouter);
app.use('/delete/:id', deleteCardRouter);
app.use('/deleteDeck/:id', deleteDeckRouter);
app.use('/editCard/:id', editCardRouter);
app.use('/editDeck/:id', editDeckRouter);

// CATCH 404 AND FORWARD TO ERROR HANDLER

app.use(function(req, res, next) {
  next(createError(404));
});


// ERROR HANDLER

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // RENDER THE ERROR PAGE

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;