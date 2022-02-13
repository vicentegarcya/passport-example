const express = require('express');
const router = express.Router();

const upload = require('../config/storage.config');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/users.controller');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware');

const passport = require('passport');
const SCOPE = [ "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email" ]

router.get('/', (req, res, next) => {
  res.render('index')
})

// Authentication routes
router.get('/register', isNotAuthenticated, authController.register);
router.post('/register', isNotAuthenticated, upload.single('image'), authController.doRegister);
router.get('/login', isNotAuthenticated, authController.login);
router.post('/login', isNotAuthenticated, authController.doLogin);
router.get('/logout', isAuthenticated, authController.logout);

router.get('/login/google', passport.authenticate('google-auth', { scope: SCOPE }));
router.get('/auth/google/callback', authController.doLoginGoogle);

router.get('/activate/:token', isNotAuthenticated, authController.activate);

// User routes
router.get('/profile', isAuthenticated, userController.profile);

module.exports = router;