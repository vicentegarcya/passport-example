const User = require('../models/User.model.js');
const mongoose = require('mongoose');
const passport = require('passport');

module.exports.register = (req, res, next) => {
  res.render('auth/register');
};

module.exports.doRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  const renderWithErrors = (errors) => {
    res.render('auth/register', { errors, user: req.body })
  }

  User.findOne({ email: email })
    .then((userFound) => {
      if(userFound) {
        renderWithErrors( { email: 'Email already in use' } );
      } else {
        return User.create(req.body)
          .then(() => {
            res.redirect('/login');
          })
      }
    })
    .catch(err => {
      if(err instanceof mongoose.Error.ValidationError){
        renderWithErrors(err.errors)
      } else {
        next(err);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('auth/login', )
}

module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (err, user, validations) => {
    if(err) {
      next(err);
    } else if(!user){
      res.status(404).render('auth/login', { errorMessage: validations.error })
    } else {
      req.login(user, (loginError) => {
        if(loginError) {
          next(loginError);
        } else {
          res.redirect('/profile');
        }
      })
    }
  })(req, res, next)
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}