const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const CurrencySchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    }
  });
  CurrencySchema.plugin(autoIncrement.plugin, "Currency")
  CurrencySchema.plugin(timestamps);

  const Currency = connection.model(
    "Currency",
    CurrencySchema
  );
  return Currency;
}
