const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const OrderSchema = new mongoose.Schema({
    carts: [{
      type: Number,
      ref: "Cart"
    }],
    note: {
      type: String
    },
    status: {
      type: Number,
      default: 0
    },
    tip: {
      type: Number,
      default: 0
    },
    type: {
      type: Number
    },
    user: {
      type: Number,
      ref: "User"
    },
    to: {
      type: Number,
      ref: "User"
    }
  });
  OrderSchema.plugin(autoIncrement.plugin, "Order")
  OrderSchema.plugin(timestamps);

  const Order = connection.model(
    "Order",
    OrderSchema
  );
  return Order;
}
