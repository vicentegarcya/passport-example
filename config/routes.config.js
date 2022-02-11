const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/users.controller');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', (req, res, next) => {
  res.render('index')
})

// Authentication routes
router.get('/register', isNotAuthenticated, authController.register);
router.post('/register', isNotAuthenticated, authController.doRegister);
router.get('/login', isNotAuthenticated, authController.login);
router.post('/login', isNotAuthenticated, authController.doLogin);
router.get('/logout', isAuthenticated, authController.logout);

// User routes
router.get('/profile', isAuthenticated, userController.profile);

module.exports = router;