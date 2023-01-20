const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');
const mongoosePaginate = require('mongoose-paginate-v2');


module.exports = (connection, autoIncrement) => {

  const StockSchema = new mongoose.Schema({
    product: {
      type: Number,
      ref: "Product"
    },
    quantity: {
      type: Number
    },
    type: {
      type: Number
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  StockSchema.plugin(autoIncrement.plugin, "Stock")
  StockSchema.plugin(timestamps);
  StockSchema.plugin(mongoosePaginate);

  const Stock = connection.model(
    "Stock",
    StockSchema
  );
  return Stock;
}
