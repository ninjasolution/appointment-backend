const mongoose = require("mongoose");


module.exports = (connection, autoIncrement) => {

  const TipSchema = new mongoose.Schema({
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
  TipSchema.plugin(autoIncrement.plugin, "Tip")

  const Tip = connection.model(
    "Tip",
    TipSchema
  );
  return Tip;
}
