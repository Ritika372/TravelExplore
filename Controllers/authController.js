const { promisify } = require('util');
const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  //security flaw as any user can sepcify the role as admin
  //const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //after signing in, he should be logged in also
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError('Please enter email and password!', 400));
  }
  const user = await User.findOne({ email }).select('password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError('Invalid login credentials!', 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check if token is there
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new appError('You are not logged in! Please login first', 401));
  }

  //verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check if user still exists
  const currUser = await User.findById(decoded.id);
  if (!currUser)
    return next(
      new appError('The user belonging to this token no longer exists')
    );

  //check if user has recently changed his password
  const changed = await currUser.changedPasswordAfter(decoded.iat);
  if (changed) {
    return next(
      new appError(
        'Password is modified after the token was issued!. Please login again!',
        401
      )
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new appError('Permission not granted', 403));
    }
    next();
  };
};
