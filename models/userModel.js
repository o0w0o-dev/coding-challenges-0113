"use strict";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    maxlength: [60, "The email must have less or equal then 60 characters"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "The password must have more or equal then 8 characters"],
    maxlength: [60, "The password must have less or equal then 60 characters"],
    validate: {
      validator: function (el) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/.test(el);
      },
      message:
        "The password contain at least 1 character of each: a-z, A-Z, 0-9",
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  lastLogout: Date,
});

// encrypt password for user creation
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// verify user password
userSchema.methods.correctPassword = async function (
  plainTextPassword,
  userPassword
) {
  return await bcrypt.compare(plainTextPassword, userPassword);
};

userSchema.methods.checkExpires = function (JWTTimestamp) {
  if (this.lastLogout) {
    const lastLogoutTimestamp = this.lastLogout.getTime();
    // console.log({
    //   lastLogoutTimestamp,
    //   JWTTimestamp: JWTTimestamp * 1000,
    //   result: JWTTimestamp * 1000 < lastLogoutTimestamp,
    // });
    return JWTTimestamp * 1000 < lastLogoutTimestamp;
  }

  return false;
};

const User = mongoose.model("User", userSchema);

export { User };
