const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
exports.getUsers = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route isnt defined yet',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route isnt di=efined yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route isnt di=efined yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'failure',
    message: 'Route isnt di=efined yet',
  });
};
