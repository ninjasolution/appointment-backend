const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const StockTakeSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    description: {
      type: String
    },
    products: [{
      type: {
        product: {
          type: Number,
          ref: "Product"
        },
        preCount: Number,
        newCount: Number,
        cost: Number
      }
    }],
    status: {
      type: Number,
      default: 0
    },
    note: {
      type: String
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  StockTakeSchema.plugin(autoIncrement.plugin, "StockTake")
  StockTakeSchema.plugin(timestamps);

  const StockTake = connection.model(
    "StockTake",
    StockTakeSchema
  );
  return StockTake;
}
