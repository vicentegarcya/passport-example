const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User.model.js');
const mongoose = require('mongoose');

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

passport.use('google-auth', new GoogleStrategy (
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    (accessTooken, refreshToken, profile, next) => {
        const email = profile.emails[0] ? profile.emails[0].value : undefined;
        const googleID = profile.id;
        const name = profile.displayName;

        if (email && googleID) {
            User.findOne( { $or: [ { email }, { googleID } ] } )
                .then(userFound => {
                    if(userFound) {
                        next(null, userFound);
                    } else {
                        return User.create({
                            email,
                            name,
                            password: mongoose.Types.ObjectId(),
                            googleID
                        })
                            .then((user) => {
                                next(null, user);
                            })
                    }
                })
                .catch(err => next(err));
        } else {
            next(null, false, { error: 'Error loging with Google' });
        }
    }
))
