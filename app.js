require('dotenv/config');

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const flash = require('connect-flash')

require('./config/db.config');
require('./config/hbs.config');

const app = express();

/**
 * Middlewares
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(flash());


/**
 * Configure Session
 */
const sessionConfig = require('./config/session.config');
app.use(sessionConfig);


/**
 * Passport
 */
const passport = require('passport');
require('./config/passport.config')
app.use(passport.initialize());
app.use(passport.session());

/**
 * View setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
 * Flash Middleware
*/
app.use((req, res, next) => {
  res.locals.flashMessage = req.flash('flashMessage');
  next();
})

/**
 * Configure routes
 */
const router = require('./config/routes.config');
app.use('/', router);

app.use((req, res, next) => {
  next(createError(404, 'Page not found'));
});

app.use((error, req, res, next) => {
  console.error(error);
  let status = error.status || 500;

  res.status(status).render('error', {
    message: error.message,
    error: req.app.get('env') === 'development' ? error : {},
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(`Ready! Listening on port ${port}`);
});