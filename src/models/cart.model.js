const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const CartSchema = new mongoose.Schema({
    product: {
      type: Number,
      ref: "Product"
    },
    quantity: {
      type: Number
    },
    price: {
      type: Number,
    }
  });
  CartSchema.plugin(autoIncrement.plugin, "Cart")
  CartSchema.plugin(timestamps);

  const Cart = connection.model(
    "Cart",
    CartSchema
  );
  return Cart;
}
