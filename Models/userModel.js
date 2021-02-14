const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Userschema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'This is not a valid email',
    },
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 8,
    select: false,
  },
  photo: {
    type: String,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm the password'],
    validate: {
      //Works only for CREATE and SAVE !!!!!!!!!!!
      validator: function (ele) {
        return ele === this.password;
      },
      message: 'Passwords doesnt match',
    },
  },
  passwordChangedAt: Date,
});

Userschema.pre('save', async function (next) {
  //only run if password is modified.
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

Userschema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

Userschema.methods.changedPasswordAfter = async function (JwtTimestamp) {
  if (this.passwordChangedAt) {
    //this.passwordChangedAt > JwtTimestamp
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    if (Number(changedTimestamp) > Number(JwtTimestamp)) return true;
  }

  return false;
};

const User = mongoose.model('User', Userschema);
module.exports = User;
