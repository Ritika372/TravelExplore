const express = require('express');
const UserController = require('../Controllers/userControllers');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch(
  '/updatepassword',
  authController.protect,
  authController.updatePassword
);

router.get(
  '/me',
  authController.protect,
  UserController.getMe,
  UserController.getUser
);
router.patch('/updateMe', authController.protect, UserController.updateMe);
router.delete('/deleteMe', authController.protect, UserController.deleteMe);
router
  .route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser);

router
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

module.exports = router;
