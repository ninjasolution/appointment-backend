const mongoose = require("mongoose");
var timestamps = require('mongoose-unix-timestamp-plugin');

module.exports = (connection, autoIncrement) => {

  const VoucherSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    value: {
      type: Number
    },
    retailPrice: {
      type: Number
    },
    enableLimitedSale: {
      type: Boolean,
      default: false
    },
    services: [{
      type: Number,
      ref: "Service"
    }],
    count: {
      type: Number
    },
    duration: {
      type: Number
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    user: {
      type: Number,
      ref: "User"
    }
  })
  
  VoucherSchema.plugin(timestamps)
  VoucherSchema.plugin(autoIncrement.plugin, "Voucher")
  
  const Voucher = connection.model(
    "Voucher",
    VoucherSchema  
  );

  return Voucher;
}
