const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const TaxSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
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
  TaxSchema.plugin(timestamps);

  const Tax = connection.model(
    "Tax",
    TaxSchema
  );
  return Tax;
}
