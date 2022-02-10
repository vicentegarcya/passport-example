const User = require('../models/User.model.js');
const mongoose = require('mongoose');

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
      if(err instanceof mongoose.error.ValidationError){
        renderWithErrors(err.errors)
      } else {
        next(err);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('auth/login', )
}