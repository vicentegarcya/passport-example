const User = require('../models/User.model.js');
const mongoose = require('mongoose');
const passport = require('passport');
const mailer = require('../config/mailer.config')

module.exports.register = (req, res, next) => {
  res.render('auth/register');
};

module.exports.doRegister = (req, res, next) => {
  const user = { name, email, password } = req.body;

  const renderWithErrors = (errors) => {
    res.render('auth/register', { errors, user: req.body })
  }

  User.findOne({ email: email })
    .then((userFound) => {
      if(userFound) {
        renderWithErrors( { email: 'Email already in use' } );
      } else {
        if(req.file) {
          user.image = req.file.path;
        }
        return User.create(user)
          .then((createdUser) => {
            mailer.sendActivationEmail(createdUser.email, createdUser.activationToken);
            req.flash('flashMessage', 'We have send you an email to complete your registration');
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

const login = (req, res, next, provider) => {
  passport.authenticate(provider || 'local-auth', (err, user, validations) => {
    if(err) {
      next(err);
    } else if(!user){
      res.status(404).render('auth/login', { errors: { email: validations.error } })
    } else {
      req.login(user, (loginError) => {
        if(loginError) {
          next(loginError);
        } else {
          req.flash('flashMessage', 'You have succesfully signed in');
          res.redirect('/profile');
        }
      })
    }
  })(req, res, next)
}

module.exports.doLogin = (req, res, next) => {
  login(req, res, next);
}

module.exports.doLoginGoogle = (req, res, next) => {
  login(req, res, next, 'google-auth');
}

module.exports.activate = (req, res, next) => {
  const activationToken = req.params.token;

  User.findOneAndUpdate({
    activationToken,
    active: false
  },
  { active: true })
    .then(() => {
      req.flash('flashMessage', 'You have activated your account. Welcome!')
      res.redirect('/login');
    })
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}