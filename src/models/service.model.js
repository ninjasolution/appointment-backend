const mongoose = require("mongoose");
var timestamps = require('mongoose-unix-timestamp-plugin');

module.exports = (connection, autoIncrement) => {

  const ServiceSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    user: {
      type: Number,
      ref: "User"
    },
    treatment: {
      type: Number,
      ref: "Treatment"
    },
    description: {
      type: String
    },
    aftercareDescription: {
      type: String
    },
    target: {
      type: Number,
      default: 0
    },
    members: [{
      type: Number,
      ref: "User"
    }],
    enableOnline: {
      type: Boolean,
      default: false
    },
    priceAndDurations: [{
      type: Object,
    }],
    extraTime: {
      type: Object
    },
    tax: {
      type: Number,
      ref: "Tax"
    },
    enableVoucherSale: {
      type: Boolean,
      default: false
    },
    voucherExpierPeriod: {
      type: Number,
      default: 0
    },
    enableMemberCommission: {
      type: Boolean,
      default: false
    },
    enableUpsell: {
      type: Boolean,
      default: false
    },
    upsellServices: [{
      type: Number,
      ref: "Service"
    }],
    discountPercent: {
      type: "Number",
      percent: 0.0
    }
  })
  
  ServiceSchema.plugin(timestamps)
  ServiceSchema.plugin(autoIncrement.plugin, "Service")
  
  const Service = connection.model(
    "Service",
    ServiceSchema  
  );

  return Service;
}
