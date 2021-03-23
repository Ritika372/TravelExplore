const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');
const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);

router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);

router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
module.exports = router;
