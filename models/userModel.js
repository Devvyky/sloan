const mongoose = require("mongoose");
const validator = require("validator");

// //const slugify = require('slugify');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "A school must have a name"],
    unique: true,
    trim: true,
    minlength: [8, "A user's fullname must be more than 8 characters"],
    maxlength: [
      100,
      "A user's fullname must be less than or equal to 100 characters",
    ],
  },
  email: {
    type: String,
    required: [true, "Email is required for registration"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "A user must have a phone number!"],
    unique: true,
  },
  school: {
    type: String,
    required: [true, "A user must be enrolled in a School!"],
  },
  password: {
    type: String,
    required: [true, "Password is required to register a user!"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password confirm should match password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  pin: {
    type: Number,
    minlength: [6, "Pin should be less characters"],
    maxlength: [6, "Pin should be 6 characters "],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // hask password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm field
  this.passwordConfirm = undefined;

  next();
});

// instance method to check if incoming password matches existing school password
userSchema.methods.correctPassword = async function (
  incomingPassword,
  schoolPassword
) {
  return await bcrypt.compare(incomingPassword, schoolPassword);
};

// userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
//   if (this.passwordChangedAt) {
//     const changedTimestamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );

//     // console.log(this.passwordChangedAt,JWTTimestamp);
//     return JWTTimestamp < changedTimestamp;
//   }

//   // No pasword change yet
//   return false;
// };

const User = mongoose.model("Users", userSchema);

module.exports = User;
