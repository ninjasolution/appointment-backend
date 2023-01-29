const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    type: {
      type: Number, //limit, unlimit
      default: 0
    },
    CountOfSale: {
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
    enableOnline: {
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
  MembershipSchema.plugin(mongoosePaginate);
  MembershipSchema.plugin(timestamps);

  const Membership = connection.model(
    "Membership",
    MembershipSchema
  );
  return Membership;
}
