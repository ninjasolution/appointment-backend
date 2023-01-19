const mongoose = require("mongoose");
var timestamps = require('mongoose-unix-timestamp-plugin');

module.exports = (connection, autoIncrement) => {

  const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    nickName: {
      type: String
    },
    password: {
      type: String
    },
    email: {
      type: String,
    },
    businessName: {
      type: String
    },
    businessType: {
      type: String
    },
    teamSize: {
      type: Number
    },
    country: {
      type: String
    },
    location: {
      type: String
    },
    favourSoftwareType: {
      type: String
    },
    whereHear: {
      type: String
    },
    website: {
      type: String
    },
    gender: {
      type: Number
    },
    phone: {
      type: String
    },
    avatar: {
      type: String
    },
    birthdate: {
      type: Date
    },
    birthyear: {
      type: Number
    },
    status: {
      type: Number
    },
    authCode: {
      type: String
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    changePasswordAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    employment: {
      type: Object
    },
    enableBooking: {
      type: Boolean
    },
    services: [{
      type: Number,
      ref: "Service"
    }],
    commission: {
      type: Object
    },
    permission: {
      type: Number
    },
    roles: [
      {
        type: Number,
        ref: "Role"
      }
    ],
    clients: [
      {
        type: Number,
        ref: "User"
      }
    ],
    suppliers: [
      {
        type: Number,
        ref: "User"
      }
    ],
    members: [
      {
        type: Number,
        ref: "User"
      }
    ],
    tokens: [
      {
        type: Number,
        ref: "Token"
      }
    ]
  })
  
  UserSchema.plugin(timestamps)
  UserSchema.plugin(autoIncrement.plugin, "User")
  
  const User = connection.model(
    "User",
    UserSchema  
  );

  return User;
}
