const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const { DB } = require('../config/db.config');

const sessionMaxAge = process.env.SESSION_MAXAGE || 7;

const sessionConfig = expressSession({
    secret: process.env.SECRET_COOKIE || 'This is super secret! Change it!',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 3600 * 1000 * sessionMaxAge,
        httpOnly: true
    },
    store: new MongoStore({
        mongoUrl: DB,
        ttl: 24 * 3600 * sessionMaxAge
    })
})



module.exports = sessionConfig;