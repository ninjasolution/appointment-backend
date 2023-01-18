const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const MembershipSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    description: {
      type: String,
    },
    services: [{
      type: Number,
      ref: "Service"
    }],
    enableLimit: {
      type: Boolean,
      default: false
    },
    numberOfSession: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number
    },
    price: {
      type: Number
    },
    tax: {
      type: Number,
      ref: "Tax"
    },
    color: {
      type: String
    },
    enableOnlineSale: {
      type: Boolean,
      default: false
    },
    condition: {
      type: String
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  MembershipSchema.plugin(autoIncrement.plugin, "Membership")
  MembershipSchema.plugin(timestamps);

  const Membership = connection.model(
    "Membership",
    MembershipSchema
  );
  return Membership;
}
