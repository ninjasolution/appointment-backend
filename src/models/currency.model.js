const mongoose = require("mongoose");


module.exports = (connection, autoIncrement) => {

  const CurrencySchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    }
  });
  CurrencySchema.plugin(autoIncrement.plugin, "Currency")

  const Currency = connection.model(
    "Currency",
    CurrencySchema
  );
  return Currency;
}
