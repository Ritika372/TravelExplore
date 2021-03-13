const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (fields.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //craete error if user tries to update passowrd
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new appError(
        'Not for password updating, use another route /updatepassword',
        400
      )
    );
  }

  //filter unwanted fields,
  const filteredBody = filterObj(req.body, 'name', 'email');

  //update user data
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false }, { new: true });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route isnt defined yet and please use signup instead',
  });
};

//Do NOT update password with this.
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
