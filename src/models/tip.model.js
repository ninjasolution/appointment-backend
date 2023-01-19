const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const TipSchema = new mongoose.Schema({
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
  TipSchema.plugin(autoIncrement.plugin, "Tip")
  TipSchema.plugin(timestamps);

  const Tip = connection.model(
    "Tip",
    TipSchema
  );
  return Tip;
}
