const mongoose = require("mongoose");


module.exports = (connection, autoIncrement) => {

  const TaxSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    percent: {
      type: Number
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  TaxSchema.plugin(autoIncrement.plugin, "Tax")

  const Tax = connection.model(
    "Tax",
    TaxSchema
  );
  return Tax;
}
