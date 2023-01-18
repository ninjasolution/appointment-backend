const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const StockOrderSchema = new mongoose.Schema({
    supplier: {
      type: Number,
      ref: "User"
    },
    products: [{
      type: {
        product: {
          type: Number,
          ref: "Product"
        },
        quantity: Number,
        cost: Number
      }
    }],
    status: {
      type: Number,
      default: 0
    }
  });
  StockOrderSchema.plugin(autoIncrement.plugin, "StockOrder")
  StockOrderSchema.plugin(timestamps);

  const StockOrder = connection.model(
    "StockOrder",
    StockOrderSchema
  );
  return StockOrder;
}
