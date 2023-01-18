const mongoose = require("mongoose");
const timestamps = require('mongoose-timestamp');


module.exports = (connection, autoIncrement) => {

  const BrandSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  BrandSchema.plugin(autoIncrement.plugin, "Brand")
  BrandSchema.plugin(timestamps);

  const Brand = connection.model(
    "Brand",
    BrandSchema
  );
  return Brand;
}
