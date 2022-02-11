const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model.js');

passport.serializeUser((user, next) => {
    next(null, user.id);
});

passport.deserializeUser((id, next) => {
    User.findById(id)
        .then(user => {
            next(null, user);
        })
        .catch(err => next(err));
});

passport.use('local-auth', new LocalStrategy (
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    (email, password, next) => {
        User.findOne( { email: email } )
            .then(userFound => {
                if(!userFound) {
                    next(null, false, { error: 'Email or Password are incorrect' })
                } else {
                    return userFound.checkPassword(password)
                        .then(match => {
                            if(!match){
                                next(null, false, { error: 'Email or Password are incorrect' })
                            } else {
                                next(null, userFound)
                            }
                        })
                }
            })
            .catch(err => next(err))
    }
))
