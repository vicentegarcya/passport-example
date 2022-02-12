const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required',
    minLength: [3, 'Name needs at least 3 chars']
  },
  email: {
    type: String,
    required: 'Email is required',
    match: [EMAIL_PATTERN, 'Email is not valid'],
    unique: true
  },
  password: {
    type: String,
    required: 'Password is required',
    match: [PASSWORD_PATTERN, 'Password needs at least 8 chars'],
  },
  googleID: {
    type: String
  },
  image: {
    type: String
  }
});

userSchema.pre('save', function(next) {
  const user = this;

  if(user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(err => next(err));
  } else {
    next();
  }
})

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
}

const User = model('User', userSchema);

module.exports = User;