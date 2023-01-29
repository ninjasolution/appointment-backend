const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');


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
      type: Number //order, transfer, stocktake
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
  OrderSchema.plugin(mongoosePaginate);

  const Order = connection.model(
    "Order",
    OrderSchema
  );
  return Order;
}
