const mongoose = require("mongoose");

module.exports = (connection, autoIncrement) => {

  const BrandSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    user: {
      type: Number,
      ref: "User"
    }
  });
  BrandSchema.plugin(autoIncrement.plugin, "Brand")

  const Brand = connection.model(
    "Brand",
    BrandSchema
  );
  return Brand;
}
