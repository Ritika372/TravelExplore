const express = require('express');
const viewController = require('../Controllers/viewController');
const authController = require('../Controllers/authController');
const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);

router.get('/tours/:slug', viewController.getTour);

router.get('/login', viewController.getLoginForm);

module.exports = router;
